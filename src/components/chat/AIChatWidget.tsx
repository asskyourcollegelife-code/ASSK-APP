'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: trimmed,
        };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        // Prepare assistant placeholder
        const assistantId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
                }),
            });

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }

            // Read the text stream
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let accumulated = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    accumulated += decoder.decode(value, { stream: true });
                    const current = accumulated;
                    setMessages(prev =>
                        prev.map(m => m.id === assistantId ? { ...m, content: current } : m)
                    );
                }
            }
        } catch (err: any) {
            console.error('Chat error:', err);
            setMessages(prev =>
                prev.map(m =>
                    m.id === assistantId
                        ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
                        : m
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center z-50 animate-bounce-slow"
                    aria-label="Open AI Assistant"
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window Overlay */}
            {isOpen && (
                <div className="fixed bottom-0 right-0 w-full sm:w-[400px] h-[600px] sm:h-[650px] sm:bottom-6 sm:right-6 bg-white sm:rounded-3xl shadow-2xl flex flex-col z-50 border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 text-white flex justify-between items-center rounded-t-3xl sm:rounded-t-none">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold">ASSK Assistant</h3>
                                <p className="text-indigo-100 text-xs text-opacity-80">RAG-powered Knowledge AI</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-70 p-6">
                                <Bot size={48} className="text-gray-400 mb-4" />
                                <p className="text-gray-600 font-medium">Hi! I&apos;m the ASSK AI Assistant.</p>
                                <p className="text-sm text-gray-500 mt-2">Ask me about recent announcements, upcoming events, study notes, or exams!</p>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                        <Bot size={16} className="text-indigo-600" />
                                    </div>
                                )}

                                <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${message.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-sm'
                                    : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm prose prose-sm prose-indigo'
                                    }`}>
                                    {message.role === 'user' ? (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    ) : (
                                        <div className="text-sm leading-relaxed">
                                            <ReactMarkdown>
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>

                                {message.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                        <User size={16} className="text-gray-600" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && messages[messages.length - 1]?.content === '' && (
                            <div className="flex gap-3 justify-start">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                    <Loader2 size={16} className="text-indigo-600 animate-spin" />
                                </div>
                                <div className="px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm flex items-center gap-1">
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSubmit} className="relative flex items-center">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm text-black font-semibold placeholder:text-gray-400 placeholder:font-normal"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-full transition-colors flex items-center justify-center"
                            >
                                <Send size={16} className="-ml-0.5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
