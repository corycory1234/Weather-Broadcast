import axios from "axios";

// 1. 建立 axios 實例
export const axiosInstance = axios.create({
  baseURL: "https://api.openweathermap.org/data/3.0",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. 請求攔截
axiosInstance.interceptors.request.use(
  (error) => {
    console.log("請求攔截失敗", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  // 3. 200成功
  (response) => {
    return response.data;
  },

  // 3.1 錯誤部分
  (error) => {
    console.error("Response Interceptor Errror:", error.response || error.message);
    if(error.response) {
      switch (error.response.status) {
        case 401:
          console.error("權限不足, 請重新登入");
          break;
        case 404:
          console.error("找不到請求資源");
        case 500:
          console.error("伺服器發生錯誤");
        default:
          console.error(`發生錯誤 ${error.response.status}`);
      }
    } 
    else {
      console.error("網路錯誤或請求無法送達");
    };

    return Promise.reject(error)
  },


)