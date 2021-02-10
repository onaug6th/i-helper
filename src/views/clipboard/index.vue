<template>
  <div class="clipboard">
    <div class="operate">
      <el-switch
        v-model="state.isObserver"
        active-text="启用"
        :title="`点击${state.isObserver ? '关闭' : '启用'}剪贴板监听`"
        @change="isObserverChange"
      ></el-switch>

      <el-checkbox-group v-model="state.type" size="mini">
        <el-checkbox-button v-for="item in options" :label="item.value" :key="item.value">
          {{ item.label }}
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div v-for="(row, rowIndex) in state.clipboardList" class="list-row" :key="rowIndex" @click="copy(row)">
      <!-- 行内容 -->
      <div class="list-row__value">
        <span v-if="row.type === 'text'">
          {{ row.value }}
        </span>
        <img v-else-if="row.type === 'image'" :src="row.value" />
      </div>
      <!-- 行内容 -->
      <!-- 行操作 -->
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
      <!-- 行操作 -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
//  剪贴板hooks
import { getAllClipboardList, state, options, copy, del, toggleStar, isObserverChange } from './hooks/clipboard';

export default defineComponent({
  setup() {
    onBeforeMount(() => {
      getAllClipboardList();
    });

    return {
      state,
      options,
      toggleStar,
      copy,
      del,
      isObserverChange
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
