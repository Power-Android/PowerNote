<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h3>home</h3>
    <p> count={{ $store.getters.getCounter }}</p>
    <p>{{ getCounter }}</p>
    <button @click="addClickHandle">增加</button>
    <button @click="addAsyncClickHandle">异步增加</button>
  </div>
</template>

<script>

import { mapGetters,mapMutations,mapActions } from "vuex"

export default {
  name: 'HomeView',
  components: {
  },
  computed:{
    ...mapGetters(["getCounter"])
  },
  methods:{
    ...mapMutations(["addCounter"]),
    ...mapActions(["asyncAddCounter"]),
    addClickHandle(){
      // 固定调用方式
      // this.$store.commit("addCounter",15)
      this.addCounter(20)
    },
    addAsyncClickHandle(){
      // this.$store.dispatch("asyncAddCounter");
      this.asyncAddCounter();
    }
  }
}
</script>
