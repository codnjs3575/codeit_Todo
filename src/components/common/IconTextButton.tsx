import React from 'react'

interface IconTextButtonProps {
  icon: React.ReactNode
  text: string
  onClick?: () => void
  type: '추가' | '수정' | '삭제'
  isUserTodo?: boolean | undefined
  className?: string
}

export default function IconTextButton({
  icon,
  text,
  className,
  isUserTodo,
  onClick,
  type,
}: IconTextButtonProps) {
  return (
    <button
      className={`flex items-center justify-center flex-grow whitespace-nowrap
        max-w-[168px] gap-x-2 rounded-full h-[56px] px-4 font-bold text-slate9 shadow-custom 
        ${className}
        ${
          isUserTodo === true
            ? 'bg-violet6 text-white text-bold'
            : isUserTodo === false && 'bg-slate2 text-slate9'
        }`}
      onClick={onClick}
    >
      <span className="flex items-center justify-center w-4 h-4">{icon}</span>
      <span className={`${type === '추가' && 'hidden sm:inline'}`}>{text}</span>
    </button>
  )
}
