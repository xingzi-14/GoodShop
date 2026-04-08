import axios from "axios";
//创建axios实列对象
const instance =axios.create({
    //设置服务器地址
    baseURL : '/api',
//设置请求超时时间为5秒
    timeout:10000
})

//设置请求拦截器,将header属性携带拼接到此处
instance.interceptors.request.use( config =>{
    if (!config) config = {};
    
    // 👇 保证 headers 一定存在
    if (!config.headers) config.headers = {};


    const token=sessionStorage.getItem('token');
    
    if(token){
 
            //从拦截器的配置中，提取header属性，新建一个token下标，并将会话存储提取token值赋值过去
        config.headers['token'] = token
    }
    return config;
})

//设置请求响应器
instance.interceptors.response.use( response=>{
    return response.data;
    
},err =>{
    return err.response.data;
})

//导出
export default instance;