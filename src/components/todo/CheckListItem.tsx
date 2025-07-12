import { TodoData } from '@/types/todo'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

interface CheckListItemProps {
  todo: TodoData
  type: 'todo' | 'done'
  layout?: 'default' | 'detail'
  onClick?: (todo: TodoData) => void
  userTodo?: string
  setUserTodo?: (e: string) => void
}

export default function CheckListItem({
  todo,
  type,
  layout,
  onClick,
  userTodo,
  setUserTodo,
}: CheckListItemProps) {
  const isTodo = type === 'todo'
  const isDefault = layout === 'default'
  const router = useRouter()

  return (
    <div
      className={`
        flex w-full h-[50px] pl-3 border-2 border-slate9 items-center
        ${isTodo ? 'bg-white' : isDefault ? 'bg-violet1' : 'bg-violet-200'}
        ${
          isDefault
            ? 'h-[50px] rounded-[27px] mt-4'
            : 'sm:w-full h-16 rounded-[24px] justify-center mx-auto items-center'
        }
    `}
    >
      <div className="flex items-center justify-center w-full gap-4">
        <div className="w-8 h-8 shrink-0">
          <button
            className={`cursor-pointer w-full h-full flex items-center justify-center rounded-full`}
            onClick={onClick ? () => onClick(todo) : undefined}
          >
            <Image
              src={
                isTodo
                  ? '/images/button/CheckBtnTodo.svg'
                  : '/images/button/CheckBtnDone.svg'
              }
              alt="체크 버튼"
              width={32}
              height={32}
            />
          </button>
        </div>
        {isDefault ? (
          <p
            className={`cursor-pointer break-words whitespace-normal overflow-x-hidden text-ellipsis line-clamp-1 pr-3 text-slate8 flex-1
          ${isTodo ? '' : 'line-through'} 
          `}
            onClick={() => {
              if (isDefault) router.push(`/items/${todo.id}`)
            }}
          >
            {todo.name}
          </p>
        ) : (
          <input
            type="text"
            id="userTodo"
            style={{ width: `${(userTodo || todo.name).length + 10}ch` }}
            value={userTodo !== undefined ? userTodo : todo.name}
            className=" pr-3 text-slate9 font-bold text-xl leading-[23px] bg-transparent outline-none underline w-auto min-w-0 max-w-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (setUserTodo) setUserTodo(e.target.value)
            }}
          />
        )}
      </div>
    </div>
  )
}
