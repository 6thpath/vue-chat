<template>
  <div class="container">
    <div class="main">
      <div class="header">
        <span class="bullet red" />
        <span class="bullet orange" />
        <span class="bullet green" />
        <span class="address-bar"><span class="scheme">https://</span>vue-chat.com </span>
      </div>
      <div class="body">
        <div class="user-list">
          <ul>
            <li
              v-for="user in Object.keys(users)"
              @click="setSelectedUID(user === selectedUID ? '' : user)"
              :key="user"
              :class="{
                [user]: true,
                active: selectedUID === user,
                unselectable: user === socket.id
              }"
              :title="
                users[user].leftAt
                  ? 'Left at ' + convertTimestamp(users[user].leftAt)
                  : 'Joined at ' + convertTimestamp(users[user].joinedAt)
              "
            >
              <span
                class="status"
                :class="{
                  on: typeof users[user].online === 'boolean' && users[user].online,
                  off: !users[user].online
                }"
              />
              <span class="username"
                >{{ users[user].name }}{{ user === socket.id ? '(You)' : '' }}</span
              >
            </li>
          </ul>
        </div>
        <div class="chat-window">
          <div class="messages">
            <ul ref="msgCtnRef" v-on:scroll="handleScroll">
              <li v-for="message in messages" :key="message.key + message.uid">
                <MessageBubble
                  :uid="message.uid"
                  :username="message.username"
                  :message="message.message"
                  :sentAt="message.sentAt"
                  :placement="message.uid === socket.id ? 'right' : 'left'"
                  :setSelectedUID="setSelectedUID"
                  :selectedUID="selectedUID"
                />
              </li>
            </ul>
          </div>
          <form class="message-input" v-on:submit="send">
            <input class="primary" v-model="message" placeholder="Type a message..." autofocus />
            <button class="primary" type="submit" :disabled="!message.trim().length">
              <img class="icon-send" src="../assets/send.svg" width="11" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

import MessageBubble from '@/components/MessageBubble.vue'

// Constants
const SET_NAME = 'set-name'
const USER_LIST = 'user-list'
const MESSAGE = 'message'
const MESSAGES = 'messages'

export default {
  name: 'Chat',
  components: {
    MessageBubble
  },
  data() {
    return {
      socket: null,
      users: {},
      messages: [],
      total: 0,
      message: '',
      selectedUID: '',
      nearlyBottom: true
    }
  },
  methods: {
    convertTimestamp(timestamp) {
      return `${new Date(timestamp).toLocaleDateString()} ${new Date(
        timestamp
      ).toLocaleTimeString()}`
    },
    handleScroll() {
      const { msgCtnRef } = this.$refs
      if (msgCtnRef.scrollTop === 0 && this.total > this.messages.length) {
        this.socket.emit(MESSAGES, { offset: this.messages.length, limit: 10 })
        msgCtnRef.scrollTop = msgCtnRef.scrollTop + 400
      }

      if (msgCtnRef.scrollHeight - msgCtnRef.offsetHeight - msgCtnRef.scrollTop < 100) {
        this.nearlyBottom = true
      } else {
        this.nearlyBottom = false
      }
    },
    scrollToEnd() {
      if (this.$refs.msgCtnRef?.scrollTo) {
        this.$refs.msgCtnRef.scrollTo(0, 1000000)
      }
    },
    setSelectedUID(uid) {
      this.selectedUID = uid
    },
    send(e) {
      e.preventDefault()

      this.socket.emit(MESSAGE, { message: this.message, key: +new Date() })
      this.message = ''
    }
  },
  beforeMount() {
    if (!this.$root.$data.username) this.$router.push('/')
  },
  mounted() {
    if (this.$root.$data.username) {
      const socket = io(process.env.VUE_APP_BACKEND_URL, {
        path: '/chat',
        reconnection: false
      })

      socket.on('connect', () => {
        this.socket = socket
        // Set name
        socket.emit(SET_NAME, this.$root.$data.username)

        // Get users
        socket.emit(USER_LIST)
        socket.on(USER_LIST, (users) => {
          this.users = users
        })

        // Get messages
        socket.emit(MESSAGES, { offset: this.messages.length, limit: 10 })
        socket.on(MESSAGES, ({ messages, total }) => {
          if (!this.messages.length) setTimeout(this.scrollToEnd, 0)
          this.messages = [...messages, ...this.messages]
          this.total = total
        })

        socket.on(MESSAGE, (message) => {
          if (message.uid === this.socket.id || this.nearlyBottom) setTimeout(this.scrollToEnd, 0)
          this.messages.push(message)
          this.total += 1
        })

        // socket.on('reconnect', () => {
        //   socket.emit(USER_LIST)
        //   socket.emit(MESSAGES, { offset: this.messages.length, limit: 10 })
        // })

        socket.on('connect_error', () => {
          this.$router.push('/notfound')
        })

        socket.on('disconnect', () => {
          this.$router.push('/notfound')
        })
      })
    }
  },
  watch: {
    selectedUID(newS) {
      if (newS) {
        const el = this.$el.getElementsByClassName(newS)[0]
        el.scrollIntoView()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/style/variables.less');

.container {
  width: 100%;
  height: 100%;
  background: @bg;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    width: 500px;
    background: @white;
    border: 1px solid @black;
    border-radius: 5px;
    text-align: center;
  }

  .main {
    width: 500px;
    height: 400px;
    background: @white;
    border: 1px solid @grey;
    border-radius: 8px;
    box-shadow: 0 0 10px 2px @grey;
    overflow: hidden;

    display: flex;
    flex-direction: column;

    .header {
      width: 100%;
      height: 35px;
      background: @l-grey;
      padding: 3px 10px;

      display: flex;
      align-items: center;

      .bullet {
        width: 11px;
        height: 11px;
        display: inline-block;
        background: @grey;
        border-radius: 100%;
        margin-right: 5px;
        transition: all 0.3s;

        &.red {
          background: @red;

          &:hover {
            background: @s-red;
          }
        }

        &.orange {
          background: @orange;

          &:hover {
            background: @s-orange;
          }
        }

        &.green {
          background: @green;

          &:hover {
            background: @s-green;
          }
        }
      }

      .address-bar {
        cursor: text;
        width: 60%;
        background: @white;
        border: 1px solid transparent;
        border-radius: 4px;
        padding: 6px 14px 4px;
        margin-left: 10px;
        vertical-align: middle;
        transition: all 0.3s;

        display: inline-block;

        &:hover {
          border-color: @teal;
        }

        .scheme {
          color: @green;
        }
      }
    }

    .body {
      height: ~'calc(100% - 35px)';

      display: flex;

      .user-list,
      .chat-window {
        height: 100%;
      }

      .user-list {
        width: 30%;
        padding: 5px 0 5px 5px;
        border-right: 2px solid @l-grey;

        ul {
          width: 100%;
          height: 100%;
          scroll-behavior: smooth;
          overflow-y: auto;

          &::-webkit-scrollbar {
            width: 0;
          }

          &:hover {
            &::-webkit-scrollbar {
              width: 4px;
            }
          }

          li {
            cursor: pointer;
            width: 98%;
            font-size: 14px;
            border-radius: 3px;
            padding: 2px 4px;
            margin-bottom: 3px;
            overflow-x: hidden;
            transition: all 0.3s;

            display: flex;
            align-items: center;
            justify-content: flex-start;

            &:hover {
              background: @l-teal;
            }

            &.active {
              color: @white;
              background: @s-teal;
            }

            &.unselectable {
              cursor: unset !important;
              pointer-events: none;
              background: @lt-teal;
            }

            .status {
              width: 8px;
              height: 8px;
              background: @grey;
              border-radius: 100%;
              margin: 0 4px 0 0;

              display: inline-block;

              &.on {
                background: @green;
              }

              &.off {
                background: @grey;
              }
            }

            .username {
              max-width: ~'calc(100% - 12px)';
              overflow: hidden;
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }

      .chat-window {
        width: 70%;

        > .messages {
          width: 100%;
          height: ~'calc(100% - 30px)';

          > ul {
            width: 100%;
            height: 100%;
            overflow-y: auto;
            scroll-behavior: smooth;
            scroll-snap-type: y mandatory;

            > li {
              width: 100%;
              position: relative;
              padding: 3px 4px;
              margin: 3px 0;

              float: left;
            }
          }
        }

        .message-input {
          width: 100%;
          height: 30px;
          background: @l-grey;
          padding: 2px 3px 2px 2px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          input {
            width: ~'calc(100% - 30px)';
          }

          button {
            min-width: 27px;
            height: 23px;
            font-size: 10px;
            background: @white;
            border-color: @grey;

            display: flex;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
