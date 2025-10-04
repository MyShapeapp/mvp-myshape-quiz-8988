'use client';

interface GoalSelectProps {
  value: string;
  onChange: (value: string) => void;
  gender: string;
}

export function GoalSelect({ value, onChange, gender }: GoalSelectProps) {
  const goals = [
    {
      id: 'toned',
      label: 'Em Forma',
      maleImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=160&fit=crop&crop=face',
      femaleImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=120&h=160&fit=crop&crop=face'
    },
    {
      id: 'muscular',
      label: 'Musculoso',
      maleImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=120&h=160&fit=crop&crop=face',
      femaleImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=160&fit=crop&crop=face'
    },
    {
      id: 'very_muscular',
      label: 'Bem Musculoso',
      maleImage: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=120&h=160&fit=crop&crop=face',
      femaleImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=160&fit=crop&crop=face'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
      {goals.map((goal) => (
        <button
          key={goal.id}
          onClick={() => onChange(goal.id)}
          className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 transform hover:scale-105 ${
            value === goal.id
              ? 'border-[#0066FF] bg-[#0066FF]/10 shadow-2xl shadow-[#0066FF]/25'
              : 'border-gray-700 bg-[#000000] hover:border-[#0066FF]/50 hover:shadow-lg hover:shadow-[#0066FF]/10'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img 
                src={gender === 'male' ? goal.maleImage : goal.femaleImage}
                alt={goal.label} 
                className="w-24 h-32 object-cover rounded-2xl border-2 border-gray-600"
              />
              {value === goal.id && (
                <div className="absolute inset-0 bg-[#0066FF]/20 rounded-2xl animate-pulse"></div>
              )}
            </div>
            <span className="font-semibold text-lg text-white">{goal.label}</span>
          </div>
          
          {/* Glow effect quando selecionado */}
          {value === goal.id && (
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#0066FF]/20 to-[#0066FF]/10 animate-pulse"></div>
          )}
        </button>
      ))}
    </div>
  );
}