import { QuizQuestion, ProgramTemplate } from './types';

// Perguntas do quiz fitness baseadas no MadMuscles
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'gender',
    question: 'Qual é o seu sexo?',
    type: 'select',
    options: ['male', 'female']
  },
  {
    id: 'age',
    question: 'Qual é a sua idade?',
    type: 'select',
    options: [
      '18-25 anos',
      '26-35 anos', 
      '36-45 anos',
      '46-55 anos',
      '56+ anos'
    ],
    images: [
      'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/9e72b43f-7f25-496b-8285-fb4c4ec0ad49.png'
    ]
  },
  {
    id: 'bodyType',
    question: 'Escolha o seu tipo de corpo',
    type: 'select',
    options: [
      'Magro',
      'Médio', 
      'Pesado'
    ],
    images: [
      'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/b0c4ef27-bb81-45c0-853e-ad1be8a2bcf9.png'
    ]
  },
  {
    id: 'desiredBody',
    question: 'Escolha o corpo que você deseja',
    type: 'select',
    options: [
      'Corpo esbelto',
      'Corpo atlético',
      'Corpo musculoso'
    ],
    images: [
      'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/ffb9ea52-6381-4114-a657-3255b36fce38.png'
    ]
  },
  {
    id: 'problemAreas',
    question: 'Quais áreas você gostaria de melhorar?',
    type: 'multiselect',
    options: [
      'Barriga',
      'Braços',
      'Pernas',
      'Glúteos',
      'Peito',
      'Costas'
    ]
  },
  {
    id: 'fitnessLevel',
    question: 'Qual é o seu nível de condicionamento físico?',
    type: 'select',
    options: [
      'Iniciante - Raramente me exercito',
      'Básico - Me exercito ocasionalmente',
      'Intermediário - Me exercito regularmente',
      'Avançado - Me exercito intensamente'
    ]
  },
  {
    id: 'workoutLocation',
    question: 'Onde você prefere treinar?',
    type: 'select',
    options: [
      'Em casa',
      'Na academia',
      'Ao ar livre',
      'Tanto em casa quanto na academia'
    ]
  },
  {
    id: 'equipment',
    question: 'Que equipamentos você tem disponível?',
    type: 'multiselect',
    options: [
      'Nenhum equipamento',
      'Halteres',
      'Faixas elásticas',
      'Barra fixa',
      'Academia completa',
      'Esteira/bicicleta'
    ]
  },
  {
    id: 'timeAvailable',
    question: 'Quanto tempo você tem para treinar por dia?',
    type: 'select',
    options: [
      '15-30 minutos',
      '30-45 minutos',
      '45-60 minutos',
      'Mais de 1 hora'
    ]
  },
  {
    id: 'weeklyFrequency',
    question: 'Quantos dias por semana você pode treinar?',
    type: 'select',
    options: [
      '2-3 dias por semana',
      '4-5 dias por semana',
      '6-7 dias por semana'
    ]
  },
  {
    id: 'mainGoal',
    question: 'Qual é o seu principal objetivo?',
    type: 'select',
    options: [
      'Perder peso e queimar gordura',
      'Ganhar massa muscular',
      'Tonificar e definir músculos',
      'Melhorar condicionamento físico',
      'Manter forma atual'
    ]
  },
  {
    id: 'motivation',
    question: 'O que mais te motiva a se exercitar?',
    type: 'select',
    options: [
      'Melhorar aparência física',
      'Ter mais energia no dia a dia',
      'Melhorar saúde geral',
      'Reduzir estresse',
      'Aumentar autoestima'
    ]
  },
  {
    id: 'challenges',
    question: 'Qual é o seu maior desafio para se exercitar?',
    type: 'select',
    options: [
      'Falta de tempo',
      'Falta de motivação',
      'Não saber o que fazer',
      'Falta de energia',
      'Lesões ou limitações físicas'
    ]
  },
  {
    id: 'dietStyle',
    question: 'Como você descreveria sua alimentação atual?',
    type: 'select',
    options: [
      'Muito saudável',
      'Moderadamente saudável',
      'Precisa melhorar',
      'Não muito saudável'
    ]
  },
  {
    id: 'weight',
    question: 'Qual é o seu peso atual?',
    type: 'range',
    min: 40,
    max: 200,
    step: 1,
    unit: 'kg'
  },
  {
    id: 'height',
    question: 'Qual é a sua altura?',
    type: 'range',
    min: 140,
    max: 220,
    step: 1,
    unit: 'cm'
  }
];

// Templates de programa expandidos
export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  {
    id: 'female-beginner-weight-loss',
    name: 'Queima Gordura Feminino',
    description: 'Programa focado em perda de peso para mulheres iniciantes',
    tags: ['female', 'beginner', 'weight-loss', 'home'],
    summary: 'Treinos de 45min, 4x/semana, combinando cardio e musculação para acelerar o metabolismo.',
    fullProgram: {
      workouts: [
        {
          day: 'Segunda-feira - Corpo Todo',
          exercises: [
            { name: 'Agachamento', sets: 3, reps: '12-15', rest: '60s', instructions: 'Mantenha o core contraído e desça até 90°' },
            { name: 'Flexão (joelhos)', sets: 3, reps: '8-12', rest: '60s', instructions: 'Movimento controlado, foque na contração do peito' },
            { name: 'Prancha', sets: 3, reps: '30-45s', rest: '60s', instructions: 'Mantenha o corpo alinhado' },
            { name: 'Afundo alternado', sets: 3, reps: '10 cada perna', rest: '60s', instructions: 'Desça controladamente' }
          ],
          duration: 45
        },
        {
          day: 'Terça-feira - Cardio HIIT',
          exercises: [
            { name: 'Jumping Jacks', sets: 4, reps: '30s', rest: '30s', instructions: 'Movimento explosivo' },
            { name: 'Burpees', sets: 4, reps: '20s', rest: '40s', instructions: 'Mantenha o ritmo constante' },
            { name: 'Mountain Climbers', sets: 4, reps: '30s', rest: '30s', instructions: 'Core sempre contraído' },
            { name: 'High Knees', sets: 4, reps: '30s', rest: '30s', instructions: 'Joelhos na altura do quadril' }
          ],
          duration: 30
        }
      ],
      nutrition: {
        calories: 1400,
        protein: 105,
        carbs: 140,
        fat: 47,
        meals: [
          { name: 'Café da manhã', time: '07:00', foods: ['Aveia com frutas vermelhas', 'Whey protein', 'Amêndoas'], calories: 350 },
          { name: 'Lanche da manhã', time: '10:00', foods: ['Iogurte grego', 'Granola'], calories: 200 },
          { name: 'Almoço', time: '12:30', foods: ['Peito de frango grelhado', 'Arroz integral', 'Brócolis', 'Salada'], calories: 450 },
          { name: 'Lanche da tarde', time: '15:30', foods: ['Maçã', 'Pasta de amendoim'], calories: 200 },
          { name: 'Jantar', time: '19:00', foods: ['Salmão grelhado', 'Batata doce', 'Aspargos'], calories: 400 }
        ]
      },
      tips: [
        'Beba 2-3L de água por dia',
        'Durma 7-8 horas por noite',
        'Faça cardio leve nos dias de descanso',
        'Aumente a intensidade gradualmente',
        'Tire fotos de progresso semanalmente',
        'Mantenha consistência nos treinos'
      ]
    }
  },
  {
    id: 'male-intermediate-muscle-gain',
    name: 'Hipertrofia Masculina',
    description: 'Programa para ganho de massa muscular masculino intermediário',
    tags: ['male', 'intermediate', 'muscle-gain', 'gym'],
    summary: 'Treinos intensos de 60min, 5x/semana, focado em hipertrofia com progressão de cargas.',
    fullProgram: {
      workouts: [
        {
          day: 'Segunda-feira - Peito/Tríceps',
          exercises: [
            { name: 'Supino reto', sets: 4, reps: '8-10', rest: '90s', instructions: 'Controle a descida, explosão na subida' },
            { name: 'Supino inclinado', sets: 4, reps: '8-12', rest: '90s', instructions: 'Foque na parte superior do peito' },
            { name: 'Crucifixo', sets: 3, reps: '10-12', rest: '60s', instructions: 'Movimento amplo, contração no final' },
            { name: 'Tríceps pulley', sets: 3, reps: '10-12', rest: '60s', instructions: 'Cotovelos fixos, contração total' },
            { name: 'Tríceps francês', sets: 3, reps: '8-10', rest: '60s', instructions: 'Movimento controlado' }
          ],
          duration: 60
        },
        {
          day: 'Terça-feira - Costas/Bíceps',
          exercises: [
            { name: 'Puxada frontal', sets: 4, reps: '8-10', rest: '90s', instructions: 'Puxe até o peito, contraia as escápulas' },
            { name: 'Remada curvada', sets: 4, reps: '8-12', rest: '90s', instructions: 'Mantenha as costas retas' },
            { name: 'Remada unilateral', sets: 3, reps: '10-12', rest: '60s', instructions: 'Foque na contração' },
            { name: 'Rosca direta', sets: 3, reps: '10-12', rest: '60s', instructions: 'Movimento controlado' },
            { name: 'Rosca martelo', sets: 3, reps: '8-10', rest: '60s', instructions: 'Pegada neutra' }
          ],
          duration: 60
        }
      ],
      nutrition: {
        calories: 2800,
        protein: 168,
        carbs: 350,
        fat: 93,
        meals: [
          { name: 'Café da manhã', time: '07:00', foods: ['Ovos mexidos', 'Aveia', 'Banana', 'Café'], calories: 500 },
          { name: 'Lanche da manhã', time: '10:00', foods: ['Whey protein', 'Frutas'], calories: 300 },
          { name: 'Almoço', time: '12:30', foods: ['Carne vermelha', 'Arroz', 'Feijão', 'Salada'], calories: 700 },
          { name: 'Pré-treino', time: '16:00', foods: ['Banana', 'Aveia', 'Café'], calories: 300 },
          { name: 'Pós-treino', time: '18:00', foods: ['Whey protein', 'Dextrose'], calories: 250 },
          { name: 'Jantar', time: '20:00', foods: ['Frango', 'Batata doce', 'Legumes'], calories: 600 },
          { name: 'Ceia', time: '22:00', foods: ['Caseína', 'Oleaginosas'], calories: 150 }
        ]
      },
      tips: [
        'Aumente a carga progressivamente',
        'Consuma proteína a cada 3h',
        'Descanse 48h entre grupos musculares',
        'Mantenha boa forma nos exercícios',
        'Durma pelo menos 8 horas',
        'Hidrate-se bem durante os treinos'
      ]
    }
  },
  {
    id: 'female-advanced-toning',
    name: 'Definição Feminina Avançada',
    description: 'Programa avançado para definição muscular feminina',
    tags: ['female', 'advanced', 'definition', 'gym'],
    summary: 'Treinos intensos de 50min, 6x/semana, combinando força e cardio para máxima definição.',
    fullProgram: {
      workouts: [
        {
          day: 'Segunda-feira - Glúteos/Pernas',
          exercises: [
            { name: 'Agachamento búlgaro', sets: 4, reps: '12-15', rest: '60s', instructions: 'Foque no glúteo da perna da frente' },
            { name: 'Hip thrust', sets: 4, reps: '15-20', rest: '60s', instructions: 'Contração máxima no topo' },
            { name: 'Stiff', sets: 4, reps: '12-15', rest: '60s', instructions: 'Sinta o alongamento posterior' },
            { name: 'Cadeira extensora', sets: 3, reps: '15-20', rest: '45s', instructions: 'Contração total no quadríceps' }
          ],
          duration: 50
        }
      ],
      nutrition: {
        calories: 1600,
        protein: 120,
        carbs: 160,
        fat: 53,
        meals: [
          { name: 'Café da manhã', time: '07:00', foods: ['Omelete', 'Aveia', 'Frutas'], calories: 400 },
          { name: 'Lanche da manhã', time: '10:00', foods: ['Whey protein', 'Castanhas'], calories: 250 },
          { name: 'Almoço', time: '12:30', foods: ['Peixe grelhado', 'Quinoa', 'Salada'], calories: 450 },
          { name: 'Lanche da tarde', time: '15:30', foods: ['Iogurte grego', 'Frutas'], calories: 200 },
          { name: 'Jantar', time: '19:00', foods: ['Frango', 'Legumes', 'Salada'], calories: 300 }
        ]
      },
      tips: [
        'Mantenha déficit calórico moderado',
        'Priorize exercícios compostos',
        'Varie os estímulos semanalmente',
        'Inclua cardio de baixa intensidade',
        'Monitore medidas corporais',
        'Mantenha hidratação adequada'
      ]
    }
  }
];

// Função para gerar tags baseadas nas respostas
export function generateTags(answers: Record<string, any>): string[] {
  const tags: string[] = [];
  
  // Sexo
  if (answers.gender) {
    tags.push(answers.gender);
  }
  
  // Nível de condicionamento
  if (answers.fitnessLevel) {
    if (answers.fitnessLevel.includes('Iniciante')) tags.push('beginner');
    else if (answers.fitnessLevel.includes('Básico') || answers.fitnessLevel.includes('Intermediário')) tags.push('intermediate');
    else tags.push('advanced');
  }
  
  // Objetivo principal
  if (answers.mainGoal) {
    if (answers.mainGoal.includes('Perder peso')) tags.push('weight-loss');
    else if (answers.mainGoal.includes('Ganhar massa')) tags.push('muscle-gain');
    else if (answers.mainGoal.includes('Tonificar') || answers.mainGoal.includes('definir')) tags.push('definition');
    else if (answers.mainGoal.includes('condicionamento')) tags.push('conditioning');
    else tags.push('maintenance');
  }
  
  // Local de treino
  if (answers.workoutLocation) {
    if (answers.workoutLocation.includes('casa')) tags.push('home');
    else if (answers.workoutLocation.includes('academia')) tags.push('gym');
    else tags.push('outdoor');
  }
  
  // Tipo de corpo desejado
  if (answers.desiredBody) {
    if (answers.desiredBody.includes('esbelto')) tags.push('lean');
    else if (answers.desiredBody.includes('atlético')) tags.push('athletic');
    else tags.push('muscular');
  }
  
  return tags;
}

// Função para encontrar o melhor template
export function findBestTemplate(tags: string[]): ProgramTemplate {
  // Busca por correspondência exata primeiro
  let template = PROGRAM_TEMPLATES.find(template => 
    tags.every(tag => template.tags.includes(tag))
  );
  
  // Se não encontrar correspondência exata, busca por maior número de tags compatíveis
  if (!template) {
    let maxMatches = 0;
    PROGRAM_TEMPLATES.forEach(t => {
      const matches = tags.filter(tag => t.tags.includes(tag)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        template = t;
      }
    });
  }
  
  return template || PROGRAM_TEMPLATES[0]; // Fallback para o primeiro template
}