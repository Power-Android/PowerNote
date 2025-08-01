import { createStore } from 'vuex'
import axios from "axios"

export default createStore({
  state: {
    counter:10
  },
  getters:{
    getCounter(state){
      return state.counter > 0 ? state.counter : "counter数据异常"
    }
  },
  mutations:{
    addCounter(state,num){
      state.counter += num
    }
  },
  // 为异步操作所准备的
  actions:{
    asyncAddCounter({ commit }){
      axios.get("http://iwenwiki.com/api/generator/list.php")
      .then(res =>{
        // 一下是使用方式
        commit("addCounter",res.data[0])
      })
    }
  }
})
