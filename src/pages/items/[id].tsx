// ---------------------------------------------------
// 📄 [id].tsx (To-Do 상세 페이지)
//
// ✅ 주요 역할:
// - 특정 To-Do 항목을 불러와 상세 내용을 보여줌
// - 할 일 제목, 메모, 이미지 수정 기능
// - 완료 여부 토글 및 삭제 기능
//
// 🧩 사용된 공용 컴포넌트:
// - CheckListItem: 할 일 항목 UI
// - IconTextButton: 공용 버튼 컴포넌트
//
// 🛠️ 기술 스택:
// - Next.js (useRouter)
// - React Hooks (useEffect, useState, useRef)
// - Tailwind CSS for 스타일링
//
// ---------------------------------------------------

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { TodoData } from '@/types/todo'

import { deleteTodo, getTodo, updateTodo } from '@/api/todo'
import { uploadImage } from '@/api/image'

import CheckListItem from '@/components/todo/CheckListItem'
import IconTextButton from '@/components/common/IconTextButton'

export default function TodoDetailPage() {
  const router = useRouter()
  const { id } = router.query

  // 서버에 저장되어있는 userTodoData 관리
  const [userTodoData, setUserTodoData] = useState<TodoData | null>(null)

  // user 입력 상태 관리
  const [userTodo, setUserTodo] = useState<string>('')
  const [userImageUrl, setUserImageUrl] = useState<string>('')
  const [userMemo, setUserMemo] = useState<string>('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 페이지 진입 시 해당 ID의 TodoData 불러오기 -> userTodoData에 저장
  useEffect(() => {
    if (!id) return
    const fetchTodo = async () => {
      try {
        const todo = await getTodo(id as string)
        setUserTodoData(todo)
      } catch (error) {
        console.error('Failed to fetch todo:', error)
      }
    }
    fetchTodo()
  }, [id])

  // userTodoData가 변경되면 user 입력 상태 초기화
  useEffect(() => {
    if (userTodoData) {
      setUserImageUrl(userTodoData.imageUrl ?? '')
      setUserMemo(userTodoData.memo ?? '')
      setUserTodo(userTodoData.name)
    }
  }, [userTodoData])

  // 이미지 업로드 처리 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadImage(file)
      setUserImageUrl(imageUrl)
    } catch (err) {
      console.error('이미지 업로드 실패:', err)
    }
  }

  // 할 일의 'isCompleted' 핸들러 (낙관적 업데이트 방식으로 구현)
  const handleTodoBtnClick = async (userTodoData: TodoData) => {
    const updatedTodo = {
      ...userTodoData,
      isCompleted: !userTodoData.isCompleted,
    }

    setUserTodoData(updatedTodo)
    try {
      await updateTodo(updatedTodo)
    } catch (error) {
      console.error('Failed to update todo:', error)
      setUserTodoData(userTodoData)
    }
  }

  // 할 일 삭제 핸들러
  const handleTodoDeleteBtnClick = async (id: string) => {
    try {
      await deleteTodo(id)
      router.push('/')
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }

  // 할 일 상세정보 수정 핸들러
  const handleTodoUpdateBtnClick = async () => {
    if (!userTodoData) return

    const updatedTodo = {
      ...userTodoData,
      name: userTodo,
      memo: userMemo,
      imageUrl: userImageUrl,
    }
    setUserTodoData(updatedTodo)
    try {
      await updateTodo(updatedTodo)
    } catch (error) {
      console.error('Failed to update todo:', error)
      setUserTodoData(userTodoData)
    }

    router.push('/')
  }

  // 수정 여부 판단 (버튼 활성화용 조건)
  const isUpdated =
    userTodoData &&
    ((userTodo.trim() !== '' && userTodo !== userTodoData.name) ||
      (userMemo.trim() !== '' && userMemo !== userTodoData.memo) ||
      (userImageUrl.trim() !== '' && userImageUrl !== userTodoData.imageUrl))

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-full max-w-[996px] mx-auto">
        {/* todo 수정 */}
        {userTodoData && (
          <CheckListItem
            todo={userTodoData}
            type={userTodoData.isCompleted ? 'done' : 'todo'}
            layout="detail"
            userTodo={userTodo}
            setUserTodo={setUserTodo}
            onClick={handleTodoBtnClick}
          />
        )}

        {/* 이미지 및 메모 */}
        <div className="flex flex-col gap-6 mt-6 md:flex-row">
          {/* 사용할 fileRef */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
          />
          {/* 1. 이미지 컴포넌트(반응형) */}
          <div
            className={`flex items-center justify-center w-full md:w-2/5 md:max-w-[384px] h-[311px] rounded-3xl relative ${
              !userImageUrl &&
              'border-2 border-slate3 border-dashed bg-slate-50'
            }`}
          >
            {/* 1-1. 업로드된 이미지파일이 없다면 기본 이미지 아이콘, 있다면 업로드된 이미지로 렌더링 */}
            {userImageUrl ? (
              <Image
                src={userImageUrl}
                alt="업로드된 이미지"
                unoptimized
                fill
                className="object-cover rounded-3xl"
              />
            ) : (
              <Image
                src="/images/icon/img.svg"
                alt="기본 이미지 아이콘"
                width={64}
                height={64}
              />
            )}

            {/* 1-2. 업르드된 이미지파일이 없다면 추가버튼, 있다면 수정버튼으로 렌더링 */}
            <Image
              src={
                userImageUrl
                  ? '/images/button/ImageEditBtn.svg'
                  : '/images/button/ImageAddBtn.svg'
              }
              alt="이미지 추가 버튼"
              width={64}
              height={64}
              className="absolute cursor-pointer bottom-4 right-4"
              onClick={() => fileInputRef.current?.click()}
            />
          </div>

          {/* 2. 메모 컴포넌트(반응형) */}
          <div className="w-full md:w-3/5 md:max-w-[588px] h-[311px] relative">
            <Image
              src="/images/memo.svg"
              alt="메모 이미지"
              fill
              className="z-0 object-cover rounded-3xl"
            />
            <div className="absolute top-0 left-0 flex flex-col w-full h-full px-4 py-5">
              <p className="text-center text-base leading-[18px] font-extrabold text-brown-600 mb-4">
                Memo
              </p>
              {/* 2-1. textarea 대신 contentEditable한 div 태그를 사용하여 원하는 css로 수정함 */}
              <div className="relative flex-grow overflow-auto scroll-smooth">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const inputText = (e.currentTarget as HTMLElement).innerText
                    setUserMemo(inputText) // prev 사용 X
                  }}
                  className="w-full h-full max-w-full resize-none outline-none 
                    font-normal text-base text-slate8 leading-[18px] 
                    overflow-auto whitespace-pre-wrap break-words scrollbar-custom flex flex-col justify-center-safe text-center"
                >
                  {userMemo}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 수정 완료/삭제하기 버튼 */}
        <div
          className="flex flex-row items-center justify-center w-full h-full 
        mx-auto md:justify-end gap-[7px] sm:gap-4 mt-6"
        >
          <div className="w-[168px] h-[56px]">
            <IconTextButton
              icon={
                <Image
                  src="/images/button/icons/check.svg"
                  alt="check"
                  width={16}
                  height={16}
                />
              }
              text="수정 완료"
              className={`text-slate9 w-full ${
                isUpdated
                  ? '!bg-lime3 cursor-pointer'
                  : 'bg-slate2 cursor-not-allowed'
              }`}
              type="수정"
              onClick={isUpdated ? () => handleTodoUpdateBtnClick() : undefined}
            />
          </div>
          <div className="w-[168px] h-[56px]">
            <IconTextButton
              icon={
                <Image
                  src="/images/button/icons/X.svg"
                  alt="check"
                  width={16}
                  height={16}
                />
              }
              text="삭제하기"
              className="w-full text-white cursor-pointer bg-rose5"
              type="삭제"
              onClick={() => {
                if (typeof id === 'string') handleTodoDeleteBtnClick(id)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
