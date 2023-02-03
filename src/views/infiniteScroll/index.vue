<template>
  <div class="scroll-container"
       id="scrollTag"
       :infinite-scroll-immediate="true"
       :infinite-scroll-delay="true"
       v-infinite-scroll="loadMore">
    <thead>
    <tr>
      <th>Month</th>
      <th>Savings</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item in list">
      <td>{{ item.name }}</td>
      <td>¥{{ item.price }}</td>
    </tr>
    </tbody>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
// 我真的是万万没有想到  这个引入的指令 v需要小写
import vInfiniteScroll from './src'

// console.log(VInfiniteScroll)

// VInfiniteScroll
// const VInfiniteScroll =VInfiniteScroll

const list: Array<{ name: string, price: number }> = reactive([])
let point = 0
const getList = () => {
  for (let i = 0; i < 10; i++) {
    list.push({
      name: '日期' + point,
      price: point
    })
    point ++
  }
}
getList()
const loadMore = () => {
  console.warn('loadMore')
  getList()
}
// onMounted(()=>{
//   // 绑定
//   const el = document.getElementById('scrollTag')
//   console.log(el)
//   if (el){
//     el.addEventListener('scroll',function (){
//       console.log('触发滚动事件')
//     })
//   }
//
// })




</script>

<style lang="scss" scoped>
.scroll-container {
  height: 500px;
  overflow: scroll;
}

td {
  line-height: 35px;
  width: 120px;
  text-align: center;
}

tbody {
}

tbody > :nth-child(2n) {
  background-color: #F0EFEFF7;
}
</style>
