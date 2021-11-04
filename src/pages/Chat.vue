<template>
  <div class="container">
    <div class="main">
      <WindowHeader />

      <div class="body">
        <ClientList
          :isLoading="loading"
          :clients="clients"
          :selectedUserId="selectedUID"
          :setSelectedUserId="setSelectedUID"
        />

        <div class="right-section">
          <ul ref="msgCtnRef" class="message-box" v-on:scroll="handleScroll">
            <li v-show="loading">Loading...</li>
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
import { io } from 'socket.io-client'

import WindowHeader from '@/components/WindowHeader.vue'
import ClientList from '@/components/ClientList.vue'
import MessageBubble from '@/components/MessageBubble.vue'

const events = {
  GET_CLIENTS: 'get-clients',
}

export default {
  name: 'Chat',
  components: {
    WindowHeader,
    ClientList,
    MessageBubble,
  },
  data() {
    return {
      loading: true,
      socket: null,
      clients: [],
      messages: [],
      total: 0,
      message: '',
      selectedUID: '',
      nearlyBottom: true,
    }
  },
  methods: {
    handleScroll() {
      const {
        msgCtnRef,
        msgCtnRef: { scrollTop, offsetHeight, scrollHeight },
      } = this.$refs

      if (scrollTop === 0 && this.total > this.messages.length) {
        this.socket.emit(MESSAGES, { offset: this.messages.length, limit: 10 })
        msgCtnRef.scrollTop = scrollTop + 400
      }

      if (scrollHeight - offsetHeight - scrollTop < 100) {
        this.nearlyBottom = true
      } else this.nearlyBottom = false
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
    },
  },
  beforeMount() {
    if (!this.$store.state.username) {
      this.$router.push('/')
    } else {
      const socket = io(process.env.VUE_APP_BACKEND_URL, {
        path: '/ws',
        reconnection: true,
      })

      socket.on('connect', () => {
        this.loading = false
        this.socket = socket
        this.$store.commit('setId', socket.id)

        // Set name
        // socket.emit(events.SET_NAME, this.$store.state.username)

        socket.emit(events.GET_CLIENTS)
        socket.on(events.GET_CLIENTS, (clients) => {
          this.clients = clients
        })

        // Get messages
        // socket.emit(events.MESSAGES, { offset: this.messages.length, limit: 10 })
        // socket.on(events.MESSAGES, ({ messages, total }) => {
        //   if (!this.messages.length) setTimeout(this.scrollToEnd, 0)
        //   this.messages = [...messages, ...this.messages]
        //   this.total = total
        // })

        // socket.on(events.MESSAGE, (message) => {
        //   if (message.uid === this.socket.id || this.nearlyBottom) setTimeout(this.scrollToEnd, 0)
        //   this.messages.push(message)
        //   this.total += 1
        // })

        // socket.on('connect_error', () => {
        //   this.$router.push('/notfound')
        // })

        // socket.on('disconnect', () => {
        //   this.$router.push('/notfound')
        // })
      })
    }
  },
  watch: {
    selectedUID(newS) {
      if (newS) {
        const elm = this.$el.getElementsByClassName(newS)[0]
        if (elm) elm.scrollIntoView()
      }
    },
  },
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

  .main {
    width: 600px;
    height: 500px;
    background: @white;
    border: 1px solid @grey;
    border-radius: 8px;
    box-shadow: 0 0 10px 2px @grey;
    overflow: hidden;

    display: flex;
    flex-direction: column;

    @media screen and (max-width: 600px) {
      width: 96%;
    }

    @media screen and (max-height: 500px) {
      height: 90%;
    }

    .body {
      width: 100%;
      height: ~'calc(100% - 35px)';

      display: flex;

      .right-section {
        height: 100%;
      }

      .right-section {
        width: 70%;

        > .message-box {
          width: 100%;
          height: ~'calc(100% - 30px)';
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
