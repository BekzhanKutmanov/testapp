import { axiosInstance } from "@/shared/api/axiosInstance";
import {apiRequest} from "@/shared/api/apiHelper";

export const test = async ()=> {
  const data = await apiRequest(axiosInstance.get(''));

  console.log(data);

  return data;
}

