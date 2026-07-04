import React, { useState, useRef, useEffect } from 'react';
import {
    MessageSquare, Send, X, Loader2, User, HeadphonesIcon,
    RefreshCw, ChevronRight, Clock, CheckCircle2, Users, ArrowLeft
} from 'lucide-react';
import { useStaffChat } from '@/features/products/application/useStaffChat';
import type { ChatSessionSummary, LiveChatMessage } from '@/features/products/domain/models/chat/chat.model';

function renderMarkdown(text: string) {
    const safeText = text || '';
    const parts = safeText.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        return <span key={i}>{part}</span>;
    });
}

const MsgBubble: React.FC<{ msg: LiveChatMessage }> = ({ msg }) => {
    const isStaff = msg.role === 'staff';
    return (
        <div className={`flex gap-2 items-end ${isStaff ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm text-white ${isStaff ? 'bg-blue-600' : 'bg-slate-500'
                }`}>
                {isStaff ? <HeadphonesIcon className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </div>
            <div className={`max-w-[76%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isStaff
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                }`}>
                <span className="whitespace-pre-line">
                    {isStaff ? (msg.content || '') : renderMarkdown(msg.content)}
                </span>
                <p className={`text-[10px] mt-1 ${isStaff ? 'text-blue-200' : 'text-slate-400'}`}>
                    {(() => {
                        if (!msg.timestamp) return '';
                        // Nếu timestamp là String (từ API), convert nó sang Date object
                        const dateObj = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
                        // Kiểm tra xem Date có hợp lệ không (tránh lỗi Invalid Date)
                        return isNaN(dateObj.getTime())
                            ? ''
                            : dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                    })()}
                </p>
            </div>
        </div>
    );
};

const WaitingCard: React.FC<{
    session: ChatSessionSummary;
    onAccept: (s: ChatSessionSummary) => void;
}> = ({ session, onAccept }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all group">
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center shrink-0 text-white">
                    <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                        {session.customerName || 'Khách hàng'}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                        {session.lastMessage || '...'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] text-amber-500 font-medium">
                            {new Date(session.startedAt).toLocaleTimeString('vi-VN', {
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
            </div>
            <button
                onClick={() => onAccept(session)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
            >
                Accept
                <ChevronRight className="w-3 h-3" />
            </button>
        </div>
    </div>
);

export const StaffChatPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        waitingList,
        activeSessions,
        selectedSessionId,
        currentSession,
        sessionMessages,
        isSending,
        isLoadingList,
        fetchWaitingList,
        setSelectedSessionId,
        acceptSession,
        sendReply,
        closeSession,
    } = useStaffChat();

    useEffect(() => {
        if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [sessionMessages, isOpen]);

    useEffect(() => {
        if (isOpen && currentSession) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, currentSession]);

    const handleSend = () => {
        if (!inputValue.trim() || isSending) return;
        sendReply(inputValue);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClose = async () => {
        if (selectedSessionId) {
            await closeSession(selectedSessionId);
        }
    };

    // Hàm quay trở ra màn danh sách mà không hủy phòng chat của khách
    const handleBackToList = () => {
        setSelectedSessionId(null);
    };

    const totalPending = waitingList.length;
    // Kiểm tra xem hiện tại nhân viên có đang chọn mở 1 phòng cụ thể nào không
    const isInsideChat = currentSession !== null;

    return (
        <>
            <button
                id="staff-chat-toggle-btn"
                onClick={() => setIsOpen(p => !p)}
                title="Chat với khách hàng"
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen
                    ? 'bg-slate-700 hover:bg-slate-800'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
                    }`}
            >
                {isOpen
                    ? <X className="w-6 h-6 text-white" />
                    : <MessageSquare className="w-6 h-6 text-white" />
                }
                {totalPending > 0 && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-black text-white flex items-center justify-center border-2 border-white animate-pulse">
                        {totalPending > 9 ? '9+' : totalPending}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-96 h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                            {isInsideChat && (
                                <button
                                    onClick={handleBackToList}
                                    title="Quay lại danh sách chờ"
                                    className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors mr-0.5 shrink-0"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            )}
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <HeadphonesIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-black text-white tracking-tight truncate">
                                    {isInsideChat ? `Chat — ${currentSession.customerName || 'Khách hàng'}` : 'Hỗ Trợ Khách Hàng'}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-lime-300 rounded-full animate-pulse" />
                                    <p className="text-[10px] text-blue-100">
                                        {isInsideChat ? 'Đang trong phiên hỗ trợ' : `${totalPending} khách đang chờ`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            {isInsideChat && (
                                <button
                                    onClick={handleClose}
                                    title="Kết thúc phiên"
                                    className="flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-[10px] font-bold text-white transition-colors shadow-sm"
                                >
                                    <CheckCircle2 className="w-3 h-3" />
                                    Kết thúc
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <X className="w-3.5 h-3.5 text-white/80" />
                            </button>
                        </div>
                    </div>

                    {isInsideChat ? (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                                {sessionMessages.map((msg, i) => (
                                    <MsgBubble key={i} msg={msg} />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
                                <input
                                    ref={inputRef}
                                    id="staff-chat-input"
                                    type="text"
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Nhập phản hồi..."
                                    disabled={isSending}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-60"
                                />
                                <button
                                    id="staff-chat-send-btn"
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isSending}
                                    className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shrink-0 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isSending
                                        ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                                        : <Send className="w-4 h-4 text-white" />
                                    }
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {/* Khối danh sách các phòng đang chat dở dang (Active Sessions) */}
                            {activeSessions.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                                        <span className="text-xs font-bold text-slate-600">
                                            Phiên đang phục vụ ({activeSessions.length})
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {activeSessions.map(session => (
                                            <div
                                                key={session.id}
                                                onClick={() => setSelectedSessionId(session.id)}
                                                className="bg-blue-50/40 hover:bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-all"
                                            >
                                                <div className="min-w-0 flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                                        {session.customerName ? session.customerName.charAt(0).toUpperCase() : 'K'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-800 truncate">{session.customerName || 'Khách hàng'}</p>
                                                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{session.lastMessage || 'Đang kết nối...'}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-blue-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Khối danh sách khách hàng đang chờ (Waiting List) */}
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-500" />
                                    <span className="text-xs font-bold text-slate-600">
                                        Khách đang chờ ({totalPending})
                                    </span>
                                </div>
                                <button
                                    onClick={fetchWaitingList}
                                    disabled={isLoadingList}
                                    className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-bold transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-3 h-3 ${isLoadingList ? 'animate-spin' : ''}`} />
                                    Làm mới
                                </button>
                            </div>

                            {isLoadingList && waitingList.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                    <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-400" />
                                    <p className="text-sm font-medium">Đang tải danh sách...</p>
                                </div>
                            )}

                            {!isLoadingList && waitingList.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                    <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                                    <p className="text-sm font-semibold">Không có khách đang chờ</p>
                                    <p className="text-xs mt-1 opacity-70">Hệ thống sẽ tự cập nhật sau 10 giây</p>
                                </div>
                            )}

                            {waitingList.map(session => (
                                <WaitingCard
                                    key={session.id}
                                    session={session}
                                    onAccept={acceptSession}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};