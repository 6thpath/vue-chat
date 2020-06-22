<template>
  <span
    class="message-bubble"
    :class="{ [placement]: true, active: uid === selectedUID }"
    :title="'Sent at ' + convertTimestamp(sentAt)"
    :data-uid="uid"
    :data-username="username"
    @click="select(uid)"
  >
    {{ message }}
  </span>
</template>

<script>
export default {
  Name: 'MessageBubble',
  props: {
    uid: String,
    username: String,
    message: String,
    sentAt: Number,
    placement: String,
    setSelectedUID: Function,
    selectedUID: String,
  },
  methods: {
    convertTimestamp(timestamp) {
      return `${new Date(timestamp).toLocaleDateString()} ${new Date(
        timestamp
      ).toLocaleTimeString()}`
    },
    select(uid) {
      this.setSelectedUID(uid === this.selectedUID ? '' : uid)
    },
  },
}
</script>

<style lang="less" scoped>
@import url('../assets/style/variables.less');

.message-bubble {
  font-size: 13px;
  max-width: 100%;
  word-break: break-word;

  position: relative;
  padding: 7px;
  transition: all 0.3s;

  display: block;

  &.active {
    background: @s-teal !important;
    color: @white;
  }

  &.left {
    cursor: pointer;
    float: left;
    background: @l-grey;
    border-radius: 0 5px 5px 5px;

    &:after {
      content: attr(data-username);
      word-break: keep-all;
      position: absolute;
      top: -6px;
      left: 2px;
      font-size: 8px;
      font-weight: bold;
      color: @teal;
      background: @lt-grey;
      padding: 1px 2px 0;
      border: 1px solid @white;
      border-radius: 3px;
    }
  }

  &.right {
    pointer-events: none !important;
    float: right;
    background: @l-teal;
    border-radius: 5px 0 5px 5px;

    &:after {
      content: attr(data-username);
      word-break: keep-all;

      position: absolute;
      top: -6px;
      right: 2px;
      font-size: 8px;
      font-weight: bold;
      color: @teal;
      background: @lt-grey;
      padding: 1px 2px 0;
      border: 1px solid @white;
      border-radius: 3px;
    }
  }
}
</style>
