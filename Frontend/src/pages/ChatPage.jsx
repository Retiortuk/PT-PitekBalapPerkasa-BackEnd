import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Send, Paperclip, ArrowLeft, Image, File } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Link } from 'react-router-dom';

const ChatPage = () => {
  const { user } = useAuth();
  const { messages, sendMessage } = useChat('admin');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    sendMessage(newMessage, user.id);
    setNewMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const attachment = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: event.target.result,
        };
        sendMessage(`File: ${file.name}`, user.id, attachment);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderMessageContent = (msg) => {
    if (msg.attachment) {
      if(msg.attachment.type.startsWith('image/')) {
        return (<div><img src={msg.attachment.dataUrl} alt={msg.attachment.name} className="rounded-lg max-w-xs mb-1" /><p>{msg.text.replace(`File: ${msg.attachment.name}`, '')}</p></div>)
      }
      if (msg.attachment.type === 'product_inquiry') {
          const p = msg.attachment;
          return (<div className="bg-black/10 p-2 rounded-lg"><p className="text-sm font-semibold mb-1">Pertanyaan Stok:</p><div className="flex items-center gap-2"><img src={p.image} alt={p.location} className="w-10 h-10 rounded-md object-cover" /><div><p className="font-medium text-sm">{p.location}</p><p className="text-xs">{p.weight} kg</p></div></div></div>)
      }
      return (<a href={msg.attachment.dataUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline"><File className="h-4 w-4" /> {msg.attachment.name}</a>);
    }
    return <p>{msg.text}</p>;
  };

  return (
    <>
      <Helmet><title>Chat dengan Admin - Pitek Balap</title></Helmet>
      <div className="flex flex-col h-screen bg-gray-200" style={{backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')"}}>
        <Navbar />
        <header className="p-3 border-b bg-gray-50 flex items-center space-x-3 sticky top-16 z-10">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900"><ArrowLeft className="h-6 w-6" /></Link>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">A</div>
            <div><h2 className="font-bold text-md">Admin</h2><p className="text-sm text-green-600">Online</p></div>
        </header>
        <main className="flex-grow p-4 overflow-y-auto">
          <div className="space-y-2">
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md px-3 py-2 rounded-xl shadow ${msg.senderId === user.id ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
                  {renderMessageContent(msg)}
                  <p className="text-xs text-gray-500 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>
        <footer className="p-3 bg-transparent sticky bottom-0">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 bg-white rounded-full p-1 border shadow-md">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" /><Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={() => fileInputRef.current.click()}><Paperclip className="h-5 w-5" /></Button>
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Ketik pesan..." className="flex-grow border-none focus-visible:ring-0 bg-transparent" />
                <Button type="submit" size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"><Send className="h-5 w-5" /></Button>
            </form>
        </footer>
      </div>
    </>
  );
};

export default ChatPage;