import { createRouter, createWebHashHistory } from 'vue-router'
// import store from '../store';

const routes = [
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

// ========================
// 🔥 修复：用 return 替代 next()（警告消失！）
// ========================
router.beforeEach(async (to, from,next) => {
  const tokenStr = window.sessionStorage.getItem('token');

  // 1. 没token 且 不是登录页 → 拦截跳登录
  if (!tokenStr && to.path !== '/login') {
    alert('请先登录')
    return next('/login') // 替代 next('/')
  }

  // 2. 有token 且 去登录页 → 跳后台
  if (tokenStr && to.path === '/login') {
    return next('/admin') // 替代 next('/admin')
  }

  // 3. 有token → 获取用户信息
  // if (tokenStr) {
  //   try {
  //     await store.dispatch("ActionGetUserInfo")
  //   } catch (err) {
  //     // 获取失败 = token失效，清除并跳登录
  //     window.sessionStorage.clear()
  //     return '/' // 替代 next('/')
  //   }
  // }
next()
  // 4. 其他情况 → 直接放行（不需要写任何 return，替代 next()）
})

export default router