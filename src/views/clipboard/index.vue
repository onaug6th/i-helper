<template>
  <div class="clipboard">
    <div v-for="(row, rowIndex) in clipboardList" class="list-row" :key="rowIndex" @click="copy(row)">
      <div class="list-row__value">
        <span v-if="row.type === 'text'">
          {{ row.value }}
        </span>
        <i v-else-if="row.type === 'image'" class="el-icon-picture"></i>
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
        <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="del(rowIndex)"></el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
//  接口
import { ClipboardItem } from './interface';
//  剪贴板hooks
import { clipboardList, copy, del } from './hooks/clipboard';

export default defineComponent({
  setup() {
    /**
     * 切换收藏
     * @param row
     */
    function toggleStar(row: ClipboardItem) {
      row.star = !row.star;
    }

    return {
      clipboardList,
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
