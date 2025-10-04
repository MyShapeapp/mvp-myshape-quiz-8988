'use client';

interface AgeSelectProps {
  value: string;
  onChange: (value: string) => void;
  gender: string;
}

export function AgeSelect({ value, onChange, gender }: AgeSelectProps) {
  const ageRanges = [
    {
      id: '18-25',
      label: '18-25',
      maleImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=160&fit=crop&crop=face',
      femaleImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=160&fit=crop&crop=face'
    },
    {
      id: '26-35',
      label: '26-35',
      maleImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=120&h=160&fit=crop&crop=face',
      femaleImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=160&fit=crop&crop=face'
    },
    {
      id: '36-45',
      label: '36-45',
      maleImage: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=120&h=160&fit=crop&crop=face',
      femaleImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=160&fit=crop&crop=face'
    },
    {
      id: '46+',
      label: '46+',
      maleImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&h=160&fit=crop&crop=face',
      femaleImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=160&fit=crop&crop=face'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-5xl mx-auto">
      {ageRanges.map((range) => (
        <button
          key={range.id}
          onClick={() => onChange(range.id)}
          className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 transform hover:scale-105 ${
            value === range.id
              ? 'border-[#0066FF] bg-[#0066FF]/10 shadow-2xl shadow-[#0066FF]/25'
              : 'border-gray-700 bg-[#000000] hover:border-[#0066FF]/50 hover:shadow-lg hover:shadow-[#0066FF]/10'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img 
                src={gender === 'male' ? range.maleImage : range.femaleImage}
                alt={`${range.label} anos`} 
                className="w-20 h-24 object-cover rounded-2xl border-2 border-gray-600"
              />
              {value === range.id && (
                <div className="absolute inset-0 bg-[#0066FF]/20 rounded-2xl animate-pulse"></div>
              )}
            </div>
            <span className="font-semibold text-base text-white">{range.label}</span>
          </div>
          
          {/* Glow effect quando selecionado */}
          {value === range.id && (
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#0066FF]/20 to-[#0066FF]/10 animate-pulse"></div>
          )}
        </button>
      ))}
    </div>
  );
}