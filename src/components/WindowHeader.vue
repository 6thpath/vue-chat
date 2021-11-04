<template>
  <div class="window-header">
    <div class="control-panel">
      <div class="bullet red" />
      <div class="bullet orange" />
      <div class="bullet green" />
    </div>

    <div class="address-bar">
      <div class="url">
        <span class="scheme">https://</span>
        <span>github.com/6thpath/vue-chat</span>
      </div>

      <div class="utilities">
        <div><IconCopy /></div>
        <div><IconExport /></div>
      </div>
    </div>
  </div>
</template>

<script>
import IconCopy from '@/assets/icons/copy.svg'
import IconExport from '@/assets/icons/export.svg'

export default {
  name: 'WindowHeader',
  components: {
    IconCopy,
    IconExport,
  },
}
</script>

<style lang="less" scoped>
@import url('../assets/style/variables.less');

.window-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 6px 6px 6px 16px;
  background: @l-grey;

  .control-panel {
    display: flex;
    gap: 5px;

    .bullet {
      cursor: pointer;
      width: 10px;
      height: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: @grey;
      border-radius: 100%;
      transition: 0.3s;

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
  }

  .address-bar {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 2px 6px 2px 14px;
    background: @lt-grey;
    transition: 0.3s;

    &:hover {
      border-color: @teal;
      background: @white;

      .utilities > div {
        opacity: 1;
      }
    }

    .url {
      cursor: text;
      line-height: 22px;
      font-size: 16px;
      font-weight: 500;

      .scheme {
        color: @green;
      }
    }

    .utilities {
      display: flex;
      align-items: center;
      gap: 8px;

      > div {
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        background: transparent;
        opacity: 0;
        transition: 0.15s;

        &:hover {
          background: @l-grey;
        }

        > svg {
          width: 12px;
          height: 12px;
        }
      }
    }
  }
}
</style>
