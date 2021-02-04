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
import { clipboard, nativeImage } from 'electron';
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
    const clipboardList: Array<ClipboardItem> = reactive([
      {
        value: '内容',
        type: 'text',
        star: true
      }
    ]);

    //  从列表复制出来的内容
    let copyFromList: any;

    /**
     * 剪贴板新增剪贴项
     * @param value
     * @param type
     */
    function clipboardListAdd(value: any, type: string) {
      const newestCopy = clipboardList[0];
      //  与最新复制的内容不同
      const isDiffNewest = newestCopy.type !== type || newestCopy.value !== value;
      //  与上一个从列表复制的内容不同
      const isDiffCopyFromList = value !== copyFromList;

      if (isDiffNewest && isDiffCopyFromList) {
        if (type === 'image') {
          value = value.toDataURL();
        }

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
     * @param row
     */
    function copy(row: ClipboardItem) {
      const { value, type } = row;
      if (type === 'text') {
        clipboard.writeText(value);
      } else {
        clipboard.writeImage(nativeImage.createFromDataURL(value));
      }
      copyFromList = row.value;
      ElMessage('复制成功');
    }

    /**
     * 切换收藏
     * @param row
     */
    function toggleStar(row: ClipboardItem) {
      row.star = !row.star;
    }

    /**
     * 删除
     * @param rowIndex
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
