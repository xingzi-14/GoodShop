<template>
  <div class='homeindexnav'>
    <el-row :gutter="20">
      <el-col :span="3" @click="goToPage(item.path)" v-for="(item,index) in NavList" :key="index">
        <el-card shadow="hover">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <br>
          <span>{{item.title}}</span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { reactive } from 'vue';
  
  
  const router = useRouter();
  
  const NavList = reactive([
    {
      icon: "Picture",
      title: "图库管理",
      path: "/image/list"
    },
    {
      icon: "User",
      title: "管理员管理",
      path: "/manager/list"
    },
    {
      icon: "ShoppingCart",
      title: "商品管理",
      path: "/goods/list"
    },
    {
      icon: "Tickets",
      title: "订单管理",
      path: "/order/list"
    },
    {
      icon: "Star",
      title: "评价管理",
      path: "/comment/list"
    },
    {
      icon: "Edit",
      color: "text-green-500",
      title: "公告管理",
      path: "/notice/list"
    },
    {
      icon: "Present",
      title: "优惠券管理",
      path: "/coupon/list"
    },
    {
      icon: "Setting",
      title: "分销设置",
      path: "/setting/base"
    }
  ]);
  const goToPage = (path) => {
    router.push(path);
  };
  </script>
  

<style scoped lang="less">
.homeindexnav{
  margin-top: 20px;
}

.el-card{
  display: flex;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  text-align: center;
  .el-icon{
    font-size: 22px;
    padding-bottom: 10px;
  }
}

  
  </style>