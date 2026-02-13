import axios from 'axios';

const api=axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    //   withCredentials: true ,// Required to send the Refresh Token Cookie automatically!

    headers:{
        "Content-Type": "application/json"
    }
})

//Request interceptor
api.interceptors.request.use(
    (config) => {
        const token =localStorage.getItem("accessToken");

        if (token){
            config.headers.Authorization=`Bearer ${token}`
        }
    return config
    },
    (error)=>Promise.reject(error)
)

//Response Interceptor
api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response?.status===401){
            localStorage.removeItem("accessToken");
            // window.location.href="/signup"
        }
        return Promise.reject(error);
    }
)


export default api;