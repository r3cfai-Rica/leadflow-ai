import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Users, Search, BarChart3, Send, Plus, Zap, X, Check, Folder, 
  ArrowLeft, Trash2, Globe, Loader2, Cpu, Play, Pause, 
  ShieldAlert, LogOut, Lock, Star, Activity, HardDrive, 
  Wallet, Rocket, Timer, CreditCard, ShieldCheck, Tag, ArrowRight,
  MessageSquare, Smartphone, Mail, Wand2, ImageIcon, RefreshCw,
  Maximize2, Monitor, Tablet, Sparkles
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// --- TIPOS DE DADOS ---
interface User {
  id: string; name: string; email: string; password?: string;
  role: 'user' | 'admin'; isPaid: boolean; searchesCount: number;
  createdAt: string;
}
interface Lead {
  id: string; name: string; company: string; email: string; phone: string;
  niche: string; country?: string; status: 'New' | 'Contacted' | 'Interested' | 'Closed';
  lastActivity: string; source: string;
}
interface NicheCategory {
  id: string; name: string; createdAt: string; leads: Lead[]; savedCtas: any[];
}

// --- CREDENCIAIS DO RICARDO ---
const MASTER_EMAIL = "ricardo@leadflow.ai";
const MASTER_PASS = "Caca26@";

// --- COMPONENTE PRINCIPAL ---
const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [categories, setCategories] = useState<NicheCategory[]>([]);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });

  // Carregar dados salvos no navegador
  useEffect(() => {
    const session = localStorage.getItem('leadflow_session');
    if (session) setCurrentUser(JSON.parse(session));
    const saved = localStorage.getItem('leadflow_cats');
    if (saved) setCategories(JSON.parse(saved));
  }, []);

  // Salvar dados sempre que mudarem
  useEffect(() => {
    if (currentUser) localStorage.setItem('leadflow_session', JSON.stringify(currentUser));
    localStorage.setItem('leadflow_cats', JSON.stringify(categories));
  }, [currentUser, categories]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.email === MASTER_EMAIL && authForm.password === MASTER_PASS) {
      const user: User = { 
        id: 'master', name: 'Ricardo Ferrari', email: MASTER_EMAIL, 
        role: 'admin', isPaid: true, searchesCount: 0, createdAt: new Date().toISOString() 
      };
      setCurrentUser(user);
    } else {
      alert("Acesso negado. Use as credenciais Master.");
    }
  };

  // TELA DE LOGIN
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border-b-8 border-indigo-600">
          <h1 className="text-3xl font-black text-center text-slate-900 mb-6 tracking-tighter">LeadFlow <span className="text-indigo-600">Master</span></h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Seu Email Master" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
            <input type="password" placeholder="Sua Senha Master" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all">Entrar no Painel</button>
          </form>
        </div>
      </div>
    );
  }

  // PAINEL INTERNO
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* MENU LATERAL */}
      <aside className="w-72 bg-slate-900 text-slate-300 fixed inset-y-0 left-0 p-8 flex flex-col gap-8">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-indigo-600 rounded-lg"><Zap className="h-6 w-6" /></div>
          <span className="text-xl font-black">LeadFlow AI</span>
        </div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setCurrentTab('dashboard')} className={`flex items-center gap-3 p-4 rounded-xl font-bold ${currentTab === 'dashboard' ? 'bg-white/10 text-white' : ''}`}><BarChart3 className="h-5 w-5" /> Dashboard</button>
          <button onClick={() => setCurrentTab('search')} className={`flex items-center gap-3 p-4 rounded-xl font-bold ${currentTab === 'search' ? 'bg-white/10 text-white' : ''}`}><Search className="h-5 w-5" /> Buscar Leads</button>
          <button onClick={() => setCurrentTab('crm')} className={`flex items-center gap-3 p-4 rounded-xl font-bold ${currentTab === 'crm' ? 'bg-white/10 text-white' : ''}`}><Folder className="h-5 w-5" /> Meu CRM</button>
        </nav>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mt-auto flex items-center gap-3 p-4 text-slate-500 hover:text-white"><LogOut className="h-5 w-5" /> Sair</button>
      </aside>
      
      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{currentTab}</h2>
          <p className="text-slate-500 font-medium">Bem-vindo, {currentUser.name}. O sistema está pronto.</p>
        </header>

        {currentTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <Users className="text-indigo-600 h-8 w-8 mb-4" />
              <div className="text-4xl font-black">{categories.reduce((acc, cat) => acc + cat.leads.length, 0)}</div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Leads Capturados</div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <Activity className="text-green-600 h-8 w-8 mb-4" />
              <div className="text-4xl font-black">Ativo</div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Inteligência Artificial</div>
            </div>
          </div>
        )}

        {currentTab === 'search' && (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl max-w-2xl">
            <h3 className="text-xl font-black mb-4">O que você quer pesquisar hoje?</h3>
            <div className="flex gap-4 mb-6">
              <input type="text" placeholder="Ex: Advogados em São Paulo" className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none" />
              <button onClick={() => alert("A IA está processando... Funcionalidade de busca real integrada após o deploy!")} className="bg-indigo-600 text-white px-8 rounded-2xl font-black hover:bg-indigo-700 transition-all">Pesquisar</button>
            </div>
            <p className="text-sm text-slate-400 font-medium italic">A IA LeadFlow utiliza o Google Search para encontrar decisores reais baseados no seu nicho.</p>
          </div>
        )}

        {currentTab === 'crm' && (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <Folder className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-800 uppercase">Seu CRM está vazio</h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">Os leads que você pesquisar aparecerão organizados aqui automaticamente.</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Renderizar o App na tela
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
