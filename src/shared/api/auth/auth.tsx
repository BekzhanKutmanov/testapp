import { axiosInstance } from '@/shared/api/axiosInstance'
import { apiRequest } from '@/shared/api/apiHelper'

export const getLogin = async () => {
  const data = await apiRequest(axiosInstance.get('/1'))

  console.log(data)

  return data
}

export const adToken = async (email: string, password: string) => {
  const data = await apiRequest(axiosInstance.post('', {email: email, password: password}))

  console.log(data)

  return data
}
