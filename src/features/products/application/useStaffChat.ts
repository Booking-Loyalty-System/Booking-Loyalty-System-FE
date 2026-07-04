import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatRepositoryImplement } from '../infrastructure/repositories/chat/chat.repository.implement';
import type { ChatSessionSummary, LiveChatMessage } from '../domain/models/chat/chat.model';
import * as signalR from '@microsoft/signalr';

const chatRepo = new ChatRepositoryImplement();

interface ExtendedChatSessionSummary extends ChatSessionSummary {
    status?: string;
    messages?: LiveChatMessage[];
}

export const useStaffChat = () => {
    const [waitingList, setWaitingList] = useState<ChatSessionSummary[]>([]);
    const [activeSessions, setActiveSessions] = useState<ExtendedChatSessionSummary[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [isLoadingList, setIsLoadingList] = useState(false);

    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const signalRConnRef = useRef<signalR.HubConnection | null>(null);
    const selectedSessionIdRef = useRef<string | null>(null);

    useEffect(() => {
        selectedSessionIdRef.current = selectedSessionId;
    }, [selectedSessionId]);

    const fetchWaitingList = useCallback(async () => {
        setIsLoadingList(true);
        try {
            const list = await chatRepo.staffWaitingList();
            setWaitingList(list ?? []);
        } catch {
            setWaitingList([]);
        } finally {
            setIsLoadingList(false);
        }
    }, []);

    const fetchActiveSessions = useCallback(async () => {
        setIsLoadingList(true);
        try {
            const res = await chatRepo.staffActiveSession() as any;
            const sessions: ExtendedChatSessionSummary[] = res?.data || res || [];
            setActiveSessions(sessions);

            if (signalRConnRef.current && signalRConnRef.current.state === signalR.HubConnectionState.Connected) {
                for (const session of sessions) {
                    signalRConnRef.current.invoke("JoinSession", session.id)
                        .catch(err => console.error(`Lỗi join lại phòng ${session.id}:`, err));
                }
            }
        } catch (err) {
            console.error("Lỗi lấy danh sách phiên hoạt động:", err);
            setActiveSessions([]);
        } finally {
            setIsLoadingList(false);
        }
    }, []);

    const fetchSessionMessages = useCallback(async (sessionId: string) => {
        try {
            const res = await chatRepo.staffActiveSession() as any;
            const sessions: any[] = res?.data || res || [];
            const currentActiveSession = sessions.find((s: any) => s.id === sessionId);

            if (!currentActiveSession) return;

            const mappedHistory: LiveChatMessage[] = (currentActiveSession.messages || []).map((m: any) => ({
                role: m.senderType === 'User' || m.role === 'customer' ? 'customer' : 'staff',
                content: m.message || m.content,
                timestamp: new Date(m.createdAt || m.timestamp)
            }));

            setActiveSessions((prevSessions) => {
                return prevSessions.map(session => {
                    if (session.id === sessionId) {
                        return { ...session, messages: mappedHistory };
                    }
                    return session;
                });
            });
        } catch (err) {
            console.error("Lỗi khi tải lịch sử tin nhắn của phiên:", err);
        }
    }, []);

    useEffect(() => {
        if (selectedSessionId) {
            fetchSessionMessages(selectedSessionId);
        }
    }, [selectedSessionId, fetchSessionMessages]);

    useEffect(() => {
        fetchWaitingList();
        fetchActiveSessions();
        pollRef.current = setInterval(fetchWaitingList, 10000);
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [fetchWaitingList, fetchActiveSessions]);

    useEffect(() => {
        let isMounted = true;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7001/hubs/chat", {
                accessTokenFactory: () => localStorage.getItem('access_token') || ''
            })
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                if (!isMounted) {
                    connection.stop();
                    return;
                }
                console.log("Staff đã kết nối SignalR Hub!");
                signalRConnRef.current = connection;

                setActiveSessions(prev => {
                    prev.forEach(session => {
                        connection.invoke("JoinSession", session.id).catch(() => { });
                    });
                    return prev;
                });

                connection.on("ReceiveMessage", (msg: { chatSessionId?: string; senderType: string; message: string; createdAt: string }) => {
                    let mappedRole: 'customer' | 'staff' = msg.senderType === 'User' ? 'customer' : 'staff';

                    const newMsg: LiveChatMessage = {
                        role: mappedRole,
                        content: msg.message,
                        timestamp: new Date(msg.createdAt)
                    };
                    const targetSessionId = msg.chatSessionId || selectedSessionIdRef.current;

                    if (targetSessionId) {
                        setActiveSessions(prevSessions =>
                            prevSessions.map(s => {
                                if (s.id === targetSessionId) {
                                    const isExist = s.messages?.some(m =>
                                        m.content === newMsg.content &&
                                        m.role === newMsg.role &&
                                        Math.abs(new Date(m.timestamp).getTime() - newMsg.timestamp.getTime()) < 2000
                                    );
                                    if (isExist) return s;
                                    return { ...s, messages: [...(s.messages || []), newMsg] };
                                }
                                return s;
                            })
                        );
                    }
                });
            })
            .catch(err => {
                if (isMounted) console.error("Staff SignalR Error: ", err);
            });

        return () => {
            isMounted = false;
            if (connection.state === signalR.HubConnectionState.Connected) {
                connection.stop();
            }
        };
    }, []);

    const acceptSession = useCallback(async (session: ChatSessionSummary) => {
        try {
            await chatRepo.staffAccept(session.id);
            const newActiveSession: ExtendedChatSessionSummary = {
                ...session,
                status: 'HandledByStaff',
                messages: []
            };

            setActiveSessions(prev => [...prev, newActiveSession]);
            setSelectedSessionId(session.id);

            if (signalRConnRef.current) {
                await signalRConnRef.current.invoke("JoinSession", session.id);
            }
            setWaitingList(prev => prev.filter(s => s.id !== session.id));
        } catch (err) {
            console.error('Failed to accept session', err);
        }
    }, []);

    const sendReply = useCallback(async (text: string) => {
        if (!selectedSessionId || !text.trim() || isSending) return;
        setIsSending(true);

        try {
            await chatRepo.staffSend(selectedSessionId, { message: text.trim() });
            const myMsg: LiveChatMessage = {
                role: 'staff',
                content: text.trim(),
                timestamp: new Date()
            };

            setActiveSessions(prev =>
                prev.map(s => s.id === selectedSessionId ? { ...s, messages: [...(s.messages || []), myMsg] } : s)
            );
        } catch (err) {
            console.error('Failed to send staff message', err);
        } finally {
            setIsSending(false);
        }
    }, [selectedSessionId, isSending]);

    const closeSession = useCallback(async (sessionId: string) => {
        try {
            await chatRepo.staffClose(sessionId);
            if (signalRConnRef.current && signalRConnRef.current.state === signalR.HubConnectionState.Connected) {
                await signalRConnRef.current.invoke("LeaveSession", sessionId);
            }

            setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
            if (selectedSessionId === sessionId) {
                setSelectedSessionId(null);
            }
        } catch (err) {
            console.error('Failed to close session', err);
        }
    }, [selectedSessionId]);

    const currentSession = activeSessions.find(s => s.id === selectedSessionId) || null;
    const sessionMessages = currentSession ? (currentSession.messages || []) : [];

    return {
        waitingList, activeSessions, selectedSessionId, currentSession,
        sessionMessages, isSending, isLoadingList, fetchWaitingList,
        setSelectedSessionId, acceptSession, sendReply, closeSession,
    };
};