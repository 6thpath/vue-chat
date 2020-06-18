<template>
  <div class="container">
    <h2>Page Not Found</h2>

    <button class="primary" v-on:click="back">Take me back</button>
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
export default {
  name: 'NotFound',
  methods: {
    back() {
      if (this.$root.$data.username) this.$router.push('/chat')
      else this.$router.push('/')
    }
  }
}
</script>
