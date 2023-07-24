<template>
  <div class="loading" v-loading="loading">

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
</style>
