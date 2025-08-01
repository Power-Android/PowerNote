<template>
  <div class="hello">
    <input type="text" v-model.lazy="username">
    <input type="text" v-model.trim="password">
    <p>{{ username }},{{ password }}</p>
    <button @click="clickGetUserName">获取用户名</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      username: "",
      password: ""
    }
  },
  methods: {
    clickGetUserName() {
      console.log(this.username);
    }
  }
}
</script>