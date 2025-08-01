<template>
  <div class="hello">
    <h3>学习Vue：模板语法</h3>
    <p>{{ message }}</p>
    <div>{{ rawHtml }}</div>
    <div v-html="rawHtml"></div>
    <div :id="dynamicId"></div>
    <p>{{ num+10 }}</p>
    <p>{{ flag ? "孙猴子" : "傻猴子" }}</p>
  </div>
</template>

<script>
export default {
  // innerHTML  innerText
  name: 'HelloWorld',
  data() {
    return {
      message: "学习Vue",
      rawHtml:"<a href='http://www.itbaizhan.com'>百战</a>",
      dynamicId:10001,
      num:10,
      flag:false
    }
  }
}
</script>