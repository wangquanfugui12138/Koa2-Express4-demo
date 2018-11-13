import axios from 'axios';
import { message } from 'antd';

// 拦截请求
axios.interceptors.request.use(async config => await config, err => {
    message.error('请求失败')
    return Promise.reject(err)
})

//拦截响应
axios.interceptors.response.use(
    config => {
        !config.data.success && message.error('响应失败')
        return config.data
    },
    err => {
        message.error('响应失败')
        return Promise.reject(err)
    }
)