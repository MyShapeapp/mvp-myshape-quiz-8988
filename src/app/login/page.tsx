'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular validação de login
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
      setError('Usuário não encontrado. Faça seu cadastro primeiro.');
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(userData);
    
    if (user.email !== email) {
      setError('E-mail não encontrado.');
      setIsLoading(false);
      return;
    }

    // Simular delay de autenticação
    setTimeout(() => {
      localStorage.setItem('userLoggedIn', 'true');
      window.location.href = '/student-area';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      {/* Logo MyShape no canto superior esquerdo */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => window.location.href = '/'}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-white/20"
          title="Voltar ao Quiz"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-white font-bold text-sm hidden sm:block">MyShape</span>
          </div>
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Botão Voltar */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar ao início
        </Link>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0066FF] to-[#0052CC] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Entrar na Área do Aluno
            </h1>
            <p className="text-gray-400">
              Acesse seu dashboard personalizado
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                required
                className="w-full pl-12 pr-4 py-4 bg-[#000000] border-2 border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-[#0066FF] focus:outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                className="w-full pl-12 pr-12 py-4 bg-[#000000] border-2 border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-[#0066FF] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white py-4 px-8 rounded-2xl font-bold text-xl hover:from-[#0052CC] hover:to-[#003D99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <User className="w-6 h-6" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Ainda não tem uma conta?
            </p>
            <Link 
              href="/"
              className="text-[#0066FF] hover:text-[#0052CC] font-semibold transition-colors"
            >
              Fazer cadastro gratuito
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Seus dados estão protegidos e criptografados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}