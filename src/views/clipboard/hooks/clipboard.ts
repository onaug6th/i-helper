//  消息提醒
import { ElNotification } from 'element-plus';
//  vue响应式模块
import { reactive, computed } from 'vue';
//  剪贴板模块及类型
import { clipboard, nativeImage } from 'electron';
//  剪贴板观察者
import clipboardObserver from '@/utils/clipboardObserver';
//  剪贴板数据库
import clipboardDB from '@/dataBase/clipboard';
//  接口
import { ClipboardItem } from '../interface';

interface State {
  keyWord: string;
  clipboardList: Array<ClipboardItem>;
  isObserver: boolean;
  type: Array<string>;
}

const state: State = reactive({
  keyWord: '',
  clipboardList: [],
  isObserver: true,
  type: ['text', 'image']
});

//  列表使用的数据
const clipboardData = computed(() => {
  const { clipboardList, type, keyWord } = state;
  //  关键字转小写
  const lowerCaseKeyWord = keyWord.toLowerCase();

  return clipboardList.filter(item => {
    //  类型包含
    const typeInclude = type.includes(item.type);
    //  可以显示收藏
    const isStar = type.includes('star') ? item.star : true;
    //  只选择收藏
    const starOnly = type.length === 1 && type.includes('star');
    //  关键字匹配
    const keyWordMatch = lowerCaseKeyWord
      ? item.type === 'text'
        ? item.value.toLowerCase().includes(lowerCaseKeyWord)
        : false
      : true;

    if (!keyWordMatch) {
      return false;
    }

    if (starOnly) {
      return item.star;
    } else {
      return typeInclude && isStar;
    }
  });
});

//  选择项数据
const optionDatas = [
  {
    value: 'text',
    label: '文本'
  },
  {
    value: 'image',
    label: '图片'
  },
  {
    value: 'star',
    label: '收藏'
  }
];

/**
 * 禁用选择项
 * @param option
 */
function disabledCheckButton(option: { value: string }) {
  return state.type.length === 1 && state.type.includes(option.value);
}

/**
 * 解析行内容返回html
 * @param row
 * @returns { string }
 */
function rowValue(row: ClipboardItem) {
  const { type, value } = row;
  const { keyWord } = state;
  if (type === 'text') {
    if (keyWord) {
      const style = 'style="color: #409EFF;"';
      return value.replace(new RegExp(keyWord, 'gi'), ($1: string) => `<span ${style}>${$1}</span>`);
    } else {
      return value;
    }
  } else {
    return value;
  }
}

//  监听配置
const observerConfig = {
  textChange(value: string) {
    clipboardListAdd(value, 'text');
  },
  imageChange(value: string) {
    clipboardListAdd(value, 'image');
  }
};

//  观察剪贴板变化
const observerItem = clipboardObserver(observerConfig);

/**
 * 是否监听变化
 * @param value
 */
function isObserverChange(value: boolean) {
  value ? observerItem.start() : observerItem.stop();
}

//  从列表中复制出的内容
let copyFromList: string;

/**
 * 获取剪贴板记录列表
 */
function getAllClipboardList() {
  clipboardDB._db
    ?.find({})
    .sort({ createdAt: -1 })
    .exec((e, d) => {
      state.clipboardList = d as ClipboardItem[];
    });
}

/**
 * 剪贴板记录列表插入新数据
 * @param clipboardItem
 */
async function insertClipboardList(clipboardItem: ClipboardItem) {
  const result = await clipboardDB.insert(clipboardItem);
  return result;
}

/**
 * 剪贴板新增剪贴项
 * @param value
 * @param type
 */
async function clipboardListAdd(value: any, type: string) {
  //  当前进入函数的剪贴板内容
  const currentValue = type === 'image' ? value.toDataURL() : value;

  //  与列表点击复制出来的内容不同
  const isDiffCopyFromList = currentValue !== copyFromList;
  //  列表最新复制的内容
  const newestCopy = state.clipboardList[0];
  //  与列表最新复制的内容不同
  const isDiffNewest = newestCopy ? newestCopy.type !== type || newestCopy.value !== currentValue : true;

  if (isDiffNewest && isDiffCopyFromList) {
    const clipboardItem: ClipboardItem = {
      value: currentValue,
      type,
      star: false
    };

    const result = await insertClipboardList(clipboardItem);
    state.clipboardList.unshift(result);
  }
}

/**
 * 剪贴板数据库移除某项
 * @param clipboardItem
 */
async function removeClipboardList(query: any) {
  const result = await clipboardDB.remove(query);
  return result;
}

/**
 * 点击删除按钮
 * @param row
 */
function del(row: any, rowIndex: number) {
  state.clipboardList.splice(rowIndex, 1);
  removeClipboardList({ _id: row._id });
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
  ElNotification({
    type: 'success',
    message: '复制成功'
  });
}

/**
 * 切换收藏
 * @param row
 */
function toggleStar(row: any) {
  row.star = !row.star;
  updateClipboardList(
    {
      _id: row._id
    },
    {
      $set: {
        star: row.star
      }
    }
  );
  ElNotification({
    type: 'success',
    message: `${row.star ? '收藏' : '取消收藏'}成功`
  });
}

/**
 * 剪贴板数据库更新某项
 * @param clipboardItem
 */
async function updateClipboardList(query: any, options: any) {
  const result = await clipboardDB.update(query, options);
  return result;
}

export {
  state,
  optionDatas,
  clipboardData,
  getAllClipboardList,
  copy,
  del,
  rowValue,
  toggleStar,
  isObserverChange,
  disabledCheckButton
};
