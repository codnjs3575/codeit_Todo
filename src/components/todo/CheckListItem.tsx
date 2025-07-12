/**
 * CheckListItem 컴포넌트
 * - 'todo' 또는 'done' 타입에 따라 다른 스타일과 기능을 렌더링
 
 * - layout이 'default'인 경우 상세 페이지 이동 가능한 메인 페이지
 * - layout이 'detail'인 경우 사용자가 내용을 직접 수정할 수 있는 상세 페이지
 */

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
    // 반응형 css (분기: isTodo, isDefault)
    <div
      className={`
        flex w-full h-[50px] pl-3 border-2 border-slate9 items-center justify-center gap-4
        ${isTodo ? 'bg-white' : isDefault ? 'bg-violet1' : 'bg-violet-200'}
        ${
          isDefault
            ? 'h-[50px] rounded-[27px] mt-4'
            : 'sm:w-full h-16 rounded-[24px] mx-auto'
        }
    `}
    >
      {/* 할 일 완료 토글 버튼 영역 */}
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

      {/* 할 일 텍스트 영역 */}
      {/* isDefault(메인페이지)라면 p 태그, !isDefault(상세페이지)라면 input 태그 렌더링 */}
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
          value={userTodo !== undefined ? userTodo : todo.name}
          className=" pr-3 text-slate9 font-bold text-xl leading-[23px] 
          outline-none underline min-w-0 max-w-none bg-transparent"
          size={(userTodo || todo.name).length * 1.5}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (setUserTodo) setUserTodo(e.target.value)
          }}
        />
      )}
    </div>
  )
}
