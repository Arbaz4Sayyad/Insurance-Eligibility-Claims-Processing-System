import React, { useState } from 'react';
import { Card, Button, Input } from '../../../components/common/UIComponents';
import { useApplications } from '../../../context/ApplicationContext';
import { 
  Send, 
  User, 
  MessageSquare, 
  Paperclip, 
  PhoneCall, 
  Video, 
  MoreVertical,
  Search,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommunicationCenter = () => {
  const { applications } = useApplications();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAppId, setActiveAppId] = useState(applications[0]?.id);
  const [message, setMessage] = useState('');
  
  const filteredApps = applications.filter(app => 
    app.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeApp = applications.find(a => a.id === activeAppId);
  
  // Mock messages for simulation
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Application received and queued for review.', time: '09:00 AM', isMe: false },
    { id: 2, sender: activeApp?.applicant || 'Citizen', text: 'Hello, I uploaded my income documents. Can you please check?', time: '10:15 AM', isMe: false },
    { id: 3, sender: 'Caseworker', text: 'Reviewing now. Please wait a moment while I verify the documents.', time: '10:30 AM', isMe: true },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      sender: 'Caseworker',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }]);
    setMessage('');
  };

  return (
    <div className="h-[calc(100vh-160px)] flex gap-6 pb-4">
      {/* Sidebar: Message List */}
      <div className="w-[380px] flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
             Messaging <span className="text-primary-500">Center</span>
           </h2>
           <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-all">
             <MessageSquare size={18} />
           </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
          <input 
            type="text" 
            placeholder="Search Conversations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-slate-400 focus:ring-1 focus:ring-primary-500/50 outline-none uppercase font-black"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => setActiveAppId(app.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                activeAppId === app.id 
                  ? 'bg-primary-500/10 border-primary-500/30' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                   activeAppId === app.id ? 'bg-primary-600 text-white border-primary-400/20 shadow-lg shadow-primary-500/20' : 'bg-slate-950 text-slate-600 border-slate-800'
                }`}>
                  <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none">{app.id}</p>
                    <span className="text-[9px] text-slate-600 font-bold uppercase">10:30 AM</span>
                  </div>
                  <h4 className="text-sm font-black text-white truncate group-hover:text-primary-400 transition-colors uppercase italic">{app.applicant}</h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5 font-bold">Secure channel active...</p>
                </div>
              </div>
              {activeAppId === app.id && (
                 <motion.div layoutId="active-msg" className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
              )}
            </button>
          ))}
          {filteredApps.length === 0 && (
            <div className="text-center py-10">
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden bg-slate-950/40 border-slate-800 backdrop-blur-xl">
        {/* Chat Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center border border-primary-500/20">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase italic tracking-tight">{activeApp?.applicant || 'Select Applicant'}</h3>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activeApp?.id} • SECURE MESSENGER</p>
                </div>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              {[PhoneCall, Video, MoreVertical].map((Icon, i) => (
                <button key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-600 transition-all">
                   <Icon size={18} />
                </button>
              ))}
           </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent_40%)]">
           {messages.map((msg, i) => (
             <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] space-y-2 ${msg.isMe ? 'items-end' : 'items-start'}`}>
                   <div className={`p-5 rounded-3xl text-sm font-medium shadow-2xl ${
                     msg.isMe ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none'
                   }`}>
                     {msg.text}
                   </div>
                   <div className={`flex items-center gap-2 px-2 text-[9px] font-black uppercase tracking-widest ${msg.isMe ? 'text-slate-500 flex-row-reverse' : 'text-slate-600'}`}>
                      <span>{msg.time}</span>
                      {msg.isMe && <CheckCheck size={10} className="text-primary-500" />}
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-6 bg-slate-900/40 border-t border-slate-800">
           <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-2xl p-2 focus-within:border-primary-500/50 transition-all">
              <button type="button" className="p-3 text-slate-600 hover:text-slate-300 transition-colors">
                 <Paperclip size={20} />
              </button>
              <input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message within secure channel..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 text-sm placeholder:text-slate-700"
              />
              <Button 
                type="submit"
                variant="primary" 
                className="h-12 w-12 p-0 rounded-xl bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-500/20 border-none group"
              >
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
           </div>
           <p className="mt-4 text-[9px] text-center text-slate-600 uppercase font-black tracking-[0.2em]">
             End-to-End Encrypted Node • Case ID: {activeApp?.id}
           </p>
        </form>
      </Card>
    </div>
  );
};

export default CommunicationCenter;
