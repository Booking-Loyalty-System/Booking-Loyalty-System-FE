import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatRepositoryImplement } from '../infrastructure/repositories/chat/chat.repository.implement';
import * as signalR from '@microsoft/signalr';

// ─── Unified message type ────────────────────────────────────────────────────
export interface UnifiedMessage {
    role: 'user' | 'assistant' | 'staff' | 'system';
    content: string;
    timestamp: Date;
}

export interface HistorySession {
    id: string;
    customerName: string;
    status: string;
    staffName: string;
    createdAt: string;
    messages: Array<{
        senderType: 'User' | 'Staff' | 'Bot' | 'AI';
        message: string;
        createdAt: string;
    }>;
}

const chatRepo = new ChatRepositoryImplement();
// Đã xóa aiRepo vì giờ AI xài chung chatRepo

export const useCustomerChat = () => {
    // ─── States cơ bản ────────────────────────────────────────────────────────
    const [messages, setMessages] = useState<UnifiedMessage[]>([
        {
            role: 'assistant',
            content: 'Xin chào! Tôi là trợ lý AI của AutoWash Pro 🚗 Tôi có thể giúp bạn tìm hiểu về các gói dịch vụ, chi nhánh, hoặc hỗ trợ đặt lịch. Bạn cần hỗ trợ gì ạ?',
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLiveChat, setIsLiveChat] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    // ─── States phục vụ Lịch sử Chat ──────────────────────────────────────────
    const [viewMode, setViewMode] = useState<'chat' | 'history_list' | 'history_detail'>('chat');
    const [historySessions, setHistorySessions] = useState<HistorySession[]>([]);
    const [selectedOldMessages, setSelectedOldMessages] = useState<UnifiedMessage[]>([]);
    const [selectedSessionInfo, setSelectedSessionInfo] = useState<HistorySession | null>(null);
    const [isRemoteClosed, setIsRemoteClosed] = useState(false);

    // ─── Khởi tạo SignalR ─────────────────────────────────────────────────────
    useEffect(() => {
        if (connectionRef.current) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7001/hubs/chat", {
                accessTokenFactory: () => localStorage.getItem('access_token') || ''
            })
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log("Khách hàng đã kết nối SignalR thành công! ConnectionId:", connection.connectionId);
                connectionRef.current = connection;

                connection.on("ReceiveMessage", (msg: { senderType: string; message: string; createdAt: string }) => {
                    let mappedRole: 'user' | 'assistant' | 'staff' = 'assistant';
                    if (msg.senderType === 'User') mappedRole = 'user';
                    else if (msg.senderType === 'Staff') mappedRole = 'staff';
                    // Dự phòng trường hợp backend trả về AI qua SignalR
                    else if (msg.senderType === 'Bot' || msg.senderType === 'AI') mappedRole = 'assistant';

                    const newMsg: UnifiedMessage = {
                        role: mappedRole,
                        content: msg.message,
                        timestamp: new Date(msg.createdAt)
                    };

                    setMessages(prev => {
                        const isExist = prev.some(m =>
                            m.content === newMsg.content &&
                            m.role === newMsg.role &&
                            Math.abs(m.timestamp.getTime() - newMsg.timestamp.getTime()) < 3000
                        );
                        if (isExist) return prev;
                        return [...prev, newMsg];
                    });
                });

                connection.on("SessionClosed", (data: { chatSessionId: string, message: string }) => {
                    console.log("Nhận được sự kiện đóng phòng:", data);
                    // Đổi state sang true để kích hoạt mở Feedback bên phía Chatbox
                    setIsRemoteClosed(true);
                });
            })
            .catch(err => console.error("SignalR Connection Error: ", err));

        return () => {
            if (connection.state === signalR.HubConnectionState.Connected) {
                connection.stop();
            }
        };
    }, []);

    // ─── Join Session tự động khi có ID phòng ─────────────────────────────────
    useEffect(() => {
        if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected && currentSessionId) {
            connectionRef.current.invoke("JoinSession", currentSessionId)
                .catch(err => console.error("Không thể tham gia group chat:", err));
        }
    }, [currentSessionId]);

    // ─── Chuyển đổi trạng thái AI <-> Staff ──────────────────────────────────
    const connectToStaff = async () => {
        setIsLoading(true);
        try {
            const res = await chatRepo.customerToggleStatus('staff') as any;
            const sessionId = res?.id || res?.chatSessionId || res?.data?.chatSessionId;

            if (connectionRef.current && sessionId) {
                const safeSessionId = sessionId.toString().toLowerCase();
                setCurrentSessionId(safeSessionId);
                await connectionRef.current.invoke("JoinSession", safeSessionId);
            }

            setIsLiveChat(true);
            setMessages(prev => [
                ...prev,
                { role: 'system', content: 'Hệ thống đã chuyển sang chế độ Nhân viên hỗ trợ', timestamp: new Date() },
                { role: 'staff', content: 'Xin chào! Nhân viên chi nhánh gần nhất sẽ trực tiếp hỗ trợ bạn ngay bây giờ. Hãy đặt câu hỏi của bạn nhé.', timestamp: new Date() }
            ]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'system', content: 'Không thể kết nối với nhân viên hỗ trợ lúc này. Vui lòng thử lại sau.', timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    const connectToAI = async () => {
        setIsLoading(true);
        try {
            try { await chatRepo.customerToggleStatus('bot'); }
            catch { await chatRepo.customerToggleStatus('ai'); }

            setIsLiveChat(false);
            setMessages(prev => [
                ...prev,
                { role: 'system', content: 'Đã quay trở lại chế độ AI Trợ lý', timestamp: new Date() }
            ]);
        } catch {
            setIsLiveChat(false);
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Xử lý Gửi tin nhắn ───────────────────────────────────────────────────
    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isLoading) return;
        setIsLoading(true);

        try {
            // Thêm tin nhắn của user vào UI ngay lập tức
            setMessages(prev => [...prev, { role: 'user', content: text.trim(), timestamp: new Date() }]);

            // Gọi chung 1 API duy nhất cho cả AI và Live Chat
            const res = await chatRepo.customerSend({ message: text.trim() }) as any;
            console.log("Dữ liệu từ server trả về:", res);
            // Cập nhật session ID nếu có
            if (res && res.chatSessionId) {
                console.log("ID nhận được từ server:", res.chatSessionId); // Kiểm tra giá trị này
                setCurrentSessionId(res.chatSessionId);
                console.log("State đang được cập nhật với ID:", res.chatSessionId);
            }
            console.log(currentSessionId);
            // Nếu API gửi thẳng câu trả lời của AI trong response (thay vì qua SignalR)
            if (!isLiveChat && res && res.reply && res.reply !== "LIVE_CHAT_MODE") {
                const aiMsg: UnifiedMessage = { role: 'assistant', content: res.reply, timestamp: new Date() };
                setMessages(prev => {
                    if (prev.some(m => m.content === aiMsg.content && m.role === 'assistant')) return prev;
                    return [...prev, aiMsg];
                });
            }
        } catch {
            setMessages(prev => [...prev, { role: isLiveChat ? 'staff' : 'assistant', content: 'Xin lỗi, tôi gặp sự cố kết nối. Vui lòng thử lại sau.', timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    }, [isLiveChat, isLoading, currentSessionId]);

    // ─── Xử lý Lịch sử ────────────────────────────────────────────────────────
    const loadHistoryList = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await (chatRepo as any).getCustomerHistory();
            if (res && res.data) setHistorySessions(res.data);
            else if (Array.isArray(res)) setHistorySessions(res);
            setViewMode('history_list');
        } catch (error) {
            console.error("Lỗi lấy lịch sử chat:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSelectHistorySession = useCallback((session: HistorySession) => {
        setSelectedSessionInfo(session);
        const mappedMsgs: UnifiedMessage[] = session.messages.map(m => ({
            role: m.senderType === 'User' ? 'user' : 'staff',
            content: m.message,
            timestamp: new Date(m.createdAt)
        }));
        setSelectedOldMessages(mappedMsgs);
        setViewMode('history_detail');
    }, []);

    const endSession = async () => {
        try {
            if (currentSessionId) {
                // Gọi API đóng phiên
                await chatRepo.customerClose(currentSessionId);

                // Rời khỏi SignalR room nếu còn kết nối
                if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
                    await connectionRef.current.invoke("LeaveSession", currentSessionId);
                }
                setIsLiveChat(false);
            }
        } catch (err) {
            console.error("Lỗi khi kết thúc phiên chat:", err);
        }
    };

    const clearMessages = async () => {
        setViewMode('chat');
        setIsLiveChat(false);
        setCurrentSessionId(null);
        setIsRemoteClosed(false);
        setMessages([{ role: 'assistant', content: 'Xin chào! Tôi là trợ lý AI của AutoWash Pro 🚗 Bạn cần hỗ trợ gì ạ?', timestamp: new Date() }]);
    };

    return {
        messages, isLoading, isLiveChat, viewMode, historySessions, selectedOldMessages, selectedSessionInfo, currentSessionId, isRemoteClosed,
        sendMessage, connectToStaff, connectToAI, clearMessages, loadHistoryList, handleSelectHistorySession, setViewMode, endSession, setIsRemoteClosed
    };
};