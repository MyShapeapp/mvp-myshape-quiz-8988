'use client';

interface BodyTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  gender: string;
}

export function BodyTypeSelect({ value, onChange, gender }: BodyTypeSelectProps) {
  const bodyTypes = [
    {
      id: 'skinny',
      label: 'Magro',
      maleImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=160&fit=crop&crop=face',
      femaleImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=120&h=160&fit=crop&crop=face'
    },
    {
      id: 'average',
      label: 'Médio',
      maleImage: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=120&h=160&fit=crop&crop=face',
      femaleImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=160&fit=crop&crop=face'
    },
    {
      id: 'overweight',
      label: 'Acima do Peso',
      maleImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&h=160&fit=crop&crop=face',
      femaleImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=160&fit=crop&crop=face'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
      {bodyTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => onChange(type.id)}
          className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 transform hover:scale-105 ${
            value === type.id
              ? 'border-[#0066FF] bg-[#0066FF]/10 shadow-2xl shadow-[#0066FF]/25'
              : 'border-gray-700 bg-[#000000] hover:border-[#0066FF]/50 hover:shadow-lg hover:shadow-[#0066FF]/10'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img 
                src={gender === 'male' ? type.maleImage : type.femaleImage}
                alt={type.label} 
                className="w-24 h-32 object-cover rounded-2xl border-2 border-gray-600"
              />
              {value === type.id && (
                <div className="absolute inset-0 bg-[#0066FF]/20 rounded-2xl animate-pulse"></div>
              )}
            </div>
            <span className="font-semibold text-lg text-white">{type.label}</span>
          </div>
          
          {/* Glow effect quando selecionado */}
          {value === type.id && (
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#0066FF]/20 to-[#0066FF]/10 animate-pulse"></div>
          )}
        </button>
      ))}
    </div>
  );
}