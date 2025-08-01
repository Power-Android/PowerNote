<template>
  <div class="hello">
    <swiper :modules="modules" :pagination="{ clickable: true }">
      <swiper-slide>
        <img src="../assets/1.jpeg" alt="">
      </swiper-slide>
      <swiper-slide>
        <img src="../assets/1.jpeg" alt="">
      </swiper-slide>
      <swiper-slide>
        <img src="../assets/1.jpeg" alt="">
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';

export default {
  name: 'HelloWorld',
  data(){
    return{
      modules: [ Pagination ]
    }
  },
  components:{
    Swiper,
    SwiperSlide
  }
}
</script>

<style scoped>

img{
  width: 100%;
}

</style>
