import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Send, Paperclip, Search, File, Image } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useChat } from '@/contexts/ChatContext';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminChatPage = () => {
  const { userId: activeConversationId } = useParams();
  const navigate = useNavigate();
  const { getConversations } = useChat();
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setConversations(getConversations());
  }, [getConversations]);

  const filteredConversations = conversations.filter(convo => 
    convo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Pesan - Admin</title></Helmet>
      <div className="flex h-screen bg-white">
        <AdminSidebar />
        <main className="flex-1 flex border-l">
          <div className="w-full md:w-1/3 lg:w-1/4 border-r bg-gray-50 flex flex-col">
            <div className="p-4 border-b sticky top-0 bg-gray-50 z-10">
              <h2 className="text-xl font-bold">Percakapan</h2>
              <div className="relative mt-2"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Cari..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            </div>
            <div className="flex-grow overflow-y-auto">
              {filteredConversations.map(convo => (
                <div key={convo.id} className={`p-3 border-b cursor-pointer transition-colors ${activeConversationId === convo.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => navigate(`/admin/chat/${convo.id}`)}>
                  <div className="flex items-center space-x-3"><div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-xl">{convo.avatar}</div>
                    <div className="flex-grow overflow-hidden"><p className="font-semibold truncate">{convo.name}</p><p className="text-sm text-gray-500 truncate">{convo.lastMessage}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-gray-200" style={{backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')"}}>
            {activeConversationId ? <ChatWindow contactId={activeConversationId} /> : <div className="flex-grow flex items-center justify-center text-gray-500"><p>Pilih percakapan untuk memulai.</p></div>}
          </div>
        </main>
      </div>
    </>
  );
};

const ChatWindow = ({ contactId }) => {
  const { user } = useAuth();
  const { messages, sendMessage } = useChat(contactId);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [contactUser, setContactUser] = useState(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setContactUser(users.find(u => u.id === contactId));
    scrollToBottom();
  }, [contactId, messages]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSendMessage = (e) => { e.preventDefault(); if (newMessage.trim() === '') return; sendMessage(newMessage, user.id); setNewMessage(''); };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => { const attachment = { name: file.name, type: file.type, size: file.size, dataUrl: event.target.result }; sendMessage(`File: ${file.name}`, user.id, attachment); };
      reader.readAsDataURL(file);
    }
  };

  const renderMessageContent = (msg) => {
    if (msg.attachment) {
      if(msg.attachment.type.startsWith('image/')) { return (<div><img src={msg.attachment.dataUrl} alt={msg.attachment.name} className="rounded-lg max-w-xs mb-1" /><p>{msg.text.replace(`File: ${msg.attachment.name}`, '')}</p></div>) }
      if (msg.attachment.type === 'product_inquiry') {
        const p = msg.attachment;
        return (<div className="bg-black/10 p-2 rounded-lg"><p className="text-sm font-semibold mb-1">Pertanyaan Stok:</p><div className="flex items-center gap-2"><img src={p.image} alt={p.location} className="w-10 h-10 rounded-md object-cover" /><div><p className="font-medium text-sm">{p.location}</p><p className="text-xs">{p.weight} kg</p></div></div></div>)
      }
      return (<a href={msg.attachment.dataUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline"><File className="h-4 w-4" /> {msg.attachment.name}</a>);
    }
    return <p>{msg.text}</p>;
  };

  if (!contactUser) return <div className="flex-grow flex items-center justify-center text-gray-500">Memuat...</div>;

  return (
    <>
      <header className="p-3 border-b bg-gray-50 flex items-center space-x-3 sticky top-0 z-10"><div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">{contactUser.name.charAt(0).toUpperCase()}</div><div><h2 className="font-bold text-md">{contactUser.name}</h2><p className="text-sm text-green-600">Online</p></div></header>
      <div className="flex-grow p-4 overflow-y-auto"><div className="space-y-2">
        {messages.map((msg) => (<motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}><div className={`max-w-md px-3 py-2 rounded-xl shadow ${msg.senderId === user.id ? 'bg-[#dcf8c6]' : 'bg-white'}`}>{renderMessageContent(msg)}<p className="text-xs text-gray-500 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div></motion.div>))}
        <div ref={messagesEndRef} />
      </div></div>
      <footer className="p-3 border-t bg-gray-100 sticky bottom-0"><form onSubmit={handleSendMessage} className="flex items-center space-x-2 bg-white rounded-full p-1 border">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" /><Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={() => fileInputRef.current.click()}><Paperclip className="h-5 w-5" /></Button>
        <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={`Balas ke ${contactUser.name}...`} className="flex-grow border-none focus-visible:ring-0 bg-transparent" />
        <Button type="submit" size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"><Send className="h-5 w-5" /></Button>
      </form></footer>
    </>
  );
};

export default AdminChatPage;