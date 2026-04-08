import React from 'react';
import { Card, Button, Input } from '../../../components/common/UIComponents';
import { 
  Send, 
  User, 
  MessageSquare, 
  Paperclip, 
  MoreVertical,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommunicationCenter = ({ appId, citizenName }) => {
  const [messages, setMessages] = React.useState([
    { id: 1, sender: 'System', text: 'Application ARC-9021 received successfully.', timestamp: '2026-04-01 10:00 AM' },
    { id: 2, sender: 'Citizen', text: 'I have uploaded my income documents. Can you please check?', timestamp: '2026-04-02 02:30 PM' },
    { id: 3, sender: 'Caseworker', text: 'Thank you Alexander. We are currently verifying the tax records.', timestamp: '2026-04-02 04:15 PM' },
  ]);
  const [input, setInput] = React.useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: 'Caseworker',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <Card className="h-[600px] p-0 flex flex-col border-slate-800/60 bg-slate-900/40 relative overflow-hidden group">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/60 flex items-center justify-between bg-slate-900/20">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary-500/10 text-primary-400 flex items-center justify-center border border-primary-500/20">
               <MessageSquare size={20} />
            </div>
            <div>
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Case Messenger</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Applicant: {citizenName || 'Active Citizen'}</p>
            </div>
         </div>
         <Button variant="ghost" size="xs" className="p-2">
            <MoreVertical size={16} />
         </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
         {messages.map((msg, i) => (
           <motion.div 
             key={msg.id}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className={`flex ${msg.sender === 'Caseworker' ? 'justify-end' : 'justify-start'}`}
           >
              <div className={`max-w-[80%] flex flex-col ${msg.sender === 'Caseworker' ? 'items-end' : 'items-start'}`}>
                 <div className={`p-4 rounded-[24px] text-sm leading-relaxed shadow-2xl relative ${
                   msg.sender === 'Caseworker' 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : msg.sender === 'System'
                    ? 'bg-slate-950 border border-slate-800/60 text-slate-400 rounded-tl-none italic font-medium'
                    : 'bg-slate-800 text-white rounded-tl-none font-medium'
                 }`}>
                    {msg.text}
                 </div>
                 <div className="flex items-center gap-2 px-1 mt-2">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{msg.timestamp}</span>
                    {msg.sender === 'Caseworker' && <CheckCheck size={12} className="text-primary-500" />}
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-800/60 bg-slate-900/20">
         <div className="flex gap-4 p-2 bg-slate-950 border border-slate-800 rounded-[24px] focus-within:border-primary-500/50 transition-all shadow-inner">
            <button className="p-2 text-slate-600 hover:text-white transition-colors">
               <Paperclip size={18} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none text-sm outline-none px-2 text-white font-bold"
            />
            <button 
              onClick={sendMessage}
              className="p-3 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all"
            >
               <Send size={18} />
            </button>
         </div>
      </div>
    </Card>
  );
};

export default CommunicationCenter;
