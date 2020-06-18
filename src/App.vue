<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
@import url('./assets/style/normalize.css');
@import url('./assets/style/variables.less');
@import url('./assets/style/global.less');

html,
body {
  width: 100%;
  height: 100%;
  user-select: none;
  position: relative;

  /* width */
  ::-webkit-scrollbar {
    width: 4px;
    height: 8px;
    background: transparent !important;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
    height: 3px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
}

* {
  box-sizing: border-box;
}

#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: @text;
}
</style>
