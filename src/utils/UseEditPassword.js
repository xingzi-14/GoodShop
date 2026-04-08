//修改密码模块
import {editUserPwd}from '../api/login'
import { ref,reactive } from 'vue';
import { ElMessage} from 'element-plus'
export function useEditPassword(){
 let dialogEditPwd=ref(false);
 let editPwdForm=reactive({
    oldpassword:'',
    password:'',
    repassword:''

 })
const ruleFormDom=ref(null)
/**修改密码表单验证 */
const rulesForm=ref({
    oldpassword:[{ required:true,message :'请输入旧密码',trigger :'blur'}],
    password :[{ required:true,message :'请输入新密码',trigger :'blur'}],
    repassword :[{ required:true,message :'请确认新密码',trigger :'blur'}]
 
 })
 const goUpPwd = () => {
     ruleFormDom.value.validate(async valid => {
   if(!valid) return;
   const res=await editUserPwd(editPwdForm)
  
   if(res.msg.indexOf('修改成功')!=-1){
     ElMessage.success('密码修改成功')
   }else{
      ElMessage.error(res.msg)
     }
   })
    dialogEditPwd=false;
 }
 //取消修改
 const Cancel=()=>{
     ruleFormDom.value.resetFields();
     dialogEditPwd.value=false; 
 }
 //返回应用的变量和函数
return{
    dialogEditPwd,
    editPwdForm,
    ruleFormDom,
    rulesForm,
    Cancel,
    goUpPwd,
} 
}
