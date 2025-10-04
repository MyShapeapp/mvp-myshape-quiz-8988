'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Dumbbell, Target, Clock, Download, RefreshCw, Lock, CreditCard, Droplets, Flame, Activity, TrendingUp, Trophy, Zap, Users, Brain, Sparkles } from 'lucide-react';
import { ProgressBar } from '@/components/ProgressBar';
import { GenderSelect } from '@/components/GenderSelect';
import { RangeSlider } from '@/components/RangeSlider';
import { OptionSelect } from '@/components/OptionSelect';
import { MultiSelect } from '@/components/MultiSelect';
import { QuestionImage } from '@/components/QuestionImage';
import { QUIZ_QUESTIONS, generateTags, findBestTemplate } from '@/lib/quiz-data';
import { StorageManager } from '@/lib/storage';
import { AppPage, ProgramTemplate } from '@/lib/types';

// Conjuntos de imagens baseados no sexo escolhido
const AVATAR_IMAGES = {
  male: {
    '18-29': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=face',
    '30-39': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop&crop=face',
    '40-49': 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=600&fit=crop&crop=face',
    '50+': 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=600&fit=crop&crop=face'
  },
  female: {
    '18-29': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
    '30-39': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
    '40-49': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&crop=face',
    '50+': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=600&fit=crop&crop=face'
  }
};

// Avatares baseados em % de gordura corporal e nível muscular
const BODY_COMPOSITION_AVATARS = {
  male: {
    // Baixa gordura (8-15%) + Alto músculo (4-5)
    lean_muscular: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop&crop=face',
    // Média gordura (16-20%) + Médio músculo (2-3)
    average: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=face',
    // Alta gordura (21%+) + Baixo músculo (1-2)
    higher_fat: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=600&fit=crop&crop=face'
  },
  female: {
    // Baixa gordura (12-20%) + Alto músculo (4-5)
    lean_muscular: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop&crop=face',
    // Média gordura (21-25%) + Médio músculo (2-3)
    average: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
    // Alta gordura (26%+) + Baixo músculo (1-2)
    higher_fat: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&crop=face'
  }
};

export default function MyShapeApp() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<ProgramTemplate | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Scroll listener para animações
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedPage = StorageManager.getCurrentPage() as AppPage;
    const savedProgress = StorageManager.getQuizProgress();
    const savedAssessment = StorageManager.getAssessment();
    
    if (savedPage && savedPage !== 'landing') {
      setCurrentPage(savedPage);
    }
    
    if (savedProgress) {
      setCurrentStep(savedProgress.currentStep);
      setAnswers(savedProgress.answers);
    }
    
    if (savedAssessment) {
      const tags = generateTags(savedAssessment.answers);
      const template = findBestTemplate(tags);
      setSelectedTemplate(template);
    }
  }, []);

  // Salvar progresso sempre que houver mudanças
  useEffect(() => {
    if (currentPage !== 'landing') {
      StorageManager.saveCurrentPage(currentPage);
    }
    if (Object.keys(answers).length > 0) {
      StorageManager.saveQuizProgress(currentStep, answers);
    }
  }, [currentPage, currentStep, answers]);

  // Função para voltar à página inicial
  const goToLanding = () => {
    setCurrentPage('landing');
  };

  // Função para obter avatar baseado no sexo e idade
  const getAvatarForAge = (age: number) => {
    const gender = answers.gender || 'male';
    const ageGroup = age < 30 ? '18-29' : age < 40 ? '30-39' : age < 50 ? '40-49' : '50+';
    return AVATAR_IMAGES[gender as keyof typeof AVATAR_IMAGES][ageGroup];
  };

  // Função para obter avatar baseado na composição corporal
  const getBodyCompositionAvatar = (bodyFat: number, muscleLevel: number, gender: string) => {
    const genderKey = gender as keyof typeof BODY_COMPOSITION_AVATARS;
    
    if (gender === 'male') {
      if (bodyFat <= 15 && muscleLevel >= 4) return BODY_COMPOSITION_AVATARS[genderKey].lean_muscular;
      if (bodyFat <= 20 && muscleLevel >= 2) return BODY_COMPOSITION_AVATARS[genderKey].average;
      return BODY_COMPOSITION_AVATARS[genderKey].higher_fat;
    } else {
      if (bodyFat <= 20 && muscleLevel >= 4) return BODY_COMPOSITION_AVATARS[genderKey].lean_muscular;
      if (bodyFat <= 25 && muscleLevel >= 2) return BODY_COMPOSITION_AVATARS[genderKey].average;
      return BODY_COMPOSITION_AVATARS[genderKey].higher_fat;
    }
  };

  // Função para obter avatar baseado no sexo escolhido
  const getGenderAvatar = (ageGroup: string) => {
    const gender = answers.gender || 'male';
    return AVATAR_IMAGES[gender as keyof typeof AVATAR_IMAGES][ageGroup as keyof typeof AVATAR_IMAGES.male];
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    // Obter a pergunta atual para verificar o tipo
    const currentQuestion = QUIZ_QUESTIONS[currentStep];
    
    // Verificar se a resposta é válida para avançar automaticamente
    const isValidAnswer = answer !== undefined && answer !== '' && 
      (currentQuestion?.type !== 'multiselect' || (Array.isArray(answer) && answer.length > 0));
    
    // Avançar automaticamente APENAS para perguntas de seleção única
    if (isValidAnswer && currentQuestion?.type === 'select') {
      // Para select simples, avançar rapidamente
      setTimeout(() => {
        nextStep();
      }, 600); // 600ms de delay para select
    }
  };

  const nextStep = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz completo - iniciar geração do plano
      setIsGenerating(true);
      setGenerationProgress(0);
      
      // Simular processo de geração com etapas mais longas
      const generatePlan = async () => {
        const steps = [
          { progress: 12, message: "Analisando suas respostas..." },
          { progress: 25, message: "Calculando seu perfil corporal..." },
          { progress: 38, message: "Selecionando exercícios ideais..." },
          { progress: 52, message: "Criando plano nutricional..." },
          { progress: 67, message: "Personalizando recomendações..." },
          { progress: 82, message: "Otimizando seu programa..." },
          { progress: 95, message: "Finalizando seu plano..." },
          { progress: 100, message: "Plano criado com sucesso!" }
        ];

        for (const step of steps) {
          await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
          setGenerationProgress(step.progress);
        }

        // Gerar assessment após animação
        const tags = generateTags(answers);
        const template = findBestTemplate(tags);
        setSelectedTemplate(template);
        
        const assessment = {
          id: Date.now().toString(),
          userId: 'user-1',
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer
          })),
          tags,
          completedAt: new Date()
        };
        
        StorageManager.saveAssessment(assessment);
        
        // Aguardar um pouco mais antes de mostrar o resultado
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsGenerating(false);
        setCurrentPage('preview');
      };

      generatePlan();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startQuiz = () => {
    setCurrentPage('quiz');
    setCurrentStep(0);
    setAnswers({});
  };

  const goToCheckout = () => {
    setCurrentPage('checkout');
  };

  const handlePayment = () => {
    // Simular pagamento
    setIsPaid(true);
    setCurrentPage('dashboard');
  };

  const resetApp = () => {
    StorageManager.clearAllData();
    setCurrentPage('landing');
    setCurrentStep(0);
    setAnswers({});
    setSelectedTemplate(null);
    setIsPaid(false);
  };

  // Função para calcular dados corporais baseados nas respostas
  const calculateBodyData = () => {
    const weight = Number(answers.weight) || 70;
    const height = Number(answers.height) || 170;
    const age = Number(answers.age) || 25;
    const gender = answers.gender || 'male';
    const goal = answers.goal || 'lose_weight';
    const activity = answers.activity || 'moderate';
    
    // Calcular IMC
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Validar se BMI é um número válido
    const validBmiValue = isNaN(bmi) ? 22 : bmi;
    
    // Estimar % de gordura corporal baseado em IMC, idade e gênero
    let bodyFat;
    if (gender === 'male') {
      bodyFat = (1.20 * validBmiValue) + (0.23 * age) - 16.2;
    } else {
      bodyFat = (1.20 * validBmiValue) + (0.23 * age) - 5.4;
    }
    bodyFat = Math.max(8, Math.min(35, bodyFat)); // Limitar entre 8% e 35%
    
    // Calcular idade de condicionamento físico
    const activityMultiplier = {
      sedentary: 0.6,
      light: 0.7,
      moderate: 0.8,
      active: 0.9,
      very_active: 1.0
    };
    const fitnessAge = Math.max(18, age - ((activityMultiplier[activity as keyof typeof activityMultiplier] || 0.8) - 0.6) * 20);
    
    // Calcular nível muscular (1-5 barras)
    const muscleLevel = Math.max(1, Math.min(5, Math.round(((activityMultiplier[activity as keyof typeof activityMultiplier] || 0.8) * 5))));
    
    // Calcular TMB (Taxa Metabólica Basal)
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Calcular calorias diárias baseado na atividade e objetivo
    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    let dailyCalories = bmr * (activityFactors[activity as keyof typeof activityFactors] || 1.55);
    
    // Ajustar baseado no objetivo
    if (goal === 'lose_weight') {
      dailyCalories *= 0.8; // Déficit de 20%
    } else if (goal === 'gain_muscle') {
      dailyCalories *= 1.1; // Superávit de 10%
    }
    
    // Calcular ingestão de água (35ml por kg de peso corporal)
    const dailyWaterIntake = Math.round((weight * 35) / 1000 * 10) / 10; // Em litros
    
    // Projeções para 90 dias
    const futureBodyFat = Math.max(
      gender === 'male' ? 8 : 12, 
      bodyFat - (goal === 'lose_weight' ? 8 : goal === 'gain_muscle' ? 2 : 4)
    );
    const futureMuscleLevel = Math.min(5, muscleLevel + (goal === 'gain_muscle' ? 2 : 1));
    const futureFitnessAge = Math.max(18, fitnessAge - 5);
    
    return {
      current: {
        bmi: Math.round(validBmiValue * 10) / 10,
        bodyFat: Math.round(bodyFat),
        fitnessAge: Math.round(fitnessAge),
        muscleLevel,
        dailyCalories: Math.round(dailyCalories),
        waterIntake: dailyWaterIntake
      },
      future: {
        bodyFat: Math.round(futureBodyFat),
        fitnessAge: Math.round(futureFitnessAge),
        muscleLevel: futureMuscleLevel
      }
    };
  };

  // Função para determinar categoria do IMC
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: 'text-blue-400', bgColor: 'bg-blue-500' };
    if (bmi < 25) return { category: 'Peso normal', color: 'text-green-400', bgColor: 'bg-green-500' };
    if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-400', bgColor: 'bg-yellow-500' };
    return { category: 'Obesidade', color: 'text-red-400', bgColor: 'bg-red-500' };
  };

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const currentAnswer = answers[currentQuestion?.id];
  const canProceed = currentAnswer !== undefined && currentAnswer !== '' && 
    (currentQuestion?.type !== 'multiselect' || (Array.isArray(currentAnswer) && currentAnswer.length > 0));

  // Generation Loading Page - VERSÃO PROFISSIONAL E RESPONSIVA
  if (isGenerating) {
    const getProgressMessage = () => {
      if (generationProgress <= 12) return "Analisando suas respostas...";
      if (generationProgress <= 25) return "Calculando seu perfil corporal...";
      if (generationProgress <= 38) return "Selecionando exercícios ideais...";
      if (generationProgress <= 52) return "Criando plano nutricional...";
      if (generationProgress <= 67) return "Personalizando recomendações...";
      if (generationProgress <= 82) return "Otimizando seu programa...";
      if (generationProgress <= 95) return "Finalizando seu plano...";
      return "Plano criado com sucesso!";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Effects Profissionais */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/10 via-transparent to-blue-600/10"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-700/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Partículas Sutis */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Container Principal Responsivo */}
        <div className="container mx-auto px-4 py-6 sm:py-8 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-lg sm:max-w-xl md:max-w-2xl w-full">
            {/* Ícone Central Profissional */}
            <div className="relative mb-8 sm:mb-12">
              <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                <Brain className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              
              {/* Elementos Decorativos Responsivos */}
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 animate-bounce">
                <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 md:-bottom-4 md:-left-4 animate-bounce" style={{ animationDelay: '0.5s' }}>
                <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-blue-700 rounded-full flex items-center justify-center">
                  <Target className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 text-white" />
                </div>
              </div>
            </div>

            {/* Título Principal Responsivo */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                Criando Seu Plano
              </span>
            </h1>

            {/* Subtítulo Dinâmico */}
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 animate-pulse px-4">
              {getProgressMessage()}
            </p>

            {/* Barra de Progresso Profissional */}
            <div className="mb-6 sm:mb-8 px-4">
              <div className="relative w-full h-4 sm:h-5 md:h-6 bg-gray-800/60 rounded-full overflow-hidden backdrop-blur-sm border border-blue-700/20">
                {/* Fundo com gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700/10 to-blue-400/10"></div>
                
                {/* Barra de progresso principal */}
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-700 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${generationProgress}%` }}
                >
                  {/* Efeito de brilho profissional */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              
              {/* Porcentagem */}
              <div className="flex justify-between items-center mt-3 sm:mt-4 px-2">
                <span className="text-xs sm:text-sm text-gray-400">Progresso</span>
                <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  {generationProgress}%
                </span>
              </div>
            </div>

            {/* Elementos de Status Responsivos */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-4">
              <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-3 py-2 rounded-full border border-blue-700/20">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-700 animate-pulse" />
                <span className="text-xs sm:text-sm text-gray-300">Analisando</span>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-3 py-2 rounded-full border border-blue-400/20">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 animate-bounce" />
                <span className="text-xs sm:text-sm text-gray-300">Processando</span>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-3 py-2 rounded-full border border-yellow-500/20">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-pulse" />
                <span className="text-xs sm:text-sm text-gray-300">Personalizando</span>
              </div>
            </div>

            {/* Mensagem Motivacional Responsiva */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-blue-700/15 rounded-xl sm:rounded-2xl p-4 sm:p-6 mx-4">
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                Nossa IA está analisando mais de <span className="text-blue-400 font-semibold">50 variáveis</span> do seu perfil 
                para criar um plano <span className="text-blue-700 font-semibold">100% personalizado</span> que se adapta 
                perfeitamente ao seu corpo e objetivos.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Landing Page - VERSÃO PROFISSIONAL E SIMPLIFICADA
  if (currentPage === 'landing') {
    // Escolher personagem aleatório
    const randomGender = Math.random() > 0.5 ? 'male' : 'female';
    const randomAge = ['18-29', '30-39', '40-49'][Math.floor(Math.random() * 3)];
    const randomCharacter = AVATAR_IMAGES[randomGender][randomAge as keyof typeof AVATAR_IMAGES.male];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Effects Sutis */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/5 via-transparent to-blue-600/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-700/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header Minimalista */}
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-2xl">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                MyShape
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Side - Content Simplificado */}
              <div className="text-center lg:text-left">
                {/* Main Title */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                  <span className="text-white drop-shadow-lg">
                    Descubra o Treino e a Dieta Perfeitos para o 
                  </span>
                  <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent block mt-2">
                    Seu Corpo
                  </span>
                </h2>

                {/* Subtitle Profissional */}
                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Um plano 100% personalizado, criado para você em minutos
                </p>

                {/* Social Proof Simplificado */}
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-12">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full border-2 border-white"></div>
                      ))}
                    </div>
                    <span className="text-lg font-semibold">+10.000 transformações</span>
                  </div>
                </div>

                {/* Main CTA Button */}
                <div className="mb-8">
                  <button
                    onClick={startQuiz}
                    className="group relative bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white px-12 py-6 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-700/50 border border-blue-700/30"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Fazer Meu Teste
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {/* Trust Badges Minimalistas */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Teste rápido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Resultados imediatos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>100% gratuito</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Character Profissional */}
              <div className="relative">
                <div className="relative mx-auto w-80 h-96 lg:w-96 lg:h-[500px]">
                  {/* Glow Effect Sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 via-transparent to-blue-500/20 rounded-3xl blur-2xl"></div>
                  
                  {/* Character Image */}
                  <div className="relative z-10 w-full h-full overflow-hidden rounded-3xl border border-blue-700/20 bg-gradient-to-br from-gray-900/30 to-gray-800/30 backdrop-blur-sm">
                    {/* Container para vídeo */}
                    <div className="w-full h-full relative">
                      {/* Placeholder para vídeo - você pode substituir por um elemento <video> */}
                      <div className="w-full h-full bg-gray-800/50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                          <p className="text-gray-400 text-sm">Espaço para mini vídeo</p>
                        </div>
                      </div>
                      
                      {/* Exemplo de como adicionar um vídeo real:
                      <video 
                        className="w-full h-full object-cover object-center"
                        autoPlay
                        muted
                        loop
                        playsInline
                      >
                        <source src="/path/to/your/video.mp4" type="video/mp4" />
                        Seu navegador não suporta vídeo.
                      </video>
                      */}
                    </div>
                    
                    {/* Overlay Effects Sutis */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-700/10 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5"></div>
                  </div>

                  {/* Floating Elements Minimalistas */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-700 to-blue-500 p-3 rounded-2xl animate-bounce shadow-2xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-blue-700 p-3 rounded-2xl animate-pulse shadow-2xl">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Novas Seções Inspiradas nas Imagens */}
          
          {/* Seção Sistema de Criação de Hábitos */}
          <div className="max-w-7xl mx-auto mt-32 mb-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Imagem à esquerda */}
              <div className="relative">
                <div className="relative mx-auto w-full h-96 lg:h-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 via-transparent to-blue-500/20 rounded-3xl blur-2xl"></div>
                  <div className="relative z-10 w-full h-full overflow-hidden rounded-3xl border border-blue-700/20 bg-gradient-to-br from-gray-900/30 to-gray-800/30 backdrop-blur-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=800&fit=crop"
                      alt="Sistema de criação de hábitos"
                      className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-700/10 via-transparent to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Texto à direita */}
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                    Sistema de Criação de Hábitos
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Melhore não apenas a forma física, mas também desenvolva hábitos saudáveis e força mental. 
                  Nosso sistema integrado trabalha corpo e mente para resultados duradouros.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-700/20">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Mindset Vencedor</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-700/20">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Foco nos Resultados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Entregamos Resultados */}
          <div className="max-w-7xl mx-auto mb-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                  Entregamos Resultados
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Milhares de pessoas já transformaram seus corpos com nossos planos personalizados
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Resultado 1 */}
              <div className="text-center bg-gray-900/40 backdrop-blur-sm border border-blue-700/20 rounded-3xl p-8">
                <div className="text-6xl mb-4">🎯</div>
                <div className="text-3xl font-bold text-blue-400 mb-2">115.000</div>
                <p className="text-gray-300">treinos concluídos com sucesso em nossa plataforma</p>
              </div>

              {/* Resultado 2 */}
              <div className="text-center bg-gray-900/40 backdrop-blur-sm border border-blue-700/20 rounded-3xl p-8">
                <div className="text-6xl mb-4">💪</div>
                <div className="text-3xl font-bold text-blue-400 mb-2">60.000</div>
                <p className="text-gray-300">pessoas conquistaram o corpo dos sonhos</p>
              </div>

              {/* Resultado 3 */}
              <div className="text-center bg-gray-900/40 backdrop-blur-sm border border-blue-700/20 rounded-3xl p-8">
                <div className="text-6xl mb-4">😎</div>
                <div className="text-3xl font-bold text-blue-400 mb-2">100.000+</div>
                <p className="text-gray-300">usuários transformados em todo o mundo</p>
              </div>
            </div>
          </div>

          {/* Seção Plano de Treino Personalizado */}
          <div className="max-w-7xl mx-auto mb-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Gráfico/Visual à esquerda */}
              <div className="relative">
                <div className="bg-gray-900/60 backdrop-blur-sm border border-blue-700/20 rounded-3xl p-8 text-center">
                  <h3 className="text-2xl font-bold mb-6 text-blue-400">Seu Progresso</h3>
                  
                  {/* Gráfico de Peso Simulado */}
                  <div className="relative mx-auto w-48 h-48 mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40 * 0.75} ${2 * Math.PI * 40}`}
                        className="text-blue-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">88kg</div>
                        <div className="text-sm text-gray-400">Peso Atual</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/60 p-4 rounded-xl">
                      <div className="text-sm text-gray-400">Meta</div>
                      <div className="text-xl font-bold text-green-400">75kg</div>
                    </div>
                    <div className="bg-gray-800/60 p-4 rounded-xl">
                      <div className="text-sm text-gray-400">Progresso</div>
                      <div className="text-xl font-bold text-blue-400">75%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Texto à direita */}
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                    Plano de Treino Personalizado
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Em nosso banco de dados, há mais de 200 exercícios diferentes. 
                  Selecionamos os melhores para seu perfil, criando um programa único que se adapta ao seu corpo e objetivos.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-700/20">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-300">Queima Gordura</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-700/20">
                    <Dumbbell className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Ganha Músculo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Plano de Refeições */}
          <div className="max-w-7xl mx-auto mb-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Texto à esquerda */}
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                    Plano de Refeições Personalizado
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  O plano de refeições é ajustado de acordo com suas preferências alimentares, 
                  restrições e objetivos. Receitas práticas e deliciosas que cabem na sua rotina.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-700/20">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Macro Balanceado</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-700/20">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Receitas Rápidas</span>
                  </div>
                </div>
              </div>

              {/* Imagens de refeições à direita */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative h-32 overflow-hidden rounded-2xl border border-blue-700/20">
                      <img 
                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop"
                        alt="Refeição saudável"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="relative h-40 overflow-hidden rounded-2xl border border-blue-700/20">
                      <img 
                        src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=250&fit=crop"
                        alt="Refeição fitness"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 via-transparent to-transparent"></div>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="relative h-40 overflow-hidden rounded-2xl border border-blue-700/20">
                      <img 
                        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=250&fit=crop"
                        alt="Salada nutritiva"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="relative h-32 overflow-hidden rounded-2xl border border-blue-700/20">
                      <img 
                        src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop"
                        alt="Smoothie proteico"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 via-transparent to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Page - VERSÃO PROFISSIONAL MELHORADA
  if (currentPage === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Effects Profissionais */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/5 via-transparent to-blue-600/5"></div>
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-700/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Partículas Sutis */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
          {/* Header Profissional */}
          <header className="flex items-center justify-between mb-8 sm:mb-12">
            <button 
              onClick={goToLanding}
              className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-2xl group-hover:shadow-blue-700/50">
                <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                MyShape
              </span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-700/20">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Avaliação Inteligente</span>
              </div>
            </div>
          </header>

          {/* Progress Bar Profissional */}
          <div className="mb-12 sm:mb-16">
            <ProgressBar 
              current={currentStep + 1} 
              total={QUIZ_QUESTIONS.length} 
              className="mb-4"
            />
            <div className="flex justify-between text-xs sm:text-sm text-gray-400 px-2">
              <span>Início</span>
              <span className="text-blue-400 font-semibold">
                {Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% completo
              </span>
              <span>Finalização</span>
            </div>
          </div>

          {/* Question Container Profissional */}
          <div className="max-w-4xl mx-auto">
            {/* Question Title */}
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                  {currentQuestion.question}
                </span>
              </h2>
              
              {/* Subtitle se existir */}
              {currentQuestion.subtitle && (
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  {currentQuestion.subtitle}
                </p>
              )}
            </div>

            {/* Question Images - Agora baseadas no sexo escolhido */}
            {currentQuestion.images && currentQuestion.images.length > 0 && (
              <div className="mb-8 sm:mb-12">
                {currentQuestion.images.map((imageUrl, index) => {
                  // Se já temos o sexo escolhido e a pergunta tem imagens de avatar, usar as corretas
                  let finalImageUrl = imageUrl;
                  if (answers.gender && currentQuestion.id === 'age') {
                    // Para pergunta de idade, usar avatar baseado no sexo
                    const age = currentAnswer || 25;
                    finalImageUrl = getAvatarForAge(age);
                  }
                  
                  return (
                    <div key={index} className="relative">
                      <QuestionImage
                        src={finalImageUrl}
                        alt={`Imagem da pergunta: ${currentQuestion.question}`}
                        className="max-w-2xl mx-auto rounded-3xl border border-blue-700/20 shadow-2xl"
                      />
                      {/* Overlay sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-700/5 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Answer Options Container */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-gray-900/40 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-blue-700/15 shadow-2xl">
                {currentQuestion.type === 'select' && currentQuestion.id === 'gender' && (
                  <GenderSelect
                    value={currentAnswer || ''}
                    onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  />
                )}

                {currentQuestion.type === 'select' && currentQuestion.id !== 'gender' && (
                  <OptionSelect
                    options={currentQuestion.options || []}
                    value={currentAnswer || ''}
                    onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  />
                )}

                {currentQuestion.type === 'multiselect' && (
                  <MultiSelect
                    options={currentQuestion.options || []}
                    value={currentAnswer || []}
                    onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  />
                )}

                {currentQuestion.type === 'range' && (
                  <RangeSlider
                    min={currentQuestion.min || 0}
                    max={currentQuestion.max || 100}
                    step={currentQuestion.step || 1}
                    value={currentAnswer || currentQuestion.min || 0}
                    onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    unit={currentQuestion.unit}
                  />
                )}
              </div>
            </div>

            {/* Navigation Profissional */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900/60 backdrop-blur-sm border border-gray-600/30 text-gray-300 hover:border-gray-500/50 hover:bg-gray-800/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-xl"
              >
                <ChevronLeft className="w-5 h-5" />
                Voltar
              </button>

              {/* Botão Continuar para multiselect e range */}
              {(currentQuestion.type === 'multiselect' || currentQuestion.type === 'range') && (
                <button
                  onClick={nextStep}
                  disabled={!canProceed}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-blue-700/50"
                >
                  {currentStep === QUIZ_QUESTIONS.length - 1 ? 'Finalizar' : 'Continuar'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Indicador para select simples */}
              {currentQuestion.type === 'select' && (
                <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-600/30">
                  {canProceed ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Avançando automaticamente...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span>Selecione uma opção</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Preview Page - NOVA VERSÃO PROFISSIONAL E GAMIFICADA
  if (currentPage === 'preview' && selectedTemplate) {
    const bodyData = calculateBodyData();
    const bmiInfo = getBMICategory(bodyData.current.bmi);
    const gender = answers.gender || 'male';
    const age = answers.age || 25;

    // Calcular offset de scroll para animações
    const scrollOffset = scrollY * 0.5;
    const isScrolled = scrollY > 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Effects Dinâmicos */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/5 via-transparent to-blue-600/5"></div>
          <div 
            className="absolute top-20 left-20 w-96 h-96 bg-blue-700/10 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollOffset}px)` }}
          ></div>
          <div 
            className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${-scrollOffset}px)`, animationDelay: '2s' }}
          ></div>
        </div>

        {/* Partículas Flutuantes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
                transform: `translateY(${scrollOffset * (Math.random() * 0.5 + 0.5)}px)`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header Fixo */}
          <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-blue-700/20' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={goToLanding}
                  className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
                >
                  <div className="p-2 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl">
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                    MyShape
                  </span>
                </button>
                
                {/* Indicador de Progresso */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-green-400 font-semibold">Plano Criado!</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Espaçamento para header fixo */}
          <div className="h-20"></div>

          <div className="max-w-7xl mx-auto">
            {/* Hero Section com Animação */}
            <div className={`text-center mb-16 transition-all duration-1000 ${isScrolled ? 'transform -translate-y-4 opacity-90' : 'transform translate-y-0 opacity-100'}`}>
              <div className="relative">
                {/* Título Principal com Efeito */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 via-white to-blue-700 bg-clip-text text-transparent animate-pulse">
                    Seu Plano Está
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                    Pronto!
                  </span>
                </h1>

                {/* Elementos Decorativos */}
                <div className="absolute -top-8 -right-8 animate-bounce">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-8 animate-pulse">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Baseado nas suas respostas, criamos o plano perfeito para transformar seu corpo em 
                <span className="text-blue-400 font-semibold"> 90 dias</span>
              </p>

              {/* Stats Gamificadas */}
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <div className="bg-gray-900/60 backdrop-blur-sm border border-blue-700/30 rounded-2xl px-6 py-4">
                  <div className="text-2xl font-bold text-blue-700">100%</div>
                  <div className="text-sm text-gray-400">Personalizado</div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-sm border border-blue-400/30 rounded-2xl px-6 py-4">
                  <div className="text-2xl font-bold text-blue-400">90</div>
                  <div className="text-sm text-gray-400">Dias</div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-sm border border-yellow-500/30 rounded-2xl px-6 py-4">
                  <div className="text-2xl font-bold text-yellow-400">∞</div>
                  <div className="text-sm text-gray-400">Resultados</div>
                </div>
              </div>
            </div>

            {/* Transformação Corporal - NOVA VERSÃO */}
            <div className={`mb-16 transition-all duration-1000 delay-200 ${scrollY > 200 ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-70'}`}>
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-blue-700/20 shadow-2xl">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
                      Sua Transformação
                    </span>
                  </h2>
                  <p className="text-gray-300 text-lg">Veja como seu corpo vai evoluir nos próximos 90 dias</p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Estado Atual */}
                  <div className="text-center">
                    <div className="relative mb-8">
                      <h3 className="text-2xl font-bold mb-6 text-gray-300 flex items-center justify-center gap-3">
                        <Clock className="w-6 h-6 text-gray-400" />
                        Agora
                      </h3>
                      
                      {/* Avatar Atual baseado na composição corporal */}
                      <div className="relative mx-auto mb-8 w-64 h-80 overflow-hidden rounded-3xl border-2 border-gray-600/50">
                        <img 
                          src={getBodyCompositionAvatar(bodyData.current.bodyFat, bodyData.current.muscleLevel, gender)} 
                          alt={`Avatar ${gender} atual`}
                          className="w-full h-full object-cover filter brightness-75 contrast-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Overlay de Status */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3">
                            <div className="text-sm text-gray-300">Status Atual</div>
                            <div className="text-lg font-bold text-yellow-400">Em Desenvolvimento</div>
                          </div>
                        </div>
                      </div>

                      {/* Stats Atuais */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-600/30">
                          <div className="text-sm text-gray-400 mb-1">Gordura Corporal</div>
                          <div className="text-2xl font-bold text-yellow-400">{bodyData.current.bodyFat}%</div>
                        </div>
                        
                        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-600/30">
                          <div className="text-sm text-gray-400 mb-1">Idade Fitness</div>
                          <div className="text-2xl font-bold text-orange-400">{bodyData.current.fitnessAge} anos</div>
                        </div>
                        
                        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-600/30 col-span-2">
                          <div className="text-sm text-gray-400 mb-2">Nível Muscular</div>
                          <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map((bar) => (
                              <div
                                key={bar}
                                className={`w-6 h-8 rounded-lg transition-all duration-500 ${
                                  bar <= bodyData.current.muscleLevel 
                                    ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-lg' 
                                    : 'bg-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seta de Transformação */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-4 rounded-full animate-pulse">
                      <ChevronRight className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Estado Futuro */}
                  <div className="text-center">
                    <div className="relative mb-8">
                      <h3 className="text-2xl font-bold mb-6 text-green-400 flex items-center justify-center gap-3">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        Em 90 Dias
                      </h3>
                      
                      {/* Avatar Futuro melhorado */}
                      <div className="relative mx-auto mb-8 w-64 h-80 overflow-hidden rounded-3xl border-2 border-green-500/50">
                        <img 
                          src={getBodyCompositionAvatar(bodyData.future.bodyFat, bodyData.future.muscleLevel, gender)} 
                          alt={`Avatar ${gender} futuro`}
                          className="w-full h-full object-cover filter brightness-110 contrast-110 saturate-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-green-400/5 animate-pulse"></div>
                        
                        {/* Overlay de Conquista */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-green-900/70 backdrop-blur-sm rounded-xl p-3 border border-green-500/30">
                            <div className="text-sm text-green-300">Objetivo Alcançado</div>
                            <div className="text-lg font-bold text-green-400">Transformado!</div>
                          </div>
                        </div>
                        
                        {/* Efeitos de Sucesso */}
                        <div className="absolute -top-2 -right-2 animate-bounce">
                          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-black" />
                          </div>
                        </div>
                      </div>

                      {/* Stats Futuras */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-green-500/30">
                          <div className="text-sm text-gray-400 mb-1">Gordura Corporal</div>
                          <div className="text-2xl font-bold text-green-400">{bodyData.future.bodyFat}%</div>
                          <div className="text-xs text-green-400 font-semibold">
                            -{bodyData.current.bodyFat - bodyData.future.bodyFat}%
                          </div>
                        </div>
                        
                        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-green-500/30">
                          <div className="text-sm text-gray-400 mb-1">Idade Fitness</div>
                          <div className="text-2xl font-bold text-green-400">{bodyData.future.fitnessAge} anos</div>
                          <div className="text-xs text-green-400 font-semibold">
                            -{bodyData.current.fitnessAge - bodyData.future.fitnessAge} anos
                          </div>
                        </div>
                        
                        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-green-500/30 col-span-2">
                          <div className="text-sm text-gray-400 mb-2">Nível Muscular</div>
                          <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map((bar) => (
                              <div
                                key={bar}
                                className={`w-6 h-8 rounded-lg transition-all duration-500 ${
                                  bar <= bodyData.future.muscleLevel 
                                    ? 'bg-gradient-to-t from-green-600 to-green-400 shadow-lg animate-pulse' 
                                    : 'bg-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-green-400 font-semibold mt-2">
                            +{bodyData.future.muscleLevel - bodyData.current.muscleLevel} níveis
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo Pessoal e Recomendações */}
            <div className={`grid lg:grid-cols-2 gap-8 mb-16 transition-all duration-1000 delay-400 ${scrollY > 400 ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-70'}`}>
              {/* BMI e Status de Saúde */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-blue-700/20 shadow-2xl">
                <h3 className="text-2xl font-bold mb-8 text-blue-400 flex items-center gap-3">
                  <Activity className="w-6 h-6" />
                  Resumo Pessoal
                </h3>
                
                {/* IMC */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300 font-semibold">IMC Atual</span>
                    <span className="text-3xl font-bold">{bodyData.current.bmi}</span>
                  </div>
                  
                  {/* Barra de IMC Interativa */}
                  <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden mb-4">
                    <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 w-full"></div>
                    <div 
                      className="absolute top-0 h-full w-2 bg-white shadow-2xl rounded-full transition-all duration-1000"
                      style={{ left: `${Math.min(95, Math.max(5, (bodyData.current.bmi - 15) / 25 * 100))}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>15</span>
                    <span>20</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                  
                  <div className={`text-center p-4 rounded-2xl ${bmiInfo.color} bg-gray-800/50 border border-gray-600/30`}>
                    <div className="font-bold text-lg">{bmiInfo.category}</div>
                    <div className="text-sm text-gray-400 mt-2">
                      {bodyData.current.bmi < 18.5 && "Recomendamos ganho de peso saudável"}
                      {bodyData.current.bmi >= 18.5 && bodyData.current.bmi < 25 && "Mantenha seus hábitos saudáveis"}
                      {bodyData.current.bmi >= 25 && bodyData.current.bmi < 30 && "Foque na perda de gordura corporal"}
                      {bodyData.current.bmi >= 30 && "Priorize a perda de peso com acompanhamento"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recomendações Diárias */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-blue-400/20 shadow-2xl">
                <h3 className="text-2xl font-bold mb-8 text-blue-700 flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  Recomendações Diárias
                </h3>
                
                {/* Calorias */}
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-2xl mb-6 border border-orange-500/30">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-orange-500/30 rounded-xl">
                      <Flame className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Calorias</div>
                      <div className="text-3xl font-bold text-orange-400">
                        {bodyData.current.dailyCalories.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Baseado no seu objetivo e nível de atividade
                  </div>
                </div>

                {/* Água */}
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-2xl border border-blue-500/30">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-blue-500/30 rounded-xl">
                      <Droplets className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Água</div>
                      <div className="text-3xl font-bold text-blue-400">
                        {bodyData.current.waterIntake}L
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Hidratação ideal para seu peso corporal
                  </div>
                </div>
              </div>
            </div>

            {/* Preview do Programa */}
            <div className={`mb-16 transition-all duration-1000 delay-600 ${scrollY > 600 ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-70'}`}>
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-blue-700/20 shadow-2xl">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-4">
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-gray-300 text-lg mb-6">
                    {selectedTemplate.description}
                  </p>
                  <p className="text-xl leading-relaxed max-w-4xl mx-auto">
                    {selectedTemplate.summary}
                  </p>
                </div>

                {/* Conteúdo Bloqueado com Efeito Profissional */}
                <div className="space-y-6">
                  {[
                    { title: "Treino Completo", desc: "Segunda-feira: Peito e Tríceps - 8 exercícios detalhados com séries, repetições e técnicas avançadas...", icon: Dumbbell },
                    { title: "Plano Nutricional", desc: "Café da manhã: Aveia com frutas e whey protein (320 kcal) - Receitas completas e substituições...", icon: Flame },
                    { title: "Dicas Personalizadas", desc: "• Beba 2-3L de água por dia • Durma 7-8 horas • Suplementação recomendada para seu perfil...", icon: Target }
                  ].map((item, index) => (
                    <div key={index} className="relative group">
                      <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/30 relative overflow-hidden">
                        {/* Conteúdo Blur */}
                        <div className="filter blur-sm">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-700/30 rounded-xl">
                              <item.icon className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="font-bold text-xl">{item.title}</h3>
                          </div>
                          <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                        </div>
                        
                        {/* Overlay de Bloqueio */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-800/60 to-gray-900/80 flex items-center justify-center">
                          <div className="text-center">
                            <div className="p-4 bg-blue-700/20 rounded-full mb-4 mx-auto w-fit">
                              <Lock className="w-8 h-8 text-blue-400" />
                            </div>
                            <div className="text-blue-400 font-semibold">Conteúdo Bloqueado</div>
                            <div className="text-sm text-gray-400 mt-1">Desbloqueie para ver todos os detalhes</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Final */}
            <div className={`text-center transition-all duration-1000 delay-800 ${scrollY > 800 ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-70'}`}>
              <div className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-blue-700/30 shadow-2xl">
                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Transforme seu corpo <span className="text-blue-400">hoje mesmo!</span>
                  </h3>
                  <p className="text-gray-300 text-lg mb-6">
                    Desbloqueie seu plano completo por apenas
                  </p>
                  <div className="text-5xl md:text-6xl font-bold text-blue-400 mb-2">
                    R$ 47
                  </div>
                  <div className="text-gray-400">
                    <span className="line-through">R$ 197</span> • Oferta limitada
                  </div>
                </div>
                
                <button
                  onClick={goToCheckout}
                  className="group relative bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white px-12 py-6 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-700/50 border border-blue-700/50"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Lock className="w-6 h-6" />
                    Desbloquear Meu Plano
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Acesso imediato</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Garantia de 30 dias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Suporte especializado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Checkout Page
  if (currentPage === 'checkout') {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <button 
              onClick={goToLanding}
              className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
            >
              <Dumbbell className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">MyShape</span>
            </button>
          </header>

          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Finalizar Compra</h1>
              <p className="text-gray-400">
                Você está a um passo de transformar seu corpo
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-900 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>
              
              <div className="flex justify-between items-center py-4 border-b border-gray-700">
                <div>
                  <h3 className="font-semibold">{selectedTemplate?.name}</h3>
                  <p className="text-gray-400 text-sm">Plano fitness personalizado</p>
                </div>
                <span className="text-xl font-bold">R$ 47,00</span>
              </div>

              <div className="flex justify-between items-center py-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-400">R$ 47,00</span>
              </div>
            </div>

            {/* Payment Button */}
            <div className="text-center">
              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-3"
              >
                <CreditCard className="w-6 h-6" />
                Pagar com Kirvano
              </button>
              
              <p className="text-gray-500 text-sm mt-4">
                Pagamento seguro processado pelo Kirvano
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Page
  if (currentPage === 'dashboard' && selectedTemplate) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <button 
              onClick={goToLanding}
              className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
            >
              <Dumbbell className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">MyShape</span>
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => alert('Download PDF em desenvolvimento')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar PDF
              </button>
              <button
                onClick={resetApp}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refazer
              </button>
            </div>
          </header>

          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Seu Plano Personalizado</h1>
              <p className="text-gray-400">
                Parabéns! Agora você tem acesso completo ao seu plano fitness
              </p>
            </div>

            {/* Program Details */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Workouts */}
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 text-blue-400">Treinos</h2>
                <div className="space-y-4">
                  {selectedTemplate.fullProgram.workouts.map((workout, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-xl">
                      <h3 className="font-semibold mb-3">{workout.day}</h3>
                      <div className="space-y-2">
                        {workout.exercises.map((exercise, exerciseIndex) => (
                          <div key={exerciseIndex} className="text-sm">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{exercise.name}</span>
                              <span className="text-gray-400">{exercise.sets}x{exercise.reps}</span>
                            </div>
                            <p className="text-gray-500 text-xs">{exercise.instructions}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        Duração: {workout.duration} minutos
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrition */}
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 text-blue-400">Nutrição</h2>
                
                {/* Macros */}
                <div className="bg-gray-800 p-4 rounded-xl mb-4">
                  <h3 className="font-semibold mb-3">Metas Diárias</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Calorias:</span>
                      <span className="font-bold ml-2">{selectedTemplate.fullProgram.nutrition.calories}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Proteína:</span>
                      <span className="font-bold ml-2">{selectedTemplate.fullProgram.nutrition.protein}g</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Carboidratos:</span>
                      <span className="font-bold ml-2">{selectedTemplate.fullProgram.nutrition.carbs}g</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Gorduras:</span>
                      <span className="font-bold ml-2">{selectedTemplate.fullProgram.nutrition.fat}g</span>
                    </div>
                  </div>
                </div>

                {/* Meals */}
                <div className="space-y-3">
                  {selectedTemplate.fullProgram.nutrition.meals.map((meal, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{meal.name}</h4>
                        <span className="text-sm text-gray-400">{meal.time}</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        {meal.foods.join(', ')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {meal.calories} calorias
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-900 rounded-2xl p-6 mt-8">
              <h2 className="text-xl font-bold mb-6 text-blue-400">Dicas Personalizadas</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedTemplate.fullProgram.tips.map((tip, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-xl">
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}