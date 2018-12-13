import axios from 'axios';
import { message } from 'antd';

// 拦截请求
axios.interceptors.request.use(config => config, err => {
    message.error('请求失败')
    return Promise.resolve({data:[],success:false})
})

//拦截响应
axios.interceptors.response.use(
    config => {
        config.data.success !== undefined && !config.data.success && message.error('响应失败')
        return config.data
    },
    err => {
        message.error('响应失败')
        return Promise.resolve({data:[],success:false})
    }
)