<template>
  <div class="hello">
    <h3>列表渲染</h3>
    <ul>
      <li v-for="(item,index) in newsList" :key="item.id">
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      newsList:[
        {
          id:1001,
          title:"今日新闻1"
        },
        {
          id:1002,
          title:"今日新闻2"
        },
        {
          id:1003,
          title:"今日新闻3"
        },
        {
          id:1004,
          title:"今日新闻4"
        }
      ]
    }
  }
}
</script>