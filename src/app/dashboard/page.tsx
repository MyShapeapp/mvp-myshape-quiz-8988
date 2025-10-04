'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Trophy, 
  Target, 
  Droplets, 
  Utensils, 
  Dumbbell, 
  Flame, 
  Star, 
  CheckCircle, 
  Lock,
  TrendingUp,
  Award,
  Zap,
  Heart,
  Clock,
  Plus,
  Minus,
  Play,
  Pause,
  RotateCcw,
  Check
} from 'lucide-react'

export default function Dashboard() {
  const [currentDay, setCurrentDay] = useState(1)
  const [waterIntake, setWaterIntake] = useState(1200)
  const [caloriesConsumed, setCaloriesConsumed] = useState(850)
  const [userLevel, setUserLevel] = useState(3)
  const [userXP, setUserXP] = useState(750)
  const [streak, setStreak] = useState(7)
  const [activeWorkout, setActiveWorkout] = useState<number | null>(null)
  const [restTimer, setRestTimer] = useState(0)
  const [isRestActive, setIsRestActive] = useState(false)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])

  const dailyGoals = {
    water: 2500, // ml
    calories: 1800,
    workout: true,
    meals: 4
  }

  const achievements = [
    { id: 1, title: "Primeira Semana", description: "Complete 7 dias consecutivos", icon: Trophy, completed: true },
    { id: 2, title: "Hidratação Master", description: "Beba 2.5L de água por 5 dias", icon: Droplets, completed: true },
    { id: 3, title: "Queimador de Calorias", description: "Queime 500 calorias em um treino", icon: Flame, completed: false },
    { id: 4, title: "Disciplina Total", description: "Complete 30 dias consecutivos", icon: Award, completed: false }
  ]

  const weeklyMeals = [
    { day: 1, unlocked: true, meals: ["Aveia com frutas", "Salada de frango", "Salmão grelhado", "Iogurte natural"] },
    { day: 2, unlocked: true, meals: ["Smoothie verde", "Quinoa com legumes", "Peixe assado", "Castanhas"] },
    { day: 3, unlocked: true, meals: ["Ovos mexidos", "Wrap integral", "Frango grelhado", "Frutas vermelhas"] },
    { day: 4, unlocked: currentDay >= 4, meals: ["Panqueca fit", "Salada caesar", "Carne magra", "Chá verde"] },
    { day: 5, unlocked: currentDay >= 5, meals: ["Açaí natural", "Sopa de legumes", "Peixe no vapor", "Nozes"] },
    { day: 6, unlocked: currentDay >= 6, meals: ["Tapioca", "Risoto de quinoa", "Frango ao curry", "Iogurte"] },
    { day: 7, unlocked: currentDay >= 7, meals: ["Vitamina", "Salada completa", "Salmão teriyaki", "Frutas"] }
  ]

  const workoutExercises = [
    {
      id: 1,
      name: "Flexões",
      sets: "3x12",
      rest: 60,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      description: "Mantenha o corpo reto, desça até o peito quase tocar o chão"
    },
    {
      id: 2,
      name: "Agachamentos",
      sets: "3x15",
      rest: 90,
      image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400&h=300&fit=crop",
      description: "Desça como se fosse sentar, mantenha os joelhos alinhados"
    },
    {
      id: 3,
      name: "Prancha",
      sets: "3x30s",
      rest: 45,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      description: "Mantenha o corpo reto como uma tábua, contraindo o core"
    },
    {
      id: 4,
      name: "Burpees",
      sets: "3x8",
      rest: 120,
      image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop",
      description: "Movimento completo: agachamento, prancha, pulo"
    }
  ]

  const weeklyWorkouts = [
    { day: 1, unlocked: true, type: "Cardio HIIT", duration: "30 min", calories: 350 },
    { day: 2, unlocked: true, type: "Força - Superiores", duration: "45 min", calories: 280 },
    { day: 3, unlocked: true, type: "Yoga Flow", duration: "40 min", calories: 200 },
    { day: 4, unlocked: currentDay >= 4, type: "Cardio Intenso", duration: "35 min", calories: 400 },
    { day: 5, unlocked: currentDay >= 5, type: "Força - Inferiores", duration: "50 min", calories: 320 },
    { day: 6, unlocked: currentDay >= 6, type: "Pilates Core", duration: "30 min", calories: 180 },
    { day: 7, unlocked: currentDay >= 7, type: "Treino Funcional", duration: "60 min", calories: 450 }
  ]

  // Timer de descanso
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRestActive && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1)
      }, 1000)
    } else if (restTimer === 0 && isRestActive) {
      setIsRestActive(false)
    }
    return () => clearInterval(interval)
  }, [isRestActive, restTimer])

  const startRestTimer = (seconds: number) => {
    setRestTimer(seconds)
    setIsRestActive(true)
  }

  const toggleExerciseComplete = (exerciseId: number) => {
    setCompletedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    )
    
    // Ganhar XP por completar exercício
    if (!completedExercises.includes(exerciseId)) {
      setUserXP(prev => prev + 25)
    }
  }

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, dailyGoals.water))
  }

  const addCalories = (amount: number) => {
    setCaloriesConsumed(prev => Math.min(prev + amount, dailyGoals.calories + 500))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header com Stats do Usuário */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Olá, Maria! 👋</h1>
              <p className="text-blue-100">Dia {currentDay} da sua jornada de transformação</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Nível</span>
                </div>
                <div className="text-2xl font-bold">{userLevel}</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-orange-300" />
                  <span className="text-sm">XP</span>
                </div>
                <div className="text-2xl font-bold">{userXP}</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-red-300" />
                  <span className="text-sm">Sequência</span>
                </div>
                <div className="text-2xl font-bold">{streak}</div>
              </div>
            </div>
          </div>
          
          {/* Barra de Progresso XP */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso para Nível {userLevel + 1}</span>
              <span>{userXP}/1000 XP</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(userXP / 1000) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Timer de Descanso Ativo */}
        {isRestActive && (
          <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-2xl shadow-2xl animate-pulse">
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{formatTime(restTimer)}</div>
              <div className="text-sm">Tempo de descanso</div>
            </div>
          </div>
        )}

        {/* Treino Detalhado */}
        {activeWorkout && (
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Treino do Dia - {weeklyWorkouts[currentDay - 1]?.type}</h2>
              <button 
                onClick={() => setActiveWorkout(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>
            
            <div className="grid gap-6">
              {workoutExercises.map((exercise) => (
                <div key={exercise.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Imagem/GIF do Exercício */}
                    <div className="relative">
                      <img 
                        src={exercise.image} 
                        alt={exercise.name}
                        className="w-full h-64 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                          <Play className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Detalhes do Exercício */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-800">{exercise.name}</h3>
                        <button
                          onClick={() => toggleExerciseComplete(exercise.id)}
                          className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                            completedExercises.includes(exercise.id)
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-gray-200 text-gray-500 hover:bg-green-100'
                          }`}
                        >
                          <Check className="w-6 h-6" />
                        </button>
                      </div>
                      
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="bg-blue-100 px-3 py-1 rounded-full">
                            <span className="text-blue-800 font-semibold">{exercise.sets}</span>
                          </div>
                          <div className="bg-orange-100 px-3 py-1 rounded-full">
                            <span className="text-orange-800 font-semibold">{exercise.rest}s descanso</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{exercise.description}</p>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => startRestTimer(exercise.rest)}
                            disabled={isRestActive}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                              isRestActive 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
                            }`}
                          >
                            <Clock className="w-5 h-5 inline mr-2" />
                            Iniciar Descanso
                          </button>
                          
                          {completedExercises.includes(exercise.id) && (
                            <div className="flex items-center bg-green-100 px-4 py-2 rounded-xl">
                              <span className="text-green-800 font-semibold text-sm">+25 XP</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Progresso do Treino */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Progresso do Treino</h3>
                  <div className="text-3xl font-bold mb-2">
                    {completedExercises.length}/{workoutExercises.length}
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-4 mb-4">
                    <div 
                      className="bg-white h-4 rounded-full transition-all duration-500"
                      style={{ width: `${(completedExercises.length / workoutExercises.length) * 100}%` }}
                    ></div>
                  </div>
                  {completedExercises.length === workoutExercises.length && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                      <p className="font-semibold">Parabéns! Treino Completo!</p>
                      <p className="text-sm opacity-90">+100 XP Bônus</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metas Diárias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Água */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Droplets className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Água</h3>
                  <p className="text-sm text-gray-500">{waterIntake}ml / {dailyGoals.water}ml</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((waterIntake / dailyGoals.water) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => addWater(250)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                +250ml
              </button>
              <button 
                onClick={() => addWater(500)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                +500ml
              </button>
            </div>
          </div>

          {/* Calorias */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Calorias</h3>
                  <p className="text-sm text-gray-500">{caloriesConsumed} / {dailyGoals.calories}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((caloriesConsumed / dailyGoals.calories) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => addCalories(100)}
                className="flex-1 bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                +100
              </button>
              <button 
                onClick={() => addCalories(250)}
                className="flex-1 bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                +250
              </button>
            </div>
          </div>

          {/* Treino do Dia */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Dumbbell className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Treino Hoje</h3>
                <p className="text-sm text-gray-500">{weeklyWorkouts[currentDay - 1]?.type}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duração:</span>
                <span className="font-medium">{weeklyWorkouts[currentDay - 1]?.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Calorias:</span>
                <span className="font-medium">{weeklyWorkouts[currentDay - 1]?.calories} kcal</span>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveWorkout(1)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Iniciar Treino
            </button>
          </div>

          {/* Refeições do Dia */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Utensils className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Refeições</h3>
                <p className="text-sm text-gray-500">Plano personalizado</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {weeklyMeals[currentDay - 1]?.meals.slice(0, 2).map((meal, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">{meal}</span>
                </div>
              ))}
              <p className="text-xs text-gray-500">+{weeklyMeals[currentDay - 1]?.meals.length - 2} mais refeições</p>
            </div>
            
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Ver Cardápio
            </button>
          </div>
        </div>

        {/* Plano Semanal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dietas Semanais */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <Utensils className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Plano Alimentar Semanal</h2>
                <p className="text-gray-600">Desbloqueie novos cardápios a cada dia</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {weeklyMeals.map((dayPlan) => (
                <div 
                  key={dayPlan.day}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    dayPlan.unlocked 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        dayPlan.unlocked ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {dayPlan.day}
                      </div>
                      <span className="font-medium text-gray-800">Dia {dayPlan.day}</span>
                    </div>
                    
                    {dayPlan.unlocked ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  {dayPlan.unlocked ? (
                    <div className="grid grid-cols-2 gap-2">
                      {dayPlan.meals.map((meal, index) => (
                        <div key={index} className="text-sm text-gray-700 bg-white p-2 rounded-lg">
                          {meal}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Desbloqueie no dia {dayPlan.day}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Treinos Semanais */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Dumbbell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Plano de Treinos Semanal</h2>
                <p className="text-gray-600">Novos exercícios liberados diariamente</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {weeklyWorkouts.map((workout) => (
                <div 
                  key={workout.day}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    workout.unlocked 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        workout.unlocked ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {workout.day}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800 block">Dia {workout.day}</span>
                        <span className="text-sm text-gray-600">{workout.type}</span>
                      </div>
                    </div>
                    
                    {workout.unlocked ? (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  {workout.unlocked ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">⏱️ {workout.duration}</span>
                      <span className="text-gray-600">🔥 {workout.calories} kcal</span>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Desbloqueie no dia {workout.day}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conquistas */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Conquistas</h2>
              <p className="text-gray-600">Desbloqueie medalhas e ganhe XP extra</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon
              return (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    achievement.completed 
                      ? 'border-yellow-200 bg-yellow-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      achievement.completed ? 'bg-yellow-600' : 'bg-gray-400'
                    }`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{achievement.title}</h3>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                    {achievement.completed && (
                      <div className="mt-2">
                        <span className="inline-block bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                          +50 XP
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Estatísticas e Progresso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Peso Perdido</h3>
                <p className="text-2xl font-bold text-red-600">3.2 kg</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Meta: 8 kg em 60 dias</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Treinos Completos</h3>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Este mês</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Tempo Ativo</h3>
                <p className="text-2xl font-bold text-blue-600">8h 45m</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Esta semana</p>
          </div>
        </div>
      </div>
    </div>
  )
}