<template>
  <div class="hello">
    <p>{{ message }}</p>
    <ul>
      <li v-for="(item,index) in names.list" :key="index">{{ item }}</li>
    </ul>
    <button @click="clickHandle">按钮</button>
    <p>{{ msg }}</p>
  </div>
</template>

<script>

import { ref,reactive } from "vue"

export default {
  name: 'HelloWorld',
  props:{
    msg:String
  },
  // 组合式API
  setup(props,ctx) {
    // setup中没有this关键字
    console.log(ctx);
    // ref
    const message = ref("我是消息")
    // reactive
    const names = reactive({
      list:["iwen","ime","frank"]
    })

    function clickHandle(){
      // 通过message的value去修改数据
      message.value = "我是新的消息"
    }

    const msg = props.msg

    return{
      message,
      names,
      clickHandle,
      msg
    }
  }
}
</script>
