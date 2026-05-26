import { nextTick, ref } from "vue";
import { insertGoodsSkusCardValueFn, delGoodsSkusCardValueFn, editGoodsSkusCardValueFn } from "../api/goods";
import { ElMessage } from 'element-plus';

export const goodID = ref(0);
export const skuList = ref([]);

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
        try {
            if (!tag || !tag.id) {
                ElMessage.warning('无效的规格值');
                return;
            }
            
            if (!val || val.trim() === '') {
                ElMessage.warning('规格值不能为空');
                return;
            }
            
            let obj = {
                id: tag.id,
                value: val.trim(),
                name: tagList.name,
                order: tag.order || 0
            };
            
            let res = await editGoodsSkusCardValueFn(obj);
            
            if (res.msg != 'ok') {
                ElMessage.error(res.msg || '修改失败');
                return;
            }
            
            // 更新本地列表
            tag.value = val.trim();
            tag.text = val.trim();
            
            ElMessage.success('修改成功');
        } catch (error) {
            console.error('修改规格值失败:', error);
            ElMessage.error('修改失败，请稍后重试');
        }
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