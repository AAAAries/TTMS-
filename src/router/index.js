import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store/index'

const Login = () => import('../views/login.vue')
const Main = () => import('../views/main.vue')
const Message = () => import('../views/message.vue')
const Mlogin = () => import('../views/mlogin.vue')
const Play = () => import('../components/Message/play.vue')
const Screens = () => import('../components/Message/screens.vue')
const Plan = () => import('../components/Message/plan.vue')
const Staff = () => import('../components/Message/staff.vue')
const Customer = () => import("../components/Message/customer.vue")
const Count = () => import('../components/Message/count.vue')
const Detalied = () => import('../components/Message/detalied.vue')
const Smovie = () => import('../views/smovie.vue')
const Showdetail = () => import("../views/showdetail.vue")
const Buyticket = () => import("../views/buyticket.vue")
const Order = () => import("../views/order.vue")
const User = () => import("../views/user.vue")
const Personal = () => import("../views/users/personal.vue")
const Myorder = () => import("../views/users/myorder.vue")


Vue.use(VueRouter)

const routes = [
  // {
  //   path: '',
  //   redirect: '/login'
  // },
  {
    path: '',
    component: Main,
    meta: {
      title: 'TTMS'
    },
    children: [

    ]
  },

  {
    path: '/smovie',
    component: Smovie,
    meta: {
      title: '影片'
    },
  },
  {
    path: '/showdetail',
    component: Showdetail,
    meta: {
      title: '订票'
    },
  },
  {
    path: '/buyticket',
    component: Buyticket,
    meta: {
      title: '购票'
    },
  },
  {
    path: '/order',
    component: Order,
    meta: {
      title: '确认订单'
    },
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录注册'
    },
  },
  {
    path: '/user',
    component: User,
    meta: {
      title: '个人中心'
    },
    children: [
      {
        path: '',
        redirect: 'myorder'
      },
      {
        path: 'myorder',
        component: Myorder,
      },
      {
        path: 'personal',
        component: Personal,
      },
    ]
  },
  {
    path: '/mlogin',
    component: Mlogin,
    meta: {
      title: '管理员登录'
    },
  },
  {
    path: '/message',
    component: Message,
    meta: {
      title: '管理员界面'
    },
    children: [
      {
        path: '',
        redirect: 'play'
      },
      {
        path: 'play',
        component: Play,
      },
      {
        path: 'screens',
        component: Screens
      },
      {
        path: 'plan',
        component: Plan
      },
      {
        path: 'staff',
        component: Staff
      },
      {
        path: 'customer',
        component: Customer
      },
      {
        path: 'count',
        component: Count
      },
      {
        path: 'detalied',
        component: Detalied
      }
    ]
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})



router.beforeEach((to, from, next) => {
  document.title = to.matched[0].meta.title
  // console.log(to.path.split('/')[1]);
  if (to.path.split('/')[1] == 'message') {
    //未登录强制跳转到登录页
    if (to.path === '/mlogin')
      return next()
    // const tokenStr = window.localStorage.getItem('token')
    if (!store.state.UserToken) {
      // 未登录  判断页面是否要登录meta
      return next('/mlogin')
    } else {
      //用户已经登录处理权限
      if (to.path === '/message/staff') {
        if (store.state.UserToken != "0") {
          alert("权限不够")
          return next(from.path)
        }
      }
    }
  } else {
    if (to.path === '/order') {
      //判断客户是否登录
      if (!store.state.tel) {
        return next('/login')
      }
    }
    return next()
  }

  next()
})

export default router
