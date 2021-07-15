import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    get UserToken() {
      return localStorage.getItem('token')
    },
    set UserToken(value){
      localStorage.setItem('token',value)
    },
    //用户是否登录
    tel:sessionStorage.getItem('tel')?sessionStorage.getItem('tel'):'',
    //影票
    tickets:sessionStorage.getItem('tickets')?JSON.stringify(sessionStorage.getItem('tickets')):'',
  },
  mutations:{
    LOGIN_IN(state, token) {
      state.UserToken = token;
    },
    LOGIN_OUT(state){
      state.UserToken = "";
    },
    //更改登录用户
    addtel(state,tel){
      state.tel = tel
      sessionStorage.setItem('tel', tel)
      // console.log(sessionStorage.getItem('tel'));
    },
    deletetel(state){
      state.tel = ''
      sessionStorage.removeItem('tel');
    },
    updatetickets(state,tickets){
      state.tickets = tickets
      sessionStorage.setItem('tickets',JSON.stringify(tickets))
    }
  },
  // actions: {
  // },
  // modules: {
  // }
})
