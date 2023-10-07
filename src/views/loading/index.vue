<template>
  <div class="loading" v-loading="loading">
<!--    <div class="el-loading-mask"></div>-->

  </div>
</template>

<script setup>
import vLoading from "./src/directive.ts";
import {ref} from "vue";

const loading = ref(true)
</script>

<style lang="scss" scoped>

.loading{
  width: 100px;
  height: 300px;
  background-color: rgba(255, 192, 203, 0.1);
}
//.el-loading-mask{
//  position: absolute;
//  z-index: 2000;
//  background-color: #fff;
//  margin: 0;
//  top: 0;
//  right: 0;
//  bottom: 0;
//  left: 0;
//  transition: opacity 0.3s;
//}
</style>
