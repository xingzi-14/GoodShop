import { nextTick, ref } from "vue";
import { insertGoodsSkusCardValueFn, delGoodsSkusCardValueFn,
     editGoodsSkusCardValueFn ,insertGoodsSkusFn,
     delGoodsSkusCardFn,editGoodsSkusCardFn} from "../api/goods";
import { ElMessage } from 'element-plus';
import { computed } from "vue";

export const goodID = ref(0);
export const skuList = ref([]);
export const skuTable=ref([]);

/**
 * 初始化 SKU 列表数据
 * @param {Object} goodinfo - 商品详情数据，包含 goodsSkusCard 数组
 */
export function initSkuListFn(goodinfo) {
    if (!goodinfo || !goodinfo.goodsSkusCard) {
        skuList.value = [];
        return;
    }
    
    skuList.value = goodinfo.goodsSkusCard.map(item => {
        item.text = item.name;
        // 确保每个规格选项值都有 text 属性用于显示
        if (item.goodsSkusCardValue && Array.isArray(item.goodsSkusCardValue)) {
            item.goodsSkusCardValue = item.goodsSkusCardValue.map(val => {
                val.text = val.value || '属性值';
                return val;
            });
        } else {
            item.goodsSkusCardValue = [];
        }
        return item;
    });
    skuTable.value=goodinfo.goodsSkus;
}

/**
 * 初始化单个规格项的操作方法
 * @param {Number} id - 规格卡片 ID
 * @returns {Object} 包含 tagList、inputVisable、inputVal、inputRef 及各种操作方法
 */
export function initSkuItemVal(id) {
    let tagList = skuList.value.find(val => val.id == id);
    
    // 如果找不到对应的规格卡片，返回空对象
    if (!tagList) {
        console.warn(`未找到 id 为 ${id} 的规格卡片`);
        return {
            tagList: null,
            inputVisable: ref(false),
            inputVal: ref(''),
            inputRef: ref(),
            InputBlur: async () => {},
            deleteTag: async () => {},
            editTag: async () => {},
            showInput: () => {}
        };
    }
    
    let inputVisable = ref(false);
    let inputVal = ref('');
    let inputRef = ref();
    
    /**
     * 新增规格选项值
     */
    const InputBlur = async () => {
        // 验证输入
        if (!inputVal.value || inputVal.value.trim() === '') {
            ElMessage.warning('请输入规格值');
            return;
        }
        
        try {
            let obj = {
                goods_skus_card_id: id,
                name: tagList.name,
                order: tagList.order || 0, // 使用规格卡片的 order，而不是硬编码
                value: inputVal.value.trim(),
            };
            
            let res = await insertGoodsSkusCardValueFn(obj);
            
            if (res.msg != 'ok') {
                ElMessage.error(res.msg || '添加失败');
                return;
            }
            
            // 添加到本地列表
            tagList.goodsSkusCardValue.push({
                ...res.data,
                text: inputVal.value.trim()
            });
            
            ElMessage.success('添加成功');
            inputVisable.value = false;
            inputVal.value = '';
        } catch (error) {
            console.error('添加规格值失败:', error);
            ElMessage.error('添加失败，请稍后重试');
        }
    };
    
    /**
     * 删除规格选项值
     * @param {Object} tag - 要删除的规格选项值对象
     */
    const deleteTag = async (tag) => {
        try {
            if (!tag || !tag.id) {
                ElMessage.warning('无效的规格值');
                return;
            }
            
            let res = await delGoodsSkusCardValueFn(tag.id);
            
            if (res.msg != 'ok'||!res.data) {
                ElMessage.error(res.msg || '删除失败');
                return;
            }
            
            // 从本地列表中移除
            const index = tagList.goodsSkusCardValue.findIndex(val => val.id === tag.id);
            if (index > -1) {
                tagList.goodsSkusCardValue.splice(index, 1);
            }
            
            ElMessage.success('删除成功');
        } catch (error) {
            console.error('删除规格值失败:', error);
            ElMessage.error('删除失败，请稍后重试');
        }
    };
    
    /**
     * 修改规格选项值
     * @param {String} val - 新的规格值
     * @param {Object} tag - 要修改的规格选项值对象
     */
    const editTag = async (val, tag) => {
            
            
            let obj = {
                goods_skus_card_id: tag.goods_skus_card_id,
                name:tag.name,
                order:tag.order,
                value:val,
            };
            let id =tag.id;
            
            let res = await editGoodsSkusCardValueFn(id,obj);
            
            if (res.msg != 'ok'||!res.data) {
                tag.text=tag.value;
                return
            }
            
            // 更新本地列表
            tag.value = val;
            tag.text = val;
            
    };
    
    /**
     * 控制输入框显隐并自动聚焦
     */
    const showInput = () => {
        inputVisable.value = !inputVisable.value;
        nextTick(() => {
            if (inputRef.value) {
                inputRef.value.focus();
            }
        });
    };
    
    return {
        tagList,
        inputVisable,
        inputVal,
        inputRef,
        InputBlur,
        deleteTag,
        editTag,
        showInput
    };
}
export function initSkuFn(){
    const AddTag=async()=>{
        let obj={
            goods_id:goodID.value,
            name:'规格名称',
            order:1,
            type:0,
        }
        let res=await insertGoodsSkusFn(obj)
        if(res.msg!='ok'||!res.data)return
        skuList.value.push({
            ...res.data,
             text:res.data.name,
             goodsSkusCardValue:[],
        })
    }
    const DelSku=async(id)=>{
        let res=await delGoodsSkusCardFn(id)
        if(res.msg!='ok'||!res.data)return ElMessage.error(res.msg)
        ElMessage.success(res.msg)
        let index=skuList.value.findIndex(item=>item.id==id)
        if(index!=-1)skuList.value.splice(index,1)
    }
    const Editsku=async(val)=>{ 
        let obj={
            goods_id:goodID.value,
            name:val.text,
            order:val.order,
            type:val.type,
        }
        let res=await editGoodsSkusCardFn(val.id,obj)
        if(res.msg!='ok'||!res.data){
            val.text=val.name
            return ElMessage.error(res.msg)
        }
        val.name=val.text
        ElMessage.success(res.msg)
    }
    return{
        AddTag,DelSku,Editsku
    }
}
export function initTableData(){
    const isSkuVal=computed(()=>{
        return skuList.value.filter((item)=>item.goodsSkusCardValue.length!=0)
    })
    let tableTitle=computed(()=>{
        let tablen=isSkuVal.value.length;
        let titleArr=[
                        {name:'商品规格',col:tablen,row:tablen>0?1:2},
                        {name:'市场价',row:2},
                        {name:'销售价',row:2},
                        {name:'成本价',row:2},
                        {name:'库存',row:2},
                        {name:'商品体积',row:2},
                        {name:'商品重量',row:2},
                        {name:'编码',row:2},
        ];
        return titleArr;
    })
    return{
        isSkuVal,
        tableTitle,
        skuTable,
    }
}