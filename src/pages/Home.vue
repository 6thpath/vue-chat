<template>
  <div class="container">
    <form class="form-container" v-on:submit="submit">
      <h2>Enter your name</h2>
      <p class="error-message" v-show="error">{{ error }}</p>
      <input
        autofocus
        class="username"
        :class="{ primary: !error, danger: error }"
        ref="usernameRef"
        v-model="username"
        @input="onUsernameChange"
        maxlength="15"
        minlength="2"
      />
      <button type="submit" class="primary" :disabled="!!error">Join</button>
    </form>
  </div>
</template>

<style lang="less" scoped>
@import url('../assets/style/variables.less');

.container {
  width: 100%;
  height: 100%;
  background: @bg;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .form-container {
    width: 350px;
    background: @white;
    border-radius: 15px;
    padding: 10px 20px;
    box-shadow: 0 0 10px 2px @grey;

    display: flex;
    flex-direction: column;
    align-items: center;

    .error-message {
      height: 13px;
      color: @red;
      margin: 0;
      transition: all 0.3s;
    }

    .username {
      width: 100%;

      &.danger {
        margin-top: 2px;
      }
    }

    button {
      margin: 10px 0 0 0;
    }
  }
}
</style>

<script>
export default {
  name: 'Home',
  data() {
    return {
      error: '',
      username: '',
    }
  },
  methods: {
    onUsernameChange() {
      if (this.error) {
        this.error = ''
      }
    },

    submit(e) {
      e.preventDefault()

      if (!this.username.trim().length) {
        this.error = 'Invalid name'
        return this.$refs.usernameRef.focus()
      }

      this.$store.commit('setUsername', this.username)
      this.$router.push('/chat')
    },
  },
  beforeMount() {
    if (this.$store.state.username) {
      this.$router.push('/chat')
    }
  },
}
</script>
