export interface TodoData {
  tenantId: string
  id: number
  name: string
  isCompleted: boolean
  imageUrl?: string | null
  memo?: string | null
}
