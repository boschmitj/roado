import { ReactNode } from 'react';

export default function CShapeComponent({ children, comingFromLeft = false, className = '' }: { children: ReactNode; comingFromLeft?: boolean; className?: string }) {
  return (
    <div
      className={`
        relative min-h-16 w-[80%]
        bg-white border border-gray-200 shadow-sm
        flex flex-row justify-evenly items-center 
        ${comingFromLeft ? 'left-0 rounded-r-full' : 'right-0 rounded-l-full'}
        ${className}
      `} 
    >
      {children}
    </div>
  )
}