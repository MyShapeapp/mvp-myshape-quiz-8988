'use client';

interface QuestionImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function QuestionImage({ src, alt, className = '' }: QuestionImageProps) {
  return (
    <div className={`relative mb-8 ${className}`}>
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <img 
          src={src} 
          alt={alt}
          className="w-full h-auto rounded-xl object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}