<template>
  <DivWrapper class="scroll-container"
  id="scrollTag"
  :infinite-scroll-delay="true"
  :infinite-scroll-distance="100"
  :infinite-scroll-disabled="disabled"
  v-infinite-scroll="loadMore">
<!--  <div class="scroll-container"-->
<!--       id="scrollTag"-->
<!--       :infinite-scroll-delay="true"-->
<!--       :infinite-scroll-distance="100"-->
<!--       :infinite-scroll-disabled="disabled"-->
<!--       v-infinite-scroll="loadMore">-->
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
<!--  </div>-->
  </DivWrapper>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive} from "vue";
// 我真的是万万没有想到  这个引入的指令 v需要小写
import vInfiniteScroll from './src'
import DivWrapper from '@/components/DivWrapper.vue'
// 获取列表加载
const list: Array<{ name: string, price: number }> = reactive([])
let point = 0
const getList = () => {
  for (let i = 0; i < 30; i++) {
    list.push({
      name: '日期' + point,
      price: point
    })
    point ++
  }
}
getList()

const loadMore = () => {
  // console.warn('loadMore')
  console.log('毁掉函数的this')
  getList()
}

// 使用disabled 关闭滚动加载
// const noMore.value =

const disabled = computed(()=> list.length >= 150)
</script>

<style lang="scss" scoped>
.scroll-container {
  //height: 500px;
  //overflow: scroll;
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
