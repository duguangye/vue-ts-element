<template>
  <thead>
  <tr>
    <th>Month</th>
    <th>Savings</th>
  </tr>
  </thead>
  <tbody>
  <tr v-for="item in list">
    <td>{{item.name}}</td>
    <td>¥{{item.price}}</td>
  </tr>
  </tbody>
</template>

<script setup lang="ts">
import {reactive} from "vue";

const list: Array<{ name: string, price: number }> = reactive([])
for (let i = 0; i < 10; i++) {
  list.push({
    name: '日期' + i,
    price: i
  })
}

</script>

<style  scoped>
td{
  line-height: 25px;
  width: 120px;
}
</style>
