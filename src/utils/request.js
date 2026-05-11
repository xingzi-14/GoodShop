import axios from "axios";
import { ElLoading } from "element-plus";
let loadingAni=null;
//创建axios实列对象
const instance =axios.create({
    //设置服务器地址
    baseURL : '/api',
//设置请求超时时间为5秒
    timeout:40000
})

//设置请求拦截器,将header属性携带拼接到此处
instance.interceptors.request.use( config =>{
    loadingAni=ElLoading.service({
        lock:true,
        text:'Loading',
        background:'rgba(0,0,0,0.7)',
    })
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

if (loadingAni) loadingAni.close();
    return response.data;
    
}, err => {
    if (loadingAni) loadingAni.close(); // ✅ 报错也必须关闭！
    if (err && err.response && err.response.data) {
        return err.response.data;
    }
    return { msg: "网络异常或服务器错误" };
})


//导出
export default instance;