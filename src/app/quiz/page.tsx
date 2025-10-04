'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CreditCard, Lock, User, Mail, Eye, EyeOff } from 'lucide-react';
import { GenderSelect } from '@/components/GenderSelect';
import { BodyTypeSelect } from '@/components/BodyTypeSelect';
import { GoalSelect } from '@/components/GoalSelect';
import { AgeSelect } from '@/components/AgeSelect';
import { ProgressBar } from '@/components/ProgressBar';

interface QuizData {
  gender: string;
  bodyType: string;
  goal: string;
  age: string;
  weight: string;
  height: string;
  activityLevel: string;
}

interface UserAccount {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>({
    gender: '',
    bodyType: '',
    goal: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: ''
  });
  const [userAccount, setUserAccount] = useState<UserAccount>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const totalSteps = 9; // 7 quiz + 1 payment + 1 account creation

  const questions = [
    {
      id: 1,
      title: "Qual é o seu sexo?",
      subtitle: "Isso nos ajuda a personalizar seu plano",
      component: (
        <GenderSelect 
          value={quizData.gender} 
          onChange={(value) => setQuizData({...quizData, gender: value})}
        />
      )
    },
    {
      id: 2,
      title: "Como você descreveria seu corpo atual?",
      subtitle: "Seja honesto para obtermos os melhores resultados",
      component: (
        <BodyTypeSelect 
          value={quizData.bodyType} 
          onChange={(value) => setQuizData({...quizData, bodyType: value})}
          gender={quizData.gender}
        />
      )
    },
    {
      id: 3,
      title: "Qual é o seu objetivo principal?",
      subtitle: "Vamos criar um plano focado no seu objetivo",
      component: (
        <GoalSelect 
          value={quizData.goal} 
          onChange={(value) => setQuizData({...quizData, goal: value})}
          gender={quizData.gender}
        />
      )
    },
    {
      id: 4,
      title: "Qual é a sua idade?",
      subtitle: "Isso nos ajuda a ajustar a intensidade dos treinos",
      component: (
        <AgeSelect 
          value={quizData.age} 
          onChange={(value) => setQuizData({...quizData, age: value})}
          gender={quizData.gender}
        />
      )
    },
    {
      id: 5,
      title: "Qual é o seu peso atual?",
      subtitle: "Em quilogramas (kg)",
      component: (
        <div className="w-full max-w-md mx-auto">
          <input
            type="number"
            value={quizData.weight}
            onChange={(e) => setQuizData({...quizData, weight: e.target.value})}
            placeholder="Ex: 70"
            className="w-full p-6 text-2xl text-center bg-[#000000] border-2 border-gray-700 rounded-3xl text-white placeholder-gray-500 focus:border-[#0066FF] focus:outline-none transition-colors"
          />
          <p className="text-gray-400 text-center mt-4">Digite apenas números</p>
        </div>
      )
    },
    {
      id: 6,
      title: "Qual é a sua altura?",
      subtitle: "Em centímetros (cm)",
      component: (
        <div className="w-full max-w-md mx-auto">
          <input
            type="number"
            value={quizData.height}
            onChange={(e) => setQuizData({...quizData, height: e.target.value})}
            placeholder="Ex: 170"
            className="w-full p-6 text-2xl text-center bg-[#000000] border-2 border-gray-700 rounded-3xl text-white placeholder-gray-500 focus:border-[#0066FF] focus:outline-none transition-colors"
          />
          <p className="text-gray-400 text-center mt-4">Digite apenas números</p>
        </div>
      )
    },
    {
      id: 7,
      title: "Qual é o seu nível de atividade física?",
      subtitle: "Seja honesto sobre sua rotina atual",
      component: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mx-auto">
          {[
            { id: 'sedentary', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
            { id: 'light', label: 'Leve', desc: '1-3 dias por semana' },
            { id: 'moderate', label: 'Moderado', desc: '3-5 dias por semana' },
            { id: 'intense', label: 'Intenso', desc: '6-7 dias por semana' }
          ].map((level) => (
            <button
              key={level.id}
              onClick={() => setQuizData({...quizData, activityLevel: level.id})}
              className={`p-6 rounded-3xl border-2 transition-all duration-300 transform hover:scale-105 ${
                quizData.activityLevel === level.id
                  ? 'border-[#0066FF] bg-[#0066FF]/10 shadow-2xl shadow-[#0066FF]/25'
                  : 'border-gray-700 bg-[#000000] hover:border-[#0066FF]/50 hover:shadow-lg hover:shadow-[#0066FF]/10'
              }`}
            >
              <div className="text-center">
                <h3 className="font-semibold text-lg text-white mb-2">{level.label}</h3>
                <p className="text-gray-400 text-sm">{level.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    setPaymentProcessing(false);
    setCurrentStep(currentStep + 1);
  };

  const handleCreateAccount = async () => {
    if (userAccount.password !== userAccount.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    
    if (userAccount.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    // Salvar dados do usuário no localStorage
    const userData = {
      ...quizData,
      email: userAccount.email,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userLoggedIn', 'true');
    
    setAccountCreated(true);
    
    // Redirecionar para a área do aluno após 2 segundos
    setTimeout(() => {
      window.location.href = '/student-area';
    }, 2000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return quizData.gender !== '';
      case 2: return quizData.bodyType !== '';
      case 3: return quizData.goal !== '';
      case 4: return quizData.age !== '';
      case 5: return quizData.weight !== '' && parseInt(quizData.weight) > 0;
      case 6: return quizData.height !== '' && parseInt(quizData.height) > 0;
      case 7: return quizData.activityLevel !== '';
      case 8: return true; // Payment step
      case 9: return userAccount.email !== '' && userAccount.password !== '' && userAccount.confirmPassword !== '';
      default: return false;
    }
  };

  const renderStepContent = () => {
    if (currentStep <= 7) {
      const question = questions[currentStep - 1];
      return (
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {question.title}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {question.subtitle}
            </p>
          </div>
          
          <div className="flex justify-center">
            {question.component}
          </div>
        </div>
      );
    }

    if (currentStep === 8) {
      return (
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Desbloqueie seu Plano Personalizado
            </h1>
            <p className="text-xl text-gray-400">
              Acesso completo ao seu programa de emagrecimento personalizado
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#0066FF] to-[#0052CC] rounded-3xl p-8 text-white">
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">R$ 97</div>
                <div className="text-xl opacity-90">Pagamento único</div>
                <div className="text-sm opacity-75 line-through">De R$ 297</div>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Plano de treinos personalizado (7 dias)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Dieta personalizada desbloqueada diariamente</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Sistema gamificado com XP e conquistas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Contador de calorias e água</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Acesso vitalício ao seu plano</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="w-full bg-white text-[#0066FF] py-4 px-8 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {paymentProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0066FF]"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    Finalizar Compra
                  </>
                )}
              </button>

              <div className="text-center text-sm opacity-75">
                <Lock className="w-4 h-4 inline mr-2" />
                Pagamento 100% seguro e criptografado
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 9) {
      return (
        <div className="text-center space-y-8 max-w-md mx-auto">
          {!accountCreated ? (
            <>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Crie sua Conta
                </h1>
                <p className="text-xl text-gray-400">
                  Proteja seu acesso ao plano personalizado
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={userAccount.email}
                    onChange={(e) => setUserAccount({...userAccount, email: e.target.value})}
                    placeholder="Seu melhor e-mail"
                    className="w-full pl-12 pr-4 py-4 bg-[#000000] border-2 border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-[#0066FF] focus:outline-none transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={userAccount.password}
                    onChange={(e) => setUserAccount({...userAccount, password: e.target.value})}
                    placeholder="Crie uma senha (min. 6 caracteres)"
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

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={userAccount.confirmPassword}
                    onChange={(e) => setUserAccount({...userAccount, confirmPassword: e.target.value})}
                    placeholder="Confirme sua senha"
                    className="w-full pl-12 pr-12 py-4 bg-[#000000] border-2 border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-[#0066FF] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  onClick={handleCreateAccount}
                  disabled={!canProceed()}
                  className="w-full bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white py-4 px-8 rounded-2xl font-bold text-xl hover:from-[#0052CC] hover:to-[#003D99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <User className="w-6 h-6" />
                  Criar Conta e Acessar
                </button>

                <p className="text-sm text-gray-400">
                  Seus dados estão protegidos e serão usados apenas para personalizar sua experiência
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-3xl">✓</span>
              </div>
              <h1 className="text-4xl font-bold text-white">
                Conta Criada com Sucesso!
              </h1>
              <p className="text-xl text-gray-400">
                Redirecionando para seu dashboard personalizado...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066FF] mx-auto"></div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-gray-800 p-4">
        <ProgressBar current={currentStep} total={totalSteps} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl mx-auto">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation */}
      {currentStep <= 7 && (
        <div className="p-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-2xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>

            <div className="text-gray-400 text-sm">
              {currentStep} de {totalSteps}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white rounded-2xl hover:from-[#0052CC] hover:to-[#003D99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}