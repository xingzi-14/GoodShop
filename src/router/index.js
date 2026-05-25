import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [ 
      {
        path: '/',
        redirect: '/login'
      },
  {
    path: '/login',
    name: 'LoginCom',
    component: () => import('../views/LoginCom.vue')
  },
  {
    path: '/admin',
    name: 'AdminIndex',
    component: () => import('../views/AdminIndex.vue'),
    children :[
      {
        path:"/",
        redirect:{
          name :"HomeIndex"
        },
 
      },
      {
        path:"index",
        meta :{title:'后台首页'},
        name:'HomeIndex',
        component :()=>import("@/views/HomeIndex.vue")
      },
      {
        path:"goods/list",
        meta :{title:'商品管理'},
        name:'GoodsList',
        component :()=>import("@/views/GoodsList.vue")
      },
      {
        path:"category/list",
        meta :{title:'分类管理'},
        name:'CategoryList',
        component :()=>import("@/views/CategoryList.vue")
      },
      {
        path:"skus/list",
        meta :{title:'规格管理'},
        name:'SkusList',
        component :()=>import("@/views/SkusList.vue")
      },
      {
        path:"user/list",
        meta :{title:'用户管理'},
        name:'UserList',
        component :()=>import("@/views/UserList.vue")
      },
      {
        path:"image/list",
        meta :{title:'图库管理'},
        name:'PicList',
        component :()=>import("@/views/PicList.vue")
      },    
      {
        path:"manager/list",
        meta :{title:'管理员管理'},
        name:'ManagerCom',
        component :()=>import("@/views/ManagerCom.vue")
      },
      {
        path:"access/list",
        meta :{title:'权限管理'},
        name:'RulesCom',
        component :()=>import("@/views/RulesCom.vue")
      },  
      {
        path:"role/list",
        meta :{title:'角色管理'},
        name:'RoleCom',
        component :()=>import("@/views/RoleCom.vue")
      },    
      {
        path:"coupon/list",
        meta :{title:'优惠券管理'},
        name:'CouponCom',
        component :()=>import("@/views/CouponCom.vue")
      },  
      {
        path:"order/list",
        meta :{title:'订单管理'},
        name:'OrderCom',
        component :()=>import("@/views/OrderCom.vue")
      },   
      {
        path:"comment/list",
        meta :{title:'评论管理'},
        name:'CommentCom',
        component :()=>import("@/views/CommentCom.vue")
      },
      {
        path:"distribution/index",
        meta :{title:'分销员管理'},
        name:'DistributionAgent',
        component :()=>import("@/views/DistributionAgent.vue")
      },
      {
        path:"distribution/setting",
        meta :{title:'分销设置'},
        name:'DistributionSettings',
        component :()=>import("@/views/DistributionSettings.vue")
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

router.beforeEach(async (to, from) => {
  const tokenStr = window.sessionStorage.getItem('token');

  
  if (!tokenStr && to.path !== '/login') {
    return '/login'
  }

  // 有 token 但去登录页 → 跳首页
  if (tokenStr && to.path === '/login') {
    return '/admin'
  }
})

export default router