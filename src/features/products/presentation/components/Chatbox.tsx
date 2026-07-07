import React, { useState, useRef, useEffect } from 'react';
import {
    MessageCircle, X, Send, Trash2, Bot, User,
    Loader2, Minimize2, HeadphonesIcon, ChevronDown, History, ArrowLeft, Star
} from 'lucide-react';
import { useCustomerChat, type UnifiedMessage } from '../../application/useCustomerChat';
import { useChatFeedback } from '../../application/useChatFeedback';
import { toast } from 'sonner';

// ─── Markdown helper ─────────────────────────────────────────────────────────
function renderMarkdown(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        return <span key={i}>{part}</span>;
    });
}

// ─── Message Bubble ──────────────────────────────────────────────────────────
const MessageBubble: React.FC<{ msg: UnifiedMessage }> = ({ msg }) => {
    const isUser = msg.role === 'user';
    const isSystem = msg.role === 'system';

    if (isSystem) {
        return (
            <div className="flex justify-center my-2">
                <span className="text-[11px] bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-full border border-slate-200">
                    {msg.content}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex gap-2 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm text-white ${isUser
                ? 'bg-blue-600'
                : msg.role === 'staff'
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : msg.role === 'staff' ? <HeadphonesIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isUser
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'
                }`}>
                <span className="whitespace-pre-line">{renderMarkdown(msg.content)}</span>
                <p className={`text-[10px] mt-1 ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
};

// ─── Typing Indicator ────────────────────────────────────────────────────────
const TypingIndicator: React.FC<{ isLiveChat: boolean }> = ({ isLiveChat }) => (
    <div className="flex gap-2 items-end">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm text-white ${isLiveChat ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
            {isLiveChat ? <HeadphonesIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
        </div>
        <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5 items-center">
            {[0, 150, 300].map(delay => (
                <span key={delay} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
            ))}
        </div>
    </div>
);

export const Chatbox: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const { submitFeedback } = useChatFeedback();

    const handleConfirmFeedback = async () => {
        if (!currentSessionId) {
            console.error("Không tìm thấy ID phiên chat");
            setIsFeedbackVisible(false);
            return;
        }

        const feedbackData = {
            chatSessionId: currentSessionId,
            rating: rating,
            comment: comment.trim()
        };
        try {
            await submitFeedback(feedbackData);
            toast.success("Cảm ơn bạn đã gửi đánh giá cho hệ thống!");
            setIsFeedbackVisible(false);
            setIsOpen(false);
            clearMessages();
            setRating(5);
            setComment('');
        }
        catch (error) {
            console.error("Lỗi khi gửi feedback:", error);
            toast.error("Có lỗi xảy ra khi gửi đánh giá, vui lòng thử lại sau.");
        }
    };

    const {
        messages, isLoading, isLiveChat, viewMode, historySessions, selectedOldMessages, selectedSessionInfo, currentSessionId,
        sendMessage, connectToStaff, connectToAI, clearMessages, loadHistoryList, handleSelectHistorySession, setViewMode, endSession,
        isRemoteClosed, setIsRemoteClosed
    } = useCustomerChat();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, selectedOldMessages, isOpen, isMinimized, isLoading, viewMode]);

    useEffect(() => {
        if (isRemoteClosed) {
            setIsFeedbackVisible(true);
            toast.info("Nhân viên đã kết thúc phiên hỗ trợ. Vui lòng đánh giá dịch vụ!");

            setIsRemoteClosed(false);
        }
    }, [isRemoteClosed, setIsRemoteClosed]);

    useEffect(() => {
        if (isOpen && !isMinimized && viewMode === 'chat') {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized, isLiveChat, viewMode]);

    const handleSend = () => {
        if (!inputValue.trim() || isLoading) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    const handleEndSession = async () => {
        await endSession();
        setIsFeedbackVisible(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleBack = () => {
        if (viewMode === 'history_detail') {
            setViewMode('history_list');
        } else if (viewMode === 'history_list') {
            setViewMode('chat');
        }
    };

    const unreadCount = !isOpen ? messages.filter(m => m.role !== 'user' && m.role !== 'system').length - 1 : 0;
    const aiSuggestions = ['Gói rửa xe', 'Chi nhánh gần nhất', 'Khuyến mãi'];

    const headerGradient = viewMode !== 'chat'
        ? 'from-slate-600 to-slate-700'
        : (isLiveChat ? 'from-emerald-500 to-teal-600' : 'from-blue-600 to-indigo-600');

    return (
        <>
            <button
                onClick={() => isMinimized ? setIsMinimized(false) : setIsOpen(p => !p)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen && !isMinimized
                    ? 'bg-slate-700 hover:bg-slate-800'
                    : isLiveChat
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                        : 'bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    }`}
            >
                {isOpen && !isMinimized ? <X className="w-6 h-6 text-white" /> : isLiveChat ? <HeadphonesIcon className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
                {unreadCount > 0 && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-black text-white flex items-center justify-center border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={`fixed bottom-24 right-6 z-50 w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isMinimized ? 'h-16' : 'h-[520px]'}`}>

                    {/* TOP HEADER */}
                    <div className={`bg-gradient-to-r ${headerGradient} px-4 py-3 flex items-center justify-between shrink-0`}>
                        <div className="flex items-center gap-2.5">
                            {viewMode !== 'chat' ? (
                                <button onClick={handleBack} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                                    {isLiveChat ? <HeadphonesIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-black text-white tracking-tight">
                                    {viewMode === 'history_list' ? 'Lịch sử hỗ trợ' : viewMode === 'history_detail' ? 'Chi tiết phiên' : (isLiveChat ? 'Đang gặp Nhân viên' : 'AutoWash AI Assistant')}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    {viewMode === 'chat' && <span className="w-1.5 h-1.5 bg-lime-300 rounded-full animate-pulse" />}
                                    <p className="text-[10px] text-white/80">
                                        {viewMode === 'history_detail' ? `Trạng thái: ${selectedSessionInfo?.status}` : (isLiveChat ? 'Staff chi nhánh' : 'Luôn sẵn sàng hỗ trợ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {!isFeedbackVisible && currentSessionId !== null && (
                                <button
                                    onClick={handleEndSession}
                                    className="px-2 py-1 bg-red-500/20 hover:bg-red-500/40 text-white text-[10px] font-bold rounded-lg mr-2 transition-colors"
                                >
                                    Kết thúc
                                </button>
                            )}

                            {isFeedbackVisible && (
                                <div className="absolute inset-0 z-[60] bg-white flex flex-col p-6 animate-in fade-in zoom-in duration-300">
                                    <h3 className="text-lg font-black text-slate-800 mb-1">Đánh giá dịch vụ</h3>
                                    <p className="text-sm text-slate-500 mb-6">Ý kiến của bạn giúp chúng tôi cải thiện tốt hơn.</p>

                                    {/* Rating Stars */}
                                    <div className="flex gap-2 mb-6 justify-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} onClick={() => setRating(star)}>
                                                <Star className={`w-8 h-8 transition-colors ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                            </button>
                                        ))}
                                    </div>

                                    {/* Comment Input */}
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Để lại nhận xét của bạn..."
                                        className="w-full h-24 p-3 mb-6 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />

                                    <div className="flex gap-3 mt-auto">
                                        <button
                                            onClick={() => {
                                                setIsFeedbackVisible(false)
                                                setIsOpen(false);
                                                clearMessages();
                                                setRating(5);
                                                setComment('');
                                            }}
                                            className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                                        >
                                            Bỏ qua
                                        </button>
                                        <button
                                            onClick={handleConfirmFeedback}
                                            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700"
                                        >
                                            Gửi đánh giá
                                        </button>
                                    </div>
                                </div>
                            )}

                            {viewMode === 'chat' && (
                                <>
                                    <button onClick={loadHistoryList} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors" title="Xem lịch sử chat"><History className="w-3.5 h-3.5 text-white/80" /></button>
                                    <button onClick={clearMessages} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors" title="Làm mới"><Trash2 className="w-3.5 h-3.5 text-white/80" /></button>
                                </>
                            )}
                            <button onClick={() => setIsMinimized(p => !p)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                                {isMinimized ? <ChevronDown className="w-3.5 h-3.5 text-white/80" /> : <Minimize2 className="w-3.5 h-3.5 text-white/80" />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><X className="w-3.5 h-3.5 text-white/80" /></button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* VIEW: LỊCH SỬ CHAT */}
                            {viewMode === 'history_list' && (
                                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-2 min-h-0">
                                    {historySessions.length === 0 ? (
                                        <div className="text-center text-slate-400 text-xs py-8">Không có lịch sử trò chuyện nào.</div>
                                    ) : (
                                        historySessions.map((session) => (
                                            <div key={session.id} onClick={() => handleSelectHistorySession(session)} className="bg-white p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all text-left shadow-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-slate-700">Hỗ trợ: {session.staffName || 'Hệ thống'}</span>
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500">{session.status}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400">{new Date(session.createdAt).toLocaleString('vi-VN')}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* VIEW: CHI TIẾT PHIÊN CŨ */}
                            {viewMode === 'history_detail' && (
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 min-h-0">
                                    <div className="flex justify-center">
                                        <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-3 py-1 rounded-full border border-amber-200">PHIÊN ĐÃ KẾT THÚC</span>
                                    </div>
                                    {selectedOldMessages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}

                            {/* VIEW: CHAT LIVE/AI */}
                            {viewMode === 'chat' && (
                                <>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 min-h-0">
                                        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                                        {isLoading && <TypingIndicator isLiveChat={isLiveChat} />}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    <div className="px-4 pb-3 pt-1 bg-slate-50/50 flex flex-col gap-2 shrink-0">
                                        {!isLiveChat && messages.length <= 2 && (
                                            <div className="flex gap-2 flex-wrap">
                                                {aiSuggestions.map(s => (
                                                    <button key={s} onClick={() => sendMessage(s)} className="text-xs bg-white hover:bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-full transition-colors border border-slate-200 shadow-sm">{s}</button>
                                                ))}
                                            </div>
                                        )}

                                        {!isLiveChat ? (
                                            <button onClick={connectToStaff} className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-2xl shadow-md transition-all">
                                                <HeadphonesIcon className="w-4 h-4" /> Gặp nhân viên hỗ trợ chi nhánh
                                            </button>
                                        ) : (
                                            <button onClick={connectToAI} className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-2xl shadow-md transition-all">
                                                <Bot className="w-4 h-4" /> Quay lại Chat với AI Assistant
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
                                        <input
                                            ref={inputRef} type="text" value={inputValue}
                                            onChange={e => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={isLiveChat ? 'Nhập tin nhắn...' : 'Hỏi AI Assistant...'}
                                            disabled={isLoading}
                                            className={`flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium placeholder:text-slate-400 focus:outline-none ${isLiveChat ? 'focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100' : 'focus:border-blue-400 focus:ring-2 focus:ring-blue-100'} transition-all`}
                                        />
                                        <button
                                            onClick={handleSend} disabled={!inputValue.trim() || isLoading}
                                            className={`w-10 h-10 bg-gradient-to-br ${isLiveChat ? 'from-emerald-500 to-teal-600' : 'from-blue-600 to-indigo-600'} rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-all disabled:opacity-40`}
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
};