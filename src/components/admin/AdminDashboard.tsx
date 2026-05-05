import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, MessageSquare, Users, ArrowLeft, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import AdminMessages from './AdminMessages';
import AdminUsers from './AdminUsers';

const AdminDashboard: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'messages' | 'users'>('messages');

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Shield className="text-rose-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-white/40 mb-6">This area is restricted to the administrator.</p>
        <Button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/20 rounded-full px-6">
          <ArrowLeft size={16} className="mr-2" /> Go Home
        </Button>
      </div>
    );
  }

  const tabs = [
    { key: 'messages' as const, label: 'Private Messages', icon: MessageSquare, desc: 'View & reply to messages' },
    { key: 'users' as const, label: 'All Users', icon: Users, desc: 'Browse user profiles' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-rose-500/20 border border-orange-500/20 flex items-center justify-center">
            <Shield className="text-orange-400" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/40 text-sm">Manage messages and users</p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/profile')}
          variant="ghost"
          className="text-white/50 hover:text-white"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-3 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-orange-500/15 to-rose-500/15 border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/5'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon size={18} />
            <div className="text-left">
              <p className="text-sm font-semibold">{tab.label}</p>
              <p className="text-[10px] opacity-60">{tab.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[60vh]">
        {activeTab === 'messages' && <AdminMessages />}
        {activeTab === 'users' && <AdminUsers />}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
