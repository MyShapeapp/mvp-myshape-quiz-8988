'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Dumbbell, Target, Clock, Download, RefreshCw, Lock, CreditCard, Droplets, Flame, Activity, TrendingUp, Trophy, Zap, Users, Brain, Sparkles, Star, CheckCircle, Calendar, Award, Plus, Minus, Crown, Shield, Mail, User } from 'lucide-react';
import { ProgressBar } from '@/components/ProgressBar';
import { GenderSelect } from '@/components/GenderSelect';
import { RangeSlider } from '@/components/RangeSlider';
import { OptionSelect } from '@/components/OptionSelect';
import { MultiSelect } from '@/components/MultiSelect';
import { QuestionImage } from '@/components/QuestionImage';
import { QUIZ_QUESTIONS, generateTags, findBestTemplate } from '@/lib/quiz-data';
import { StorageManager } from '@/lib/storage';
import { AppPage, ProgramTemplate } from '@/lib/types';

export default function MyShapeApp() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<ProgramTemplate | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Estados do Dashboard Gamificado
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [caloriesGoal, setCaloriesGoal] = useState(2000);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2.5);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedWorkouts, setCompletedWorkouts] = useState<number[]>([]);
  const [completedMeals, setCompletedMeals] = useState<number[]>([]);

  // Estados do Pré-Checkout
  const [preCheckoutData, setPreCheckoutData] = useState({
    name: '',
    email: ''
  });

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
        
        // Aguardar um pouco mais antes de mostrar o pré-checkout
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsGenerating(false);
        setCurrentPage('pre-checkout'); // Ir para pré-checkout em vez de preview
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

  const goToPreview = () => {
    setCurrentPage('preview');
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

  // Funções do Dashboard Gamificado
  const addCalories = (amount: number) => {
    const newCalories = Math.min(dailyCalories + amount, caloriesGoal);
    setDailyCalories(newCalories);
    if (newCalories === caloriesGoal) {
      addXP(50); // XP por completar meta de calorias
    }
  };

  const addWater = (amount: number) => {
    const newWater = Math.min(waterIntake + amount, waterGoal);
    setWaterIntake(newWater);
    if (newWater === waterGoal) {
      addXP(30); // XP por completar meta de água
    }
  };

  const addXP = (amount: number) => {
    const newXP = userXP + amount;
    const xpForNextLevel = userLevel * 100;
    
    if (newXP >= xpForNextLevel) {
      setUserLevel(userLevel + 1);
      setUserXP(newXP - xpForNextLevel);
    } else {
      setUserXP(newXP);
    }
  };

  const completeWorkout = (workoutId: number) => {
    if (!completedWorkouts.includes(workoutId)) {
      setCompletedWorkouts([...completedWorkouts, workoutId]);
      addXP(100); // XP por completar treino
    }
  };

  const completeMeal = (mealId: number) => {
    if (!completedMeals.includes(mealId)) {
      setCompletedMeals([...completedMeals, mealId]);
      addXP(25); // XP por completar refeição
    }
  };

  // Função para lidar com o pré-checkout
  const handlePreCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!preCheckoutData.name.trim() || !preCheckoutData.email.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(preCheckoutData.email)) {
      alert('Por favor, insira um email válido.');
      return;
    }

    // Salvar dados do lead (aqui você pode integrar com Supabase)
    console.log('Lead capturado:', preCheckoutData);
    
    // Redirecionar para o link da Kirvano (substitua pela URL real)
    window.open('https://kirvano.com/checkout-link', '_blank');
    
    // Ou ir para a página de preview
    goToPreview();
  };

  // Função para calcular dados corporais baseados nas respostas - PERSONALIZADA
  const calculateBodyData = () => {
    const weight = Number(answers.weight) || 70;
    const goalWeight = Number(answers.goalWeight) || weight;
    const height = Number(answers.height) || 170;
    const age = Number(answers.age?.split('-')[0]) || 25;
    const gender = answers.gender || 'male';
    const goal = answers.mainGoal || 'Perder peso e queimar gordura';
    const activity = answers.fitnessLevel || 'Básico - Me exercito ocasionalmente';
    const goalDate = answers.goalDate || 'Em 3 meses';
    
    // Calcular IMC
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Validar se BMI é um número válido
    const validBmiValue = isNaN(bmi) ? 22 : bmi;
    
    // Estimar % de gordura corporal baseado em IMC, idade e gênero (AUMENTADA para dar sensação de evolução)
    let bodyFat;
    if (gender === 'male') {
      bodyFat = (1.20 * validBmiValue) + (0.23 * age) - 16.2 + 3; // +3% para dar margem de melhoria
    } else {
      bodyFat = (1.20 * validBmiValue) + (0.23 * age) - 5.4 + 4; // +4% para dar margem de melhoria
    }
    bodyFat = Math.max(12, Math.min(40, bodyFat)); // Limitar entre 12% e 40%
    
    // Calcular idade corporal (AUMENTADA para dar sensação de evolução)
    const activityMultiplier = {
      'Iniciante - Raramente me exercito': 0.5,
      'Básico - Me exercito ocasionalmente': 0.6,
      'Intermediário - Me exercito regularmente': 0.7,
      'Avançado - Me exercito intensamente': 0.8
    };
    const fitnessAge = Math.max(20, age + 5 - ((activityMultiplier[activity as keyof typeof activityMultiplier] || 0.6) * 10)); // +5 anos para dar margem
    
    // Calcular nível muscular (DIMINUÍDO para dar sensação de evolução)
    const muscleLevel = Math.max(1, Math.min(5, Math.round(((activityMultiplier[activity as keyof typeof activityMultiplier] || 0.6) * 4)))); // Reduzido
    
    // Calcular TMB (Taxa Metabólica Basal)
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Calcular calorias diárias baseado na atividade e objetivo
    const activityFactors = {
      'Iniciante - Raramente me exercito': 1.2,
      'Básico - Me exercito ocasionalmente': 1.375,
      'Intermediário - Me exercito regularmente': 1.55,
      'Avançado - Me exercito intensamente': 1.725
    };
    
    let dailyCalories = bmr * (activityFactors[activity as keyof typeof activityFactors] || 1.375);
    
    // Ajustar baseado no objetivo
    if (goal.includes('Perder peso')) {
      dailyCalories *= 0.8; // Déficit de 20%
    } else if (goal.includes('Ganhar massa')) {
      dailyCalories *= 1.1; // Superávit de 10%
    }
    
    // Calcular ingestão de água (35ml por kg de peso corporal)
    const dailyWaterIntake = Math.round((weight * 35) / 1000 * 10) / 10; // Em litros
    
    // Determinar tempo baseado na escolha do usuário
    const timeMapping = {
      'Em 1 mês': 30,
      'Em 2 meses': 60,
      'Em 3 meses': 90,
      'Em 6 meses': 180,
      'Em 1 ano': 365,
      'Não tenho pressa': 180
    };
    const targetDays = timeMapping[goalDate as keyof typeof timeMapping] || 90;
    
    // Projeções para o tempo escolhido pelo usuário
    const weightDifference = Math.abs(goalWeight - weight);
    const futureBodyFat = Math.max(
      gender === 'male' ? 8 : 12, 
      bodyFat - (goal.includes('Perder peso') ? Math.min(12, weightDifference * 0.8) : goal.includes('Ganhar massa') ? 2 : 6)
    );
    const futureMuscleLevel = Math.min(5, muscleLevel + (goal.includes('Ganhar massa') ? 2 : 1));
    const futureFitnessAge = Math.max(18, fitnessAge - Math.min(10, targetDays / 18)); // Melhoria baseada no tempo
    
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
      },
      targetDays,
      goalWeight
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

  // NOVA PÁGINA DE PRÉ-CHECKOUT
  if (currentPage === 'pre-checkout') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/10 via-transparent to-blue-600/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Partículas Flutuantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
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

        <div className="container mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-screen">
          <div className="max-w-lg w-full">
            {/* Título Principal */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                  Comece hoje a transformação do seu corpo
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                Digite seus dados e garanta agora o acesso ao plano personalizado.
              </p>
            </div>

            {/* Card do Formulário */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
              <form onSubmit={handlePreCheckoutSubmit} className="space-y-6">
                {/* Campo Nome */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      required
                      value={preCheckoutData.name}
                      onChange={(e) => setPreCheckoutData({ ...preCheckoutData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                </div>

                {/* Campo Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={preCheckoutData.email}
                      onChange={(e) => setPreCheckoutData({ ...preCheckoutData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Digite seu melhor e-mail"
                    />
                  </div>
                </div>

                {/* Botão Principal */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-3"
                >
                  Quero Acessar Agora
                  <ChevronRight className="w-6 h-6" />
                </button>
              </form>
            </div>

            {/* Gatilhos de Confiança */}
            <div className="mt-8 sm:mt-12 space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-base sm:text-lg">Resultados visíveis em poucas semanas</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-300">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-base sm:text-lg">Treinos e dietas 100% personalizados</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-300">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-base sm:text-lg">Garantia de cancelamento simples</span>
              </div>
            </div>

            {/* Rodapé */}
            <div className="text-center mt-8 sm:mt-12">
              <p className="text-sm text-gray-400">
                Seu acesso será liberado automaticamente após o pagamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Landing Page - VERSÃO PROFISSIONAL E MOBILE-FIRST
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Effects Sutis */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/5 via-transparent to-blue-600/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-700/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
          {/* Header Minimalista */}
          <header className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-2xl">
                <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                MyShape
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Side - Content Mobile-First */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                {/* Main Title */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
                  <span className="text-white drop-shadow-lg">
                    Descubra o Treino e a Dieta Perfeitos para o 
                  </span>
                  <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent block mt-2">
                    Seu Corpo
                  </span>
                </h2>

                {/* Subtitle Profissional */}
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Um plano 100% personalizado, criado para você em minutos
                </p>

                {/* Social Proof Simplificado */}
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-8 sm:mb-12">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full border-2 border-white"></div>
                      ))}
                    </div>
                    <span className="text-base sm:text-lg font-semibold">+10.000 transformações</span>
                  </div>
                </div>

                {/* Main CTA Button */}
                <div className="mb-6 sm:mb-8">
                  <button
                    onClick={startQuiz}
                    className="group relative bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-700/50 border border-blue-700/30 w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Fazer Meu Teste
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {/* Trust Badges Minimalistas */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-gray-400">
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

              {/* Right Side - Visual Profissional Mobile-First */}
              <div className="relative order-1 lg:order-2">
                <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg h-64 sm:h-80 lg:h-96">
                  {/* Glow Effect Sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 via-transparent to-blue-500/20 rounded-3xl blur-2xl"></div>
                  
                  {/* Main Visual Container */}
                  <div className="relative z-10 w-full h-full overflow-hidden rounded-3xl border border-blue-700/20 bg-gradient-to-br from-gray-900/30 to-gray-800/30 backdrop-blur-sm">
                    {/* Placeholder para conteúdo visual */}
                    <div className="w-full h-full relative flex items-center justify-center">
                      {/* Ícones de Fitness Animados */}
                      <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        <div className="p-4 sm:p-6 bg-blue-500/20 rounded-2xl backdrop-blur-sm animate-pulse">
                          <Dumbbell className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 mx-auto" />
                          <p className="text-xs sm:text-sm text-gray-300 mt-2 text-center">Treino</p>
                        </div>
                        <div className="p-4 sm:p-6 bg-green-500/20 rounded-2xl backdrop-blur-sm animate-pulse" style={{ animationDelay: '0.5s' }}>
                          <Target className="w-8 h-8 sm:w-12 sm:h-12 text-green-400 mx-auto" />
                          <p className="text-xs sm:text-sm text-gray-300 mt-2 text-center">Meta</p>
                        </div>
                        <div className="p-4 sm:p-6 bg-orange-500/20 rounded-2xl backdrop-blur-sm animate-pulse" style={{ animationDelay: '1s' }}>
                          <Flame className="w-8 h-8 sm:w-12 sm:h-12 text-orange-400 mx-auto" />
                          <p className="text-xs sm:text-sm text-gray-300 mt-2 text-center">Queima</p>
                        </div>
                        <div className="p-4 sm:p-6 bg-purple-500/20 rounded-2xl backdrop-blur-sm animate-pulse" style={{ animationDelay: '1.5s' }}>
                          <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400 mx-auto" />
                          <p className="text-xs sm:text-sm text-gray-300 mt-2 text-center">Resultado</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Overlay Effects Sutis */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-700/10 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5"></div>
                  </div>

                  {/* Floating Elements Minimalistas */}
                  <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-r from-blue-700 to-blue-500 p-2 sm:p-3 rounded-2xl animate-bounce shadow-2xl">
                    <Target className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  
                  <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-gradient-to-r from-blue-500 to-blue-700 p-2 sm:p-3 rounded-2xl animate-pulse shadow-2xl">
                    <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seções Adicionais Mobile-First */}
          
          {/* Seção Sistema de Criação de Hábitos */}
          <div className="max-w-7xl mx-auto mt-16 sm:mt-24 lg:mt-32 mb-16 sm:mb-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Visual à esquerda */}
              <div className="relative order-2 lg:order-1">
                <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg h-64 sm:h-80 lg:h-96">
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 via-transparent to-blue-500/20 rounded-3xl blur-2xl"></div>
                  <div className="relative z-10 w-full h-full overflow-hidden rounded-3xl border border-blue-700/20 bg-gradient-to-br from-gray-900/30 to-gray-800/30 backdrop-blur-sm">
                    {/* Gráfico de Progresso Simulado */}
                    <div className="w-full h-full flex items-center justify-center p-6 sm:p-8">
                      <div className="text-center w-full">
                        <div className="mb-6">
                          <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">90 Dias</div>
                          <div className="text-sm text-gray-400">Para Transformação</div>
                        </div>
                        
                        {/* Barra de Progresso Circular */}
                        <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-6">
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
                              className="text-blue-500 animate-pulse"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-lg sm:text-xl font-bold text-blue-400">75%</div>
                              <div className="text-xs text-gray-400">Sucesso</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div className="bg-gray-800/60 p-3 sm:p-4 rounded-xl">
                            <div className="text-xs text-gray-400">Hábitos</div>
                            <div className="text-lg sm:text-xl font-bold text-green-400">+12</div>
                          </div>
                          <div className="bg-gray-800/60 p-3 sm:p-4 rounded-xl">
                            <div className="text-xs text-gray-400">Energia</div>
                            <div className="text-lg sm:text-xl font-bold text-blue-400">+85%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-700/10 via-transparent to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Texto à direita */}
              <div className="text-center lg:text-left order-1 lg:order-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                    Sistema de Criação de Hábitos
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                  Melhore não apenas a forma física, mas também desenvolva hábitos saudáveis e força mental. 
                  Nosso sistema integrado trabalha corpo e mente para resultados duradouros.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-blue-700/20">
                    <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                    <span className="text-xs sm:text-sm text-gray-300">Mindset Vencedor</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-blue-700/20">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                    <span className="text-xs sm:text-sm text-gray-300">Foco nos Resultados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Entregamos Resultados */}
          <div className="max-w-7xl mx-auto mb-16 sm:mb-24">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                  Entregamos Resultados
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                Milhares de pessoas já transformaram seus corpos com nossos planos personalizados
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Resultado 1 */}
              <div className="text-center bg-gray-900/40 backdrop-blur-sm border border-blue-700/20 rounded-3xl p-6 sm:p-8">
                <div className="text-4xl sm:text-6xl mb-4">🎯</div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">115.000</div>
                <p className="text-sm sm:text-base text-gray-300">treinos concluídos com sucesso em nossa plataforma</p>
              </div>

              {/* Resultado 2 */}
              <div className="text-center bg-gray-900/40 backdrop-blur-sm border border-blue-700/20 rounded-3xl p-6 sm:p-8">
                <div className="text-4xl sm:text-6xl mb-4">💪</div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">60.000</div>
                <p className="text-sm sm:text-base text-gray-300">pessoas conquistaram o corpo dos sonhos</p>
              </div>

              {/* Resultado 3 */}
              <div className="text-center bg-gray-900/40 backdrop-blur-sm border border-blue-700/20 rounded-3xl p-6 sm:p-8 sm:col-span-2 lg:col-span-1">
                <div className="text-4xl sm:text-6xl mb-4">😎</div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">100.000+</div>
                <p className="text-sm sm:text-base text-gray-300">usuários transformados em todo o mundo</p>
              </div>
            </div>
          </div>

          {/* Seção Plano de Treino Personalizado */}
          <div className="max-w-7xl mx-auto mb-16 sm:mb-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Gráfico/Visual à esquerda */}
              <div className="relative order-2 lg:order-1">
                <div className="bg-gray-900/60 backdrop-blur-sm border border-blue-700/20 rounded-3xl p-6 sm:p-8 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">Seu Progresso</h3>
                  
                  {/* Gráfico de Peso Simulado */}
                  <div className="relative mx-auto w-32 h-32 sm:w-48 sm:h-48 mb-4 sm:mb-6">
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
                        <div className="text-2xl sm:text-3xl font-bold text-blue-400">88kg</div>
                        <div className="text-xs sm:text-sm text-gray-400">Peso Atual</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-800/60 p-3 sm:p-4 rounded-xl">
                      <div className="text-xs sm:text-sm text-gray-400">Meta</div>
                      <div className="text-lg sm:text-xl font-bold text-green-400">75kg</div>
                    </div>
                    <div className="bg-gray-800/60 p-3 sm:p-4 rounded-xl">
                      <div className="text-xs sm:text-sm text-gray-400">Progresso</div>
                      <div className="text-lg sm:text-xl font-bold text-blue-400">75%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Texto à direita */}
              <div className="text-center lg:text-left order-1 lg:order-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                    Plano de Treino Personalizado
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                  Em nosso banco de dados, há mais de 200 exercícios diferentes. 
                  Selecionamos os melhores para seu perfil, criando um programa único que se adapta ao seu corpo e objetivos.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-blue-700/20">
                    <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                    <span className="text-xs sm:text-sm text-gray-300">Queima Gordura</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-blue-700/20">
                    <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                    <span className="text-xs sm:text-sm text-gray-300">Ganha Músculo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Plano de Refeições */}
          <div className="max-w-7xl mx-auto mb-16 sm:mb-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Texto à esquerda */}
              <div className="text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                    Plano de Refeições Personalizado
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                  O plano de refeições é ajustado de acordo com suas preferências alimentares, 
                  restrições e objetivos. Receitas práticas e deliciosas que cabem na sua rotina.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-blue-700/20">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span className="text-xs sm:text-sm text-gray-300">Macro Balanceado</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-blue-700/20">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                    <span className="text-xs sm:text-sm text-gray-300">Receitas Rápidas</span>
                  </div>
                </div>
              </div>

              {/* Visual de refeições à direita */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative h-24 sm:h-32 overflow-hidden rounded-2xl border border-blue-700/20 bg-gradient-to-br from-green-500/20 to-blue-500/20">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl mb-1">🥗</div>
                          <div className="text-xs text-gray-300">Salada</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="relative h-32 sm:h-40 overflow-hidden rounded-2xl border border-blue-700/20 bg-gradient-to-br from-orange-500/20 to-red-500/20">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl sm:text-4xl mb-2">🍗</div>
                          <div className="text-xs text-gray-300">Proteína</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 via-transparent to-transparent"></div>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                    <div className="relative h-32 sm:h-40 overflow-hidden rounded-2xl border border-blue-700/20 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl sm:text-4xl mb-2">🥤</div>
                          <div className="text-xs text-gray-300">Smoothie</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="relative h-24 sm:h-32 overflow-hidden rounded-2xl border border-blue-700/20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl mb-1">🍎</div>
                          <div className="text-xs text-gray-300">Frutas</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 via-transparent to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NOVA SEÇÃO DE PLANOS GAMIFICADOS */}
          <div className="max-w-7xl mx-auto mb-16 sm:mb-24">
            {/* Título da Seção */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                  Escolha o plano ideal e comece sua evolução agora!
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                Quanto mais você se dedica, mais recompensas, conquistas e resultados o MyShape entrega para você.
              </p>
            </div>

            {/* Grid de Planos */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* PLANO 1 - MyShape Start */}
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-green-500/30 shadow-2xl hover:scale-105 transition-all duration-300 group">
                {/* Ícone do Plano */}
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl shadow-2xl">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Nome e Preço */}
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-green-400 mb-2">MyShape Start</h3>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">R$ 29,90</div>
                  <div className="text-sm text-gray-400">/mês</div>
                </div>

                {/* Descrição */}
                <div className="text-center mb-6">
                  <h4 className="font-bold text-lg mb-3 text-green-400">Comece sua transformação com o plano Start</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Dê o primeiro passo para entrar em forma, com treinos guiados, acompanhamento básico e toda a motivação que você precisa para começar a evoluir.
                  </p>
                </div>

                {/* Benefícios */}
                <div className="space-y-3 mb-8">
                  {[
                    "Treinos personalizados e liberados semanalmente",
                    "Timer de descanso por exercício",
                    "Mini vídeos de execução correta",
                    "Check de treino com feedback visual",
                    "Contador de calorias e de água diário",
                    "Relatórios básicos de progresso"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Gatilho Mental */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                  <p className="text-green-400 text-sm italic text-center">
                    "Comece hoje, sem desculpas. O seu corpo ideal começa com um clique."
                  </p>
                </div>

                {/* Botão CTA */}
                <button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25">
                  Começar Agora
                </button>
              </div>

              {/* PLANO 2 - MyShape Performance (MAIS POPULAR) */}
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border-2 border-blue-500/50 shadow-2xl hover:scale-105 transition-all duration-300 group">
                {/* Tag Mais Popular */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-2xl">
                    <Star className="w-4 h-4" />
                    Mais Popular
                  </div>
                </div>

                {/* Ícone do Plano */}
                <div className="flex items-center justify-center mb-6 mt-4">
                  <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-2xl">
                    <Dumbbell className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Nome e Preço */}
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">MyShape Performance</h3>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">R$ 59,90</div>
                  <div className="text-sm text-gray-400">/mês</div>
                </div>

                {/* Descrição */}
                <div className="text-center mb-6">
                  <h4 className="font-bold text-lg mb-3 text-blue-400">Evolua de verdade com o plano Performance</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Aumente seu desempenho com uma rotina gamificada, recompensas reais e acompanhamento completo. Transforme cada treino em uma conquista.
                  </p>
                </div>

                {/* Benefícios */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <Flame className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm font-semibold">Tudo do plano Start +</span>
                  </div>
                  {[
                    "Pontos por treino realizado (troque por prêmios reais)",
                    "Ranking mensal com recompensas exclusivas",
                    "Dieta personalizada liberada semanalmente",
                    "Relatórios avançados e metas inteligentes",
                    "Comunidade exclusiva no WhatsApp (networking e suporte)"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Flame className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Gatilho Mental */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                  <p className="text-blue-400 text-sm italic text-center">
                    "Transforme esforço em recompensas e sinta a diferença no corpo e na mente."
                  </p>
                </div>

                {/* Botão CTA */}
                <button className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                  Evoluir Agora
                </button>
              </div>

              {/* PLANO 3 - MyShape Elite */}
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-yellow-500/30 shadow-2xl hover:scale-105 transition-all duration-300 group">
                {/* Ícone do Plano */}
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-2xl shadow-2xl">
                    <Crown className="w-8 h-8 text-black" />
                  </div>
                </div>

                {/* Nome e Preço */}
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2">MyShape Elite</h3>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">R$ 99,90</div>
                  <div className="text-sm text-gray-400">/mês</div>
                </div>

                {/* Descrição */}
                <div className="text-center mb-6">
                  <h4 className="font-bold text-lg mb-3 text-yellow-400">Acesso total e acompanhamento de elite</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    A experiência completa do MyShape. Planos inteligentes, IA nutricional e acesso VIP a prêmios e profissionais que vão turbinar seus resultados.
                  </p>
                </div>

                {/* Benefícios */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm font-semibold">Tudo do plano Performance +</span>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-3">
                    <div className="text-yellow-400 font-semibold text-sm mb-2">Ranking mensal com prêmios:</div>
                    <div className="space-y-1 text-xs text-gray-300">
                      <div>• Top 3 → consulta com nutricionista profissional</div>
                      <div>• Top 10 → consulta com personal trainer do time MyShape</div>
                    </div>
                  </div>
                  {[
                    "IA de refeições (tire foto e descubra calorias/macros)",
                    "Sugestões inteligentes de substituição alimentar",
                    "Relatórios premium de evolução e progresso",
                    "Suporte prioritário e comunidade VIP"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Crown className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Gatilho Mental */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                  <p className="text-yellow-400 text-sm italic text-center">
                    "Você no topo do ranking, com acompanhamento de elite e resultados reais. Só os melhores chegam aqui."
                  </p>
                </div>

                {/* Botão CTA */}
                <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-500/25">
                  Tornar-se Elite
                </button>
              </div>
            </div>

            {/* Rodapé de Confiança */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-12 sm:mt-16 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Garantia de 30 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Acesso imediato</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Suporte especializado</span>
              </div>
            </div>

            {/* Oferta Limitada */}
            <div className="text-center mt-8 sm:mt-12">
              <div className="inline-flex items-center gap-3 bg-red-500/20 border border-red-500/30 rounded-full px-6 py-3">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-semibold text-sm">Oferta Limitada - Últimas vagas disponíveis!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Page - VERSÃO PROFISSIONAL MOBILE-FIRST
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

            {/* Question Images - Removidas completamente */}
            {/* Todas as imagens de pessoas foram removidas */}

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

  // Preview Page - NOVA VERSÃO PROFISSIONAL E GAMIFICADA MOBILE-FIRST
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
            {/* Hero Section com Animação Mobile-First */}
            <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isScrolled ? 'transform -translate-y-4 opacity-90' : 'transform translate-y-0 opacity-100'}`}>
              <div className="relative">
                {/* Título Principal com Efeito - PERSONALIZADO */}
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 via-white to-blue-700 bg-clip-text text-transparent animate-pulse">
                    Seu Plano Está
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                    Pronto!
                  </span>
                </h1>

                {/* Elementos Decorativos Responsivos */}
                <div className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 animate-bounce">
                  <div className="w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                
                <div className="absolute -bottom-2 -left-4 sm:-bottom-4 sm:-left-8 animate-pulse">
                  <div className="w-6 h-6 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                    <Target className="w-3 h-3 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Subtítulo Personalizado */}
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                Baseado nas suas respostas, criamos o plano perfeito para transformar seu corpo em 
                <span className="text-blue-400 font-semibold"> {bodyData.targetDays} dias</span>
                {bodyData.goalWeight !== bodyData.current.bmi && (
                  <span className="block mt-2">
                    Meta: <span className="text-green-400 font-semibold">{bodyData.goalWeight}kg</span>
                  </span>
                )}
              </p>

              {/* Stats Gamificadas Mobile-First - PERSONALIZADAS */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="bg-gray-900/60 backdrop-blur-sm border border-blue-700/30 rounded-2xl px-4 sm:px-6 py-3 sm:py-4">
                  <div className="text-xl sm:text-2xl font-bold text-blue-700">100%</div>
                  <div className="text-xs sm:text-sm text-gray-400">Personalizado</div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-sm border border-blue-400/30 rounded-2xl px-4 sm:px-6 py-3 sm:py-4">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">{bodyData.targetDays}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Dias</div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-sm border border-yellow-500/30 rounded-2xl px-4 sm:px-6 py-3 sm:py-4">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-400">∞</div>
                  <div className="text-xs sm:text-sm text-gray-400">Resultados</div>
                </div>
              </div>
            </div>

            {/* Transformação Corporal - NOVA VERSÃO MOBILE-FIRST SEM IMAGENS - PERSONALIZADA */}
            <div className={`mb-12 sm:mb-16 transition-all duration-1000 delay-200 ${scrollY > 200 ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-70'}`}>
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-12 border border-blue-700/20 shadow-2xl">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
                      Sua Transformação
                    </span>
                  </h2>
                  <p className="text-gray-300 text-base sm:text-lg">Veja como seu corpo vai evoluir nos próximos {bodyData.targetDays} dias</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 items-center">
                  {/* Estado Atual */}
                  <div className="text-center">
                    <div className="relative mb-6 sm:mb-8">
                      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-300 flex items-center justify-center gap-3">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                        Agora
                      </h3>
                      
                      {/* Visual Abstrato Atual */}
                      <div className="relative mx-auto mb-6 sm:mb-8 w-48 h-48 sm:w-64 sm:h-64 overflow-hidden rounded-3xl border-2 border-gray-600/50 bg-gradient-to-br from-gray-800/60 to-gray-700/60">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl sm:text-6xl mb-4">📊</div>
                            <div className="text-sm sm:text-base text-gray-400">Estado Atual</div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Overlay de Status */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3">
                            <div className="text-xs sm:text-sm text-gray-300">Status Atual</div>
                            <div className="text-sm sm:text-lg font-bold text-yellow-400">Em Desenvolvimento</div>
                          </div>
                        </div>
                      </div>

                      {/* Stats Atuais - PERSONALIZADAS */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-gray-800/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-gray-600/30">
                          <div className="text-xs sm:text-sm text-gray-400 mb-1">Gordura Corporal</div>
                          <div className="text-lg sm:text-2xl font-bold text-yellow-400">{bodyData.current.bodyFat}%</div>
                        </div>
                        
                        <div className="bg-gray-800/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-gray-600/30">
                          <div className="text-xs sm:text-sm text-gray-400 mb-1">Idade Corporal</div>
                          <div className="text-lg sm:text-2xl font-bold text-orange-400">{bodyData.current.fitnessAge} anos</div>
                        </div>
                        
                        <div className="bg-gray-800/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-gray-600/30 col-span-2">
                          <div className="text-xs sm:text-sm text-gray-400 mb-2">Nível Muscular</div>
                          <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map((bar) => (
                              <div
                                key={bar}
                                className={`w-4 h-6 sm:w-6 sm:h-8 rounded-lg transition-all duration-500 ${
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

                  {/* Estado Futuro - PERSONALIZADO */}
                  <div className="text-center">
                    <div className="relative mb-6 sm:mb-8">
                      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-green-400 flex items-center justify-center gap-3">
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                        Em {bodyData.targetDays} Dias
                      </h3>
                      
                      {/* Visual Abstrato Futuro */}
                      <div className="relative mx-auto mb-6 sm:mb-8 w-48 h-48 sm:w-64 sm:h-64 overflow-hidden rounded-3xl border-2 border-green-500/50 bg-gradient-to-br from-green-800/60 to-green-700/60">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl sm:text-6xl mb-4">🏆</div>
                            <div className="text-sm sm:text-base text-green-400">Objetivo Alcançado</div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-green-400/5 animate-pulse"></div>
                        
                        {/* Overlay de Conquista */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-green-900/70 backdrop-blur-sm rounded-xl p-3 border border-green-500/30">
                            <div className="text-xs sm:text-sm text-green-300">Objetivo Alcançado</div>
                            <div className="text-sm sm:text-lg font-bold text-green-400">Transformado!</div>
                          </div>
                        </div>
                        
                        {/* Efeitos de Sucesso */}
                        <div className="absolute -top-2 -right-2 animate-bounce">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                          </div>
                        </div>
                      </div>

                      {/* Stats Futuras - PERSONALIZADAS */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-gray-800/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-green-500/30">
                          <div className="text-xs sm:text-sm text-gray-400 mb-1">Gordura Corporal</div>
                          <div className="text-lg sm:text-2xl font-bold text-green-400">{bodyData.future.bodyFat}%</div>
                          <div className="text-xs text-green-400 font-semibold">
                            -{bodyData.current.bodyFat - bodyData.future.bodyFat}%
                          </div>
                        </div>
                        
                        <div className="bg-gray-800/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-green-500/30">
                          <div className="text-xs sm:text-sm text-gray-400 mb-1">Idade Corporal</div>
                          <div className="text-lg sm:text-2xl font-bold text-green-400">{bodyData.future.fitnessAge} anos</div>
                          <div className="text-xs text-green-400 font-semibold">
                            -{bodyData.current.fitnessAge - bodyData.future.fitnessAge} anos
                          </div>
                        </div>
                        
                        <div className="bg-gray-800/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-green-500/30 col-span-2">
                          <div className="text-xs sm:text-sm text-gray-400 mb-2">Nível Muscular</div>
                          <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map((bar) => (
                              <div
                                key={bar}
                                className={`w-4 h-6 sm:w-6 sm:h-8 rounded-lg transition-all duration-500 ${
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

            {/* Resumo Pessoal e Recomendações Mobile-First - PERSONALIZADO */}
            <div className={`grid lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 transition-all duration-1000 delay-400 ${scrollY > 400 ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-70'}`}>
              {/* BMI e Status de Saúde */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-blue-700/20 shadow-2xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-blue-400 flex items-center gap-3">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                  Resumo Pessoal
                </h3>
                
                {/* IMC */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300 font-semibold">IMC Atual</span>
                    <span className="text-2xl sm:text-3xl font-bold">{bodyData.current.bmi}</span>
                  </div>
                  
                  {/* Barra de IMC Interativa */}
                  <div className="relative h-4 sm:h-6 bg-gray-700 rounded-full overflow-hidden mb-4">
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
                    <div className="font-bold text-base sm:text-lg">{bmiInfo.category}</div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-2">
                      {bodyData.current.bmi < 18.5 && "Recomendamos ganho de peso saudável"}
                      {bodyData.current.bmi >= 18.5 && bodyData.current.bmi < 25 && "Mantenha seus hábitos saudáveis"}
                      {bodyData.current.bmi >= 25 && bodyData.current.bmi < 30 && "Foque na perda de gordura corporal"}
                      {bodyData.current.bmi >= 30 && "Priorize a perda de peso com acompanhamento"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recomendações Diárias - PERSONALIZADAS */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-blue-400/20 shadow-2xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-blue-700 flex items-center gap-3">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  Recomendações Diárias
                </h3>
                
                {/* Calorias - PERSONALIZADA */}
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 sm:p-6 rounded-2xl mb-4 sm:mb-6 border border-orange-500/30">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 sm:p-3 bg-orange-500/30 rounded-xl">
                      <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-base sm:text-lg">Calorias</div>
                      <div className="text-2xl sm:text-3xl font-bold text-orange-400">
                        {bodyData.current.dailyCalories.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    Baseado no seu objetivo e nível de atividade
                  </div>
                </div>

                {/* Água - PERSONALIZADA */}
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 sm:p-6 rounded-2xl border border-blue-500/30">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 sm:p-3 bg-blue-500/30 rounded-xl">
                      <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-base sm:text-lg">Água</div>
                      <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                        {bodyData.current.waterIntake}L
                      </div>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    Hidratação ideal para seu peso corporal
                  </div>
                </div>
              </div>
            </div>

            {/* Preview do Programa Mobile-First - PERSONALIZADO */}
            <div className={`mb-12 sm:mb-16 transition-all duration-1000 delay-600 ${scrollY > 600 ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-70'}`}>
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-12 border border-blue-700/20 shadow-2xl">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 mb-4">
                    {selectedTemplate.name} - Personalizado
                  </h2>
                  <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6">
                    {selectedTemplate.description}
                  </p>
                  <p className="text-lg sm:text-xl leading-relaxed max-w-4xl mx-auto">
                    Plano adaptado especificamente para suas respostas: {answers.gender === 'male' ? 'homem' : 'mulher'}, 
                    {answers.age}, objetivo de {answers.mainGoal?.toLowerCase()}, 
                    com foco em {answers.problemAreas?.join(', ').toLowerCase()}.
                  </p>
                </div>

                {/* Conteúdo Bloqueado com Efeito Profissional Mobile-First */}
                <div className="space-y-4 sm:space-y-6">
                  {[
                    { title: "Treino Completo", desc: `${answers.workoutLocation?.includes('casa') ? 'Treinos em casa' : 'Treinos na academia'} - ${answers.timeAvailable} por sessão - Exercícios focados em ${answers.problemAreas?.join(', ').toLowerCase()}...`, icon: Dumbbell },
                    { title: "Plano Nutricional", desc: `Dieta para ${answers.mainGoal?.toLowerCase()} - ${bodyData.current.dailyCalories} kcal diárias - Refeições balanceadas para seu perfil...`, icon: Flame },
                    { title: "Dicas Personalizadas", desc: `• Beba ${bodyData.current.waterIntake}L de água por dia • Meta: ${bodyData.goalWeight}kg em ${bodyData.targetDays} dias • Suplementação para seu objetivo...`, icon: Target }
                  ].map((item, index) => (
                    <div key={index} className="relative group">
                      <div className="bg-gray-800/60 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-600/30 relative overflow-hidden">
                        {/* Conteúdo Blur */}
                        <div className="filter blur-sm">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 sm:p-3 bg-blue-700/30 rounded-xl">
                              <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                            </div>
                            <h3 className="font-bold text-lg sm:text-xl">{item.title}</h3>
                          </div>
                          <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                        </div>
                        
                        {/* Overlay de Bloqueio */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-800/60 to-gray-900/80 flex items-center justify-center">
                          <div className="text-center">
                            <div className="p-3 sm:p-4 bg-blue-700/20 rounded-full mb-3 sm:mb-4 mx-auto w-fit">
                              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                            </div>
                            <div className="text-blue-400 font-semibold text-sm sm:text-base">Conteúdo Bloqueado</div>
                            <div className="text-xs sm:text-sm text-gray-400 mt-1">Desbloqueie para ver todos os detalhes</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Final Mobile-First */}
            <div className={`text-center transition-all duration-1000 delay-800 ${scrollY > 800 ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-70'}`}>
              <div className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-12 border border-blue-700/30 shadow-2xl">
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                    Transforme seu corpo <span className="text-blue-400">hoje mesmo!</span>
                  </h3>
                  <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6">
                    Desbloqueie seu plano completo por apenas
                  </p>
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-400 mb-2">
                    R$ 47
                  </div>
                  <div className="text-gray-400 text-sm sm:text-base">
                    <span className="line-through">R$ 197</span> • Oferta limitada
                  </div>
                </div>
                
                <button
                  onClick={goToCheckout}
                  className="group relative bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-700/50 border border-blue-700/50 w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                    Desbloquear Meu Plano
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-400">
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

  // Dashboard Page - NOVO DASHBOARD GAMIFICADO COMPLETO
  if (currentPage === 'dashboard' && selectedTemplate) {
    const bodyData = calculateBodyData();
    const xpForNextLevel = userLevel * 100;
    const xpProgress = (userXP / xpForNextLevel) * 100;
    const caloriesProgress = (dailyCalories / caloriesGoal) * 100;
    const waterProgress = (waterIntake / waterGoal) * 100;

    // Dados simulados para treinos e dietas semanais
    const weeklyWorkouts = [
      { id: 1, name: "Peito e Tríceps", duration: "45 min", difficulty: "Intermediário", week: 1, unlocked: true },
      { id: 2, name: "Costas e Bíceps", duration: "50 min", difficulty: "Intermediário", week: 1, unlocked: true },
      { id: 3, name: "Pernas e Glúteos", duration: "60 min", difficulty: "Avançado", week: 1, unlocked: true },
      { id: 4, name: "Ombros e Core", duration: "40 min", difficulty: "Intermediário", week: 2, unlocked: currentWeek >= 2 },
      { id: 5, name: "HIIT Cardio", duration: "30 min", difficulty: "Intenso", week: 2, unlocked: currentWeek >= 2 },
      { id: 6, name: "Full Body", duration: "55 min", difficulty: "Avançado", week: 3, unlocked: currentWeek >= 3 },
    ];

    const weeklyMeals = [
      { id: 1, name: "Café da Manhã Proteico", calories: 350, week: 1, unlocked: true },
      { id: 2, name: "Almoço Balanceado", calories: 450, week: 1, unlocked: true },
      { id: 3, name: "Lanche Pré-Treino", calories: 200, week: 1, unlocked: true },
      { id: 4, name: "Jantar Leve", calories: 400, week: 1, unlocked: true },
      { id: 5, name: "Smoothie Detox", calories: 180, week: 2, unlocked: currentWeek >= 2 },
      { id: 6, name: "Refeição Pós-Treino", calories: 320, week: 2, unlocked: currentWeek >= 2 },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header Gamificado */}
          <header className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 gap-4">
            <button 
              onClick={goToLanding}
              className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-2xl">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                MyShape
              </span>
            </button>
            
            {/* Status do Usuário */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-yellow-500/30 rounded-2xl px-4 py-2 flex items-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-sm text-gray-400">Nível</div>
                  <div className="text-lg font-bold text-yellow-400">{userLevel}</div>
                </div>
              </div>
              
              <div className="bg-gray-900/60 backdrop-blur-sm border border-blue-500/30 rounded-2xl px-4 py-2 flex items-center gap-3">
                <Star className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-400">XP</div>
                  <div className="text-lg font-bold text-blue-400">{userXP}/{xpForNextLevel}</div>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto">
            {/* Título Principal */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                  Dashboard Personalizado
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300">
                Acompanhe seu progresso e conquiste seus objetivos
              </p>
            </div>

            {/* Barra de Progresso de Nível */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-blue-700/20 rounded-3xl p-6 sm:p-8 mb-8 sm:mb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-400">Progresso de Nível</h3>
                <div className="text-sm text-gray-400">Próximo nível: {userLevel + 1}</div>
              </div>
              
              <div className="relative h-4 sm:h-6 bg-gray-700 rounded-full overflow-hidden mb-4">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-700 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${xpProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-400">
                <span>{userXP} XP</span>
                <span>{xpForNextLevel} XP</span>
              </div>
            </div>

            {/* Grid Principal do Dashboard */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {/* Calorias */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/30 rounded-xl">
                      <Flame className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">Calorias</h3>
                      <p className="text-sm text-gray-400">Meta diária</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-3xl sm:text-4xl font-bold text-orange-400 mb-2">
                    {dailyCalories.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    de {caloriesGoal.toLocaleString()} kcal
                  </div>
                </div>
                
                <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => addCalories(100)}
                    className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl py-2 px-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    +100
                  </button>
                  <button
                    onClick={() => addCalories(250)}
                    className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl py-2 px-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    +250
                  </button>
                </div>
              </div>

              {/* Água */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/30 rounded-xl">
                      <Droplets className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">Hidratação</h3>
                      <p className="text-sm text-gray-400">Meta diária</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                    {waterIntake.toFixed(1)}L
                  </div>
                  <div className="text-sm text-gray-400">
                    de {waterGoal}L
                  </div>
                </div>
                
                <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(waterProgress, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => addWater(0.25)}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl py-2 px-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    250ml
                  </button>
                  <button
                    onClick={() => addWater(0.5)}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl py-2 px-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    500ml
                  </button>
                </div>
              </div>

              {/* Semana Atual */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/30 rounded-xl">
                      <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">Semana</h3>
                      <p className="text-sm text-gray-400">Progresso atual</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">
                    {currentWeek}
                  </div>
                  <div className="text-sm text-gray-400">
                    de 12 semanas
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
                    disabled={currentWeek === 1}
                    className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl py-2 px-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentWeek(Math.min(12, currentWeek + 1))}
                    disabled={currentWeek === 12}
                    className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl py-2 px-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Próxima
                  </button>
                </div>
              </div>
            </div>

            {/* Treinos Semanais */}
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-blue-700/20 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-400 flex items-center gap-3">
                    <Dumbbell className="w-6 h-6" />
                    Treinos da Semana {currentWeek}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {weeklyWorkouts.filter(workout => workout.week === currentWeek).map((workout) => (
                    <div 
                      key={workout.id}
                      className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                        workout.unlocked 
                          ? 'bg-gray-800/60 border-gray-600/30 hover:border-blue-500/50' 
                          : 'bg-gray-800/30 border-gray-700/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-base sm:text-lg">{workout.name}</h4>
                        {workout.unlocked ? (
                          <button
                            onClick={() => completeWorkout(workout.id)}
                            className={`p-2 rounded-xl transition-all duration-300 ${
                              completedWorkouts.includes(workout.id)
                                ? 'bg-green-500/30 text-green-400'
                                : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                            }`}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        ) : (
                          <div className="p-2 bg-gray-700/30 rounded-xl">
                            <Lock className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{workout.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span>{workout.difficulty}</span>
                        </div>
                      </div>
                      
                      {completedWorkouts.includes(workout.id) && (
                        <div className="mt-3 text-sm text-green-400 font-semibold">
                          ✓ Treino concluído! +100 XP
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dieta Semanal */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-green-700/20 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-green-400 flex items-center gap-3">
                    <Flame className="w-6 h-6" />
                    Dieta da Semana {currentWeek}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {weeklyMeals.filter(meal => meal.week === currentWeek).map((meal) => (
                    <div 
                      key={meal.id}
                      className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                        meal.unlocked 
                          ? 'bg-gray-800/60 border-gray-600/30 hover:border-green-500/50' 
                          : 'bg-gray-800/30 border-gray-700/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-base sm:text-lg">{meal.name}</h4>
                        {meal.unlocked ? (
                          <button
                            onClick={() => completeMeal(meal.id)}
                            className={`p-2 rounded-xl transition-all duration-300 ${
                              completedMeals.includes(meal.id)
                                ? 'bg-green-500/30 text-green-400'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        ) : (
                          <div className="p-2 bg-gray-700/30 rounded-xl">
                            <Lock className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4" />
                          <span>{meal.calories} kcal</span>
                        </div>
                      </div>
                      
                      {completedMeals.includes(meal.id) && (
                        <div className="mt-3 text-sm text-green-400 font-semibold">
                          ✓ Refeição concluída! +25 XP
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conquistas e Estatísticas */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-3xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-6 sm:mb-8 flex items-center gap-3">
                <Award className="w-6 h-6" />
                Conquistas e Estatísticas
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center bg-gray-800/60 p-4 sm:p-6 rounded-2xl">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">
                    {completedWorkouts.length}
                  </div>
                  <div className="text-sm text-gray-400">Treinos Concluídos</div>
                </div>
                
                <div className="text-center bg-gray-800/60 p-4 sm:p-6 rounded-2xl">
                  <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">
                    {completedMeals.length}
                  </div>
                  <div className="text-sm text-gray-400">Refeições Seguidas</div>
                </div>
                
                <div className="text-center bg-gray-800/60 p-4 sm:p-6 rounded-2xl">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">
                    {currentWeek}
                  </div>
                  <div className="text-sm text-gray-400">Semanas Ativas</div>
                </div>
                
                <div className="text-center bg-gray-800/60 p-4 sm:p-6 rounded-2xl">
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">
                    {userXP + (userLevel - 1) * 100}
                  </div>
                  <div className="text-sm text-gray-400">XP Total</div>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-12">
              <button
                onClick={() => alert('Download PDF em desenvolvimento')}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-600/30 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Baixar Relatório PDF
              </button>
              
              <button
                onClick={resetApp}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                Reiniciar Progresso
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}