//  消息提醒
import { ElMessage } from 'element-plus';
//  vue响应式模块
import { reactive, onBeforeMount } from 'vue';
//  剪贴板模块及类型
import { clipboard, nativeImage } from 'electron';
//  剪贴板观察者
import clipboardObserver from '@/utils/clipboardObserver';
//  剪贴板数据库
import clipboardDB from '@/dataBase/clipboard';
//  接口
import { ClipboardItem } from '../interface';

//  剪贴板记录列表
let clipboardList: Array<ClipboardItem> = reactive([
  {
    value: '内容',
    type: 'text',
    star: true
  }
]);

//  从列表中复制出的内容
let copyFromList: any;

/**
 * 获取剪贴板记录列表
 */
function getAllClipboardList() {
  clipboardDB._db
    ?.find({})
    .sort({ updatedAt: -1 })
    .exec((e, d) => {
      clipboardList = d as ClipboardItem[];
    });
}

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
 * 点击行复制
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
 * 删除
 * @param rowIndex
 */
function del(rowIndex: number) {
  clipboardList.splice(rowIndex, 1);
}

//  观察剪贴板变化
clipboardObserver({
  textChange(value: string) {
    clipboardListAdd(value, 'text');
  },
  imageChange(value: string) {
    clipboardListAdd(value, 'image');
  }
});

onBeforeMount(() => {
  getAllClipboardList();
});

export { clipboardList, copy, del };
