import { ReactNode } from 'react';

export default function CShapeComponent({ children, comingFromLeft = false, className = '' }: { children: ReactNode; comingFromLeft?: boolean; className?: string }) {
  return (
    <div
      className={`
        relative min-h-16 w-[90%]
        bg-white border border-gray-200 shadow-sm
        flex flex-row justify-evenly items-center 
        py-4
        ${comingFromLeft ? 'rounded-r-full -ml-8' : 'rounded-l-full -mr-8'}
        ${className}
      `} 
    >
      {children}
    </div>
  )
}