// ---------------------------------------------------
// 📄 index.tsx (Main Page of To-Do Application)
//
// ✅ 주요 역할:
// - 사용자 입력을 받아 새로운 할 일 추가
// - 서버로부터 할 일 목록을 불러오고 상태 관리
// - 완료 여부 토글 기능 (낙관적 UI 업데이트 포함)
// - 할 일/완료 목록 각각 렌더링
//
// 🧩 사용된 공용 컴포넌트:
// - EmptyState: 할 일/완료 목록이 비어 있을 때 표시
// - CheckListItem: 할 일 항목 UI
// - IconTextButton: 입력창 우측의 추가 버튼
//
// 🛠️ 기술 스택:
// - React (useState, useEffect)
// - Next.js (SSR, Head)
// - Tailwind CSS for 스타일링
//
// ---------------------------------------------------

import Head from 'next/head'
import Image from 'next/image'

import { useEffect, useState } from 'react'

import { getTodos, addTodo, TANANT_ID, updateTodo } from '@/api/todo'
import { TodoData } from '@/types/todo'
import EmptyState from '@/components/todo/EmptyState'
import CheckListItem from '@/components/todo/CheckListItem'
import IconTextButton from '@/components/common/IconTextButton'

export default function HomePage() {
  const [userTodo, setUserTodo] = useState<string>('') // 입력창 상태 관리
  const [todos, setTodos] = useState<TodoData[]>([]) // 전체 할 일 목록 상태 관리
  const todoList = todos.filter((todo) => !todo.isCompleted) // 완료되지 않은 할 일 목록 필터링 (TodoData[] 형태)
  const doneList = todos.filter((todo) => todo.isCompleted) // 완료된 할 일 목록 필터링 (TodoData[] 형태)

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await getTodos()
        const normalizedTodos = todos.map((todo) => ({
          ...todo,
          tenantId: TANANT_ID,
        }))
        setTodos(normalizedTodos)
      } catch (error) {
        console.error('Failed to fetch todos:', error)
      }
    }
    fetchTodos()
  }, [])

  // todos(전체 할 일 목록)에 userTodo(새로운 할 일) 추가 핸들러
  const handleTodoAddBtnClick = () => {
    if (!userTodo.trim() || todos.some((t) => t.name === userTodo.trim()))
      return

    addTodo(userTodo).then((newTodo) => {
      setTodos((prev) => [newTodo, ...prev])
      setUserTodo('')
    })
  }

  // 할 일의 'isCompleted' 핸들러 (낙관적 업데이트 방식으로 구현)
  const handleTodoBtnClick = async (todo: TodoData) => {
    const updatedTodo = {
      ...todo,
      isCompleted: !todo.isCompleted,
    }

    setTodos((prev) => prev.map((t) => (t.id === todo.id ? updatedTodo : t)))

    try {
      await updateTodo(updatedTodo)
    } catch (error) {
      console.error('Failed to update todo:', error)
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t))) // 실패 시 이전 상태로 롤백
    }
  }

  return (
    <>
      <Head>
        <title>do it : 할 일 목록</title>
      </Head>
      <main className="w-full">
        {/* 검색바 & 추가 버튼 영역 */}
        <section className="flex flex-row justify-between items-center gap-2 sm:gap-4 h-[53px]">
          <input
            type="text"
            id="todo-input"
            placeholder="할 일을 입력해주세요"
            className="shadow-custom px-6 pt-[17px] pb-[21px] w-[280px] sm:w-full h-[56px] 
            leading-[16px] max-w-[1016px] bg-slate1 outline-none font-normal"
            value={userTodo}
            onChange={(e) => setUserTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return // IME 입력 중인 경우 이벤트 무시
              if (e.key === 'Enter') {
                handleTodoAddBtnClick()
              }
            }}
          />
          <IconTextButton
            icon={
              <Image
                src={
                  userTodo
                    ? '/images/button/icons/plus.svg'
                    : '/images/button/icons/plus_dark.svg'
                }
                alt="plus"
                width={16}
                height={16}
              />
            }
            text="추가하기"
            type="추가"
            isUserTodo={userTodo !== ''}
            onClick={handleTodoAddBtnClick}
          />
        </section>

        {/* 할 일 목록 영역 */}
        <section className="flex flex-col gap-12 mt-8 md:flex-row md:gap-6">
          {/* TO DO 목록 */}
          <div className="w-full md:w-1/2">
            <Image
              src="/images/icon/todo.svg"
              alt="todo"
              width={101}
              height={36}
            />
            {todoList.length === 0 ? (
              <EmptyState
                iconName="todo"
                messageLine1="할 일이 없어요."
                messageLine2="TODO를 새롭게 추가해주세요!"
              />
            ) : (
              todoList.map((todo) => (
                <CheckListItem
                  key={todo.id}
                  todo={todo}
                  type="todo"
                  layout="default"
                  onClick={() => handleTodoBtnClick(todo)}
                />
              ))
            )}
          </div>

          {/* DONE 목록 */}
          <div className="w-full md:w-1/2">
            <Image
              src="/images/icon/done.svg"
              alt="done"
              width={101}
              height={36}
            />
            {doneList.length === 0 ? (
              <EmptyState
                iconName="done"
                messageLine1="아직 다 한 일이 없어요."
                messageLine2="해야 할 일을 체크해보세요!"
              />
            ) : (
              doneList.map((done) => (
                <CheckListItem
                  key={done.id}
                  todo={done}
                  type="done"
                  layout="default"
                  onClick={() => handleTodoBtnClick(done)}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </>
  )
}
