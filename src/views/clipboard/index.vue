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
import { ElMessage } from 'element-plus';
import { defineComponent, reactive } from 'vue';
import { clipboard } from 'electron';
import clipboardObserver from '@/utils/clipboardObserver';

//  剪贴项接口
interface ClipboardItem {
  type: string;
  value: any;
  star: boolean;
}

export default defineComponent({
  setup() {
    //  观察剪贴板变化
    clipboardObserver({
      textChange(value: string) {
        clipboardListAdd(value, 'text');
      },
      imageChange(value: string) {
        clipboardListAdd(value, 'image');
      }
    });

    //  剪贴板记录列表
    const clipboardList: Array<any> = reactive([
      {
        value: '内容',
        type: 'text',
        star: true
      }
    ]);

    //  上一个从列表复制的内容
    let lastReadOnListValue: any;

    /**
     * 剪贴板新增剪贴项
     */
    function clipboardListAdd(value: string, type: string) {
      //  与最新复制的内容不同
      const isDiffLastOne = clipboardList[0].value !== value;
      //  与上一个从列表复制的内容不同
      const isDiffLastCopy = value !== lastReadOnListValue;

      if (isDiffLastOne && isDiffLastCopy) {
        const clipboardItem: ClipboardItem = {
          value,
          type,
          star: false
        };

        clipboardList.unshift(clipboardItem);
      }
    }

    /**
     * 复制
     */
    function copy(row: ClipboardItem) {
      const fn = row.type === 'text' ? clipboard.writeText : clipboard.writeImage;
      lastReadOnListValue = row.value;
      fn(row.value);
      ElMessage('复制成功');
    }

    /**
     * 切换收藏
     */
    function toggleStar(row: ClipboardItem) {
      row.star = !row.star;
    }

    /**
     * 删除
     */
    function del(rowIndex: number) {
      clipboardList.splice(rowIndex, 1);
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
