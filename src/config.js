import axios from 'axios';
import { message } from 'antd';

// 拦截请求
axios.interceptors.request.use(
    config =>{
        if(config.method === 'post'){
            config.data.token = localStorage.getItem('csrftoken') || ' '
        }
        return config
    }, err => message.error('请求失败'))

//拦截响应
axios.interceptors.response.use(
    config =>config.data,
    err => {
        if(err.response.status===401){
            message.warning('请先登录')
            window.location = `/login?next=${window.location.pathname}`
        }
        return Promise.reject(err.response.data)
    }
)