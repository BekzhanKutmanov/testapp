// shared/api/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/posts"
});

// request (токен)
axiosInstance.interceptors.request.use((config) => {
  // const token = getToken('access_token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  // return config;
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// response (глобальные вещи)
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      console.warn('Неавторизован. Удаляю токен...');

      if (typeof window !== 'undefined') {
        console.log(window?.location.pathname);
        // if(window.location.pathname != '/auth/login') {
        //     const currentPath = window.location.pathname + window.location.search;
        //     window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`
        // }
        // localStorage.removeItem('userVisit');
      }
      // document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    }

    if (status === 403) {
      console.warn('Не имеет доступ. Перенаправляю...');
      if (typeof window !== 'undefined') {
        // window.location.href = '/';
      }
    }

    if (status === 404) {
      console.warn('404 - Перенаправляю...');
      if (typeof window !== 'undefined') {
        // window.location.href = '/pages/notfound';
        // localStorage.removeItem('userVisit');
      }
      // document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    }

    return Promise.reject(error);
  }
);
