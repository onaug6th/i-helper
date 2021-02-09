<template>
  <div class="clipboard">
    <div v-for="(row, rowIndex) in state.clipboardList" class="list-row" :key="rowIndex" @click="copy(row)">
      <div class="list-row__value">
        <span v-if="row.type === 'text'">
          {{ row.value }}
        </span>
        <img v-else-if="row.type === 'image'" :src="row.value" />
      </div>
      <div class="list-row__operate">
        <el-button
          type="warning"
          circle
          size="mini"
          :title="row.star ? '取消收藏' : '收藏'"
          :icon="row.star ? 'el-icon-star-on' : 'el-icon-star-off'"
          @click.stop="toggleStar(row)"
        ></el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          size="mini"
          title="删除"
          @click.stop="del(row, rowIndex)"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
//  剪贴板hooks
import { getAllClipboardList, state, copy, del, toggleStar } from './hooks/clipboard';

export default defineComponent({
  setup() {
    onBeforeMount(() => {
      getAllClipboardList();
    });

    return {
      state,
      toggleStar,
      copy,
      del
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
