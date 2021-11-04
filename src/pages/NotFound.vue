<template>
  <div class="container">
    <h1>Page Not Found</h1>

    <button class="primary" v-on:click="goBack">Take me back</button>
  </div>
</template>

<style lang="less" scoped>
@import url('../assets/style/variables.less');

.container {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotFound',
  methods: {
    goBack() {
      this.$router.push(this.$store.state.username ? '/chat' : '/')
    },
  },
})
</script>
