<template>
  <div class="client-list-container">
    <ul class="client-list">
      <li class="loading-indicator" v-show="isLoading">Loading...</li>

      <li
        v-for="{ id, name, joinedAt } in clients"
        @click="
          id !== currenUserId ? setSelectedUserId(client === selectedUserId ? '' : id) : undefined
        "
        :key="id"
        :class="{
          [id]: true,
          active: id === selectedUserId,
          unselectable: id === currenUserId,
        }"
      >
        <ClientName :joinedAt="joinedAt">
          {{ name }}{{ id === currenUserId ? '(You)' : '' }}
        </ClientName>
      </li>
    </ul>
  </div>
</template>

<script>
import ClientName from './ClientName'

export default {
  name: 'UserList',
  components: {
    ClientName,
  },
  props: {
    isLoading: Boolean,
    clients: Array,
    selectedUserId: String,
    setSelectedUserId: Function,
  },
  computed: {
    currenUserId() {
      return this.$store.state.id
    },
  },
}
</script>

<style lang="less" scoped>
@import url('../assets/style/variables.less');

.client-list-container {
  width: 30%;
  height: 100%;
  border-right: 2px solid @l-grey;
  padding: 5px 0 5px 5px;

  .client-list {
    width: 100%;
    height: 100%;
    scroll-behavior: smooth;
    overflow-y: auto;

    li {
      cursor: pointer;
      width: 98%;
      font-size: 14px;
      border-radius: 3px;
      padding: 2px 4px;
      margin: 0 0 3px 0;
      overflow-x: hidden;
      transition: 0.3s;

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
        cursor: default !important;
        background: @lt-teal;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
