<template>
  <div class="client-name" :title="title">
    <slot />
  </div>
</template>

<script>
import { convertTimeAgo } from '@/utils/date'

const autoUpdateIntervalInSecond = 60

export default {
  name: 'ClientName',
  props: {
    joinedAt: Number,
  },
  data() {
    return {
      updater: undefined,
      title: '',
    }
  },
  methods: {
    updateTitle() {
      this.title = `Joined ${convertTimeAgo(this.$prop.joinedAt)}`
    },

    startUpdater() {
      this.updater = setInterval(() => {
        this.updateTitle()
      }, autoUpdateIntervalInSecond * 1000)
    },

    stopUpdater() {
      if (this.updater) {
        clearInterval(this.updater)
        this.updater = undefined
      }
    },
  },

  mounted() {
    this.updateTitle()
    this.startUpdater()
  },

  beforeUnmount() {
    this.stopUpdater()
  },
}
</script>

<style lang="less" scoped>
@import url('../assets/style/variables.less');

.client-name {
  max-width: ~'calc(100% - 12px)';
  position: relative;
  overflow: hidden;

  &::before {
    width: 8px;
    height: 8px;
    position: absolute;
    left: 0;
    margin: 0 4px 0 0;
    border-radius: 100%;
    background: @grey;
    background: @green;
  }
}
</style>
