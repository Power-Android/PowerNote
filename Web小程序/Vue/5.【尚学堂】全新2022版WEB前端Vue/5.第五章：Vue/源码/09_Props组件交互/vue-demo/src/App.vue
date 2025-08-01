<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <MyComponent :title="title" :age="age" :names="names"/>
</template>

<script>

import MyComponent from './components/MyComponent.vue'

export default {
  name: 'App',
  data(){
    return{
      title:"我是一个标题",
      age:20,
      names:["iwen","ime","frank"]
    }
  },
  components: {
    MyComponent
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
