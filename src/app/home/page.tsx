'use client';

import Link from 'next/link';
import { ArrowRight, Star, Trophy, Dumbbell, Utensils, Target, Zap, User } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0066FF]/20 to-[#0052CC]/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Transforme Seu
                <span className="block bg-gradient-to-r from-[#0066FF] to-[#00CCFF] bg-clip-text text-transparent">
                  Corpo e Mente
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Plano personalizado de emagrecimento com treinos diários, dieta customizada e sistema gamificado para manter você motivado
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/quiz"
                className="group bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white px-8 py-4 rounded-2xl font-bold text-xl hover:from-[#0052CC] hover:to-[#003D99] transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3"
              >
                Começar Agora
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/login"
                className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3"
              >
                <User className="w-6 h-6" />
                Já tenho conta
              </Link>
              
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="flex">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-white font-semibold">4.9/5 (2.847 avaliações)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tudo que Você Precisa em Um Só Lugar
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Sistema completo e personalizado baseado nas suas respostas do quiz inicial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Dumbbell,
                title: "Treinos Personalizados",
                description: "Exercícios adaptados ao seu nível, objetivo e tipo corporal. Novos treinos desbloqueados diariamente.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Utensils,
                title: "Dieta Customizada",
                description: "Plano alimentar calculado especificamente para você, com refeições liberadas progressivamente.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Trophy,
                title: "Sistema Gamificado",
                description: "Ganhe XP, suba de nível, desbloqueie conquistas e mantenha a motivação sempre alta.",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Target,
                title: "Metas Inteligentes",
                description: "Objetivos diários personalizados de água, calorias e exercícios baseados no seu perfil.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Progresso em Tempo Real",
                description: "Acompanhe sua evolução com estatísticas detalhadas e gráficos motivacionais.",
                color: "from-red-500 to-pink-500"
              },
              {
                icon: Star,
                title: "Acesso Vitalício",
                description: "Pagamento único com acesso permanente ao seu plano personalizado e todas as atualizações.",
                color: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 hover:border-gray-600 transition-all hover:transform hover:scale-105">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Resultados Reais de Pessoas Reais
            </h2>
            <p className="text-xl text-gray-400">
              Veja o que nossos usuários estão dizendo sobre suas transformações
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                result: "Perdeu 12kg em 3 meses",
                text: "O sistema gamificado me manteve motivada todos os dias. Nunca pensei que emagrecer pudesse ser tão divertido!",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
              },
              {
                name: "João Santos",
                result: "Ganhou 8kg de massa muscular",
                text: "Os treinos personalizados foram perfeitos para meu objetivo. Em 4 meses já vejo uma diferença incrível!",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
              },
              {
                name: "Ana Costa",
                result: "Perdeu 18kg em 6 meses",
                text: "A dieta personalizada foi o diferencial. Nunca passei fome e os resultados apareceram rapidamente.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                    <p className="text-green-400 font-semibold">{testimonial.result}</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex mt-4">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-[#0066FF] to-[#0052CC]">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para Sua Transformação?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Responda nosso quiz personalizado e receba seu plano completo de emagrecimento em menos de 5 minutos
          </p>
          
          <div className="space-y-6">
            <Link 
              href="/quiz"
              className="inline-flex items-center gap-3 bg-white text-[#0066FF] px-10 py-5 rounded-2xl font-bold text-2xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Começar Quiz Gratuito
              <ArrowRight className="w-7 h-7" />
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <span>Quiz 100% gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <span>Resultados em 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <span>Plano 100% personalizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 MyShape. Todos os direitos reservados. Transforme sua vida hoje mesmo.
          </p>
        </div>
      </div>
    </div>
  );
}