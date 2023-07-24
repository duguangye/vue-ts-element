<template>
  <main>
    <router-link to="/infiniteScrollTable">无限滚动的table</router-link>
    <router-link to="/loading">loading指令</router-link>
  </main>
</template>

<script setup lang="ts">
const onClick = () => {
  setTimeout(()=>{
    window.open('https://ss.cods.org.cn/isearch')

  },0)
}
</script>

<style>
a {
  display: block;
}
</style>
