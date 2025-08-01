<template>
  <div class="hello">
    <button @click="counter += 1">点击:counter = {{ counter }}</button>
    <button @click="clickHandle">按钮</button>
    <p>{{ message }}</p>
    <button @click="say('hi')">say hi</button>
    <button @click="say('what')">say what</button>
    <ul>
      <li @click="clickItemHandle(item)" v-for="(item,index) in names" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      counter: 1,
      message:"消息通知",
      names:["iwen","ime","frank"]
    }
  },
  methods: {
    clickHandle(event) {
      // 在事件中，读取data中的属性，是需要通过this.属性
      this.message = "消息被撤回了"
      // `event` 是原生 DOM event
      console.log(event);
      event.target.innerHTML = "点击之后"
    },
    say(data){
      console.log(data);
    },
    clickItemHandle(item){
      console.log(item);
    }
  }
}
</script>
