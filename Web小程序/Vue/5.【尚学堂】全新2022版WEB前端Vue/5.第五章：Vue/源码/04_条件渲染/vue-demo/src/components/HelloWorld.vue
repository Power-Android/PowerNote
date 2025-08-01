<template>
  <div class="hello">
    <p v-if="flag">我是孙猴子</p>
    <p v-else>你是傻猴子</p>
    <p v-show="flag">你真的是那只孙猴子么</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data(){
    return{
      flag:false
    }
  }
}
</script>
