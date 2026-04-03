import { axiosInstance } from "@/shared/api/axiosInstance";
import {apiRequest} from "@/shared/api/apiHelper";

export const getSubjects = async ()=> {
  const data = await apiRequest(axiosInstance.get(''));

  console.log(data);

  return data;
}

export const getShowSubject = async (id: number)=> {
  console.log('this id ',id);
  const data = await apiRequest(axiosInstance.get( `/${id}`));

  console.log(data);

  return data;
}

export const addSubjects = async (newSubject) => {
  console.log(newSubject)
  const data = await apiRequest(axiosInstance.post('', newSubject));

  console.log(data);

  return data;
}

export const updateSubjects = async (name: string, id: number | null) => {
  const data = await apiRequest(axiosInstance.put(`/${id}`, { name }))

  console.log(data);

  return data;
}


