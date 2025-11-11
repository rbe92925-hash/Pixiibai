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
            <div className={`fixed bottom-6 right-6 transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gray-800 text-white rounded-full p-4 shadow-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                    aria-label="Abrir chat de ayuda"
                >
                    <MessageSquareIcon className="h-8 w-8" />
                </button>
            </div>

            <div className={`fixed bottom-6 right-6 w-full max-w-sm h-[70vh] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-xl">
                    <h3 className="font-bold text-lg">Asistente Virtual</h3>
                    <button onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-gray-700 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex justify-start">
                                <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                                    <div className="flex items-center space-x-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-medium"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-slow"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-white rounded-b-xl">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Escribe tu pregunta..."
                            className="flex-1 border-gray-300 rounded-full py-2 px-4 focus:ring-gray-800 focus:border-gray-800"
                            disabled={isLoading}
                        />
                        <button type="submit" className="ml-3 text-gray-700 hover:text-gray-900 disabled:text-gray-400" disabled={isLoading || !inputValue.trim()}>
                            <SendIcon className="h-6 w-6" />
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