import { axiosInstance } from "@/shared/api/axiosInstance";
import {apiRequest} from "@/shared/api/apiHelper";

export const getSubjects = async ()=> {
  const data = await apiRequest(axiosInstance.get(''));
  return data;
}

export const getShowSubject = async (id: number)=> {
  const data = await apiRequest(axiosInstance.get( `/${id}`));
  return data;
}

export const addSubjects = async (newSubject) => {
  const data = await apiRequest(axiosInstance.post('', newSubject));
  return data;
}

export const updateSubjects = async (name: string, id: number | null) => {
  const data = await apiRequest(axiosInstance.put(`/${id}`, { name }))
  return data;
}

export const deleteSubject = async (id: number | null) => {
  const data = await apiRequest(axiosInstance.delete(`/${id}`))
  return data;
}

