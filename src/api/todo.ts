import axios from 'axios'
import { TodoData } from '../types/todo'

export const TANANT_ID = 'cheawon-test'
const API_URL = `https://assignment-todolist-api.vercel.app/api/${TANANT_ID}`

export const getTodos = async (
  page = 1,
  pageSize = 10
): Promise<TodoData[]> => {
  const res = await axios.get(`${API_URL}/items`, {
    params: { page, pageSize },
  })
  return res.data
}

export const addTodo = async (name: string): Promise<TodoData> => {
  const res = await axios.post(`${API_URL}/items`, { name })
  return res.data
}

export const updateTodo = async (todo: TodoData): Promise<TodoData> => {
  const { id, name, memo, imageUrl, isCompleted } = todo
  console.log(id, name, memo, imageUrl, isCompleted)

  const res = await axios.patch(`${API_URL}/items/${id}`, {
    name,
    memo: memo ?? '',
    imageUrl: imageUrl ?? '',
    isCompleted,
  })
  return res.data
}

export const getTodo = async (id: string): Promise<TodoData> => {
  const res = await axios.get(`${API_URL}/items/${id}`)
  return res.data
}

export const deleteTodo = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/items/${id}`)
}
