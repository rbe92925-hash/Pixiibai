
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { MessageSquareIcon, XIcon, SendIcon } from './IconComponents';

export const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'initial', text: '¡Hola! Soy tu asistente de Pixibai. ¿Cómo puedo ayudarte hoy?', sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            text: trimmedInput,
            sender: 'user',
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        const botResponseText = await getChatbotResponse(trimmedInput);

        const botMessage: ChatMessage = {
            id: crypto.randomUUID(),
            text: botResponseText,
            sender: 'bot',
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    };

    return (
        <>
            <div className={`fixed bottom-6 right-6 transition-transform duration-300 z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 text-white rounded-full p-4 shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label="Abrir chat de ayuda"
                >
                    <MessageSquareIcon className="h-7 w-7" />
                </button>
            </div>

            <div className={`fixed bottom-6 right-6 w-full max-w-sm h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex justify-between items-center p-5 bg-indigo-600 text-white rounded-t-2xl shadow-md">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <h3 className="font-bold text-lg">Asistente Pixibai</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} aria-label="Cerrar chat" className="text-white/80 hover:text-white transition-colors">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'}`}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex justify-start">
                                <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-white border border-slate-100 rounded-bl-none shadow-sm">
                                    <div className="flex items-center space-x-1">
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse-fast"></span>
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse-medium"></span>
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse-slow"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Escribe tu pregunta..."
                            className="flex-1 border-slate-200 bg-slate-50 rounded-full py-2.5 px-4 text-sm focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                            disabled={isLoading}
                        />
                        <button type="submit" className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors" disabled={isLoading || !inputValue.trim()}>
                            <SendIcon className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            </div>
             <style>{`
                @keyframes pulse-fast { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                @keyframes pulse-medium { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .animate-pulse-fast { animation: pulse-fast 1.4s infinite; }
                .animate-pulse-medium { animation: pulse-fast 1.4s infinite; animation-delay: 0.2s; }
                .animate-pulse-slow { animation: pulse-fast 1.4s infinite; animation-delay: 0.4s; }
            `}</style>
        </>
    );
};
