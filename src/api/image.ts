import axios from 'axios'
import { TANANT_ID } from './todo'

const API_URL = `https://assignment-todolist-api.vercel.app/api/${TANANT_ID}`

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await axios.post(`${API_URL}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.url
  } catch (error) {
    console.error('Failed to upload image:', error)
    throw error
  }
}
