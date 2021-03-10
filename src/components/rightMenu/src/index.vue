<template>
  <div class="right-menu" ref="rightMenu" v-clickoutside="close">
    <div v-for="(menuItem, menuIndex) in list" class="menu-item" :key="menuIndex" @click="menuClick(menuItem)">
      <span>{{ menuItem.text }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, PropType, nextTick } from 'vue';
import { IRightMenuListItem } from './types';
import clickoutside from '@/directives/clickoutside';

export default defineComponent({
  name: 'rightMenu',
  directives: {
    clickoutside
  },
  props: {
    event: {
      type: MouseEvent,
      required: true
    },
    list: {
      type: Array as PropType<Array<IRightMenuListItem>>,
      default: ''
    },
    onClose: {
      type: Function as PropType<() => void>
    },
    zIndex: { type: Number, default: 0 }
  },
  emits: ['destroy'],
  setup(props, { emit }) {
    let rightMenu: Ref<HTMLDivElement | null> = ref(null);

    function show() {
      setPosition();
    }

    function setPosition() {
      const { clientX: x, clientY: y } = props.event;
      let menu = rightMenu.value;

      menu.style.left = '-9999px';
      menu.style.top = '-9999px';

      nextTick(() => {
        //  菜单宽度
        let menuWidth = menu.offsetWidth;
        //  菜单高度
        let menuHeight = menu.offsetHeight;
        //  容器宽度，减去内边距20像素
        let clientWidth = document.documentElement.clientWidth - 20;
        //  容器高度，减去内边距20像素
        let clientHeight = document.documentElement.clientHeight - 20;

        // 初始值
        let _x = x;
        let _y = y;

        //  菜单超出底部
        if (y + menuHeight > clientHeight) {
          _y = y - menuHeight;
        }

        //  菜单超出右侧
        if (x + menuWidth > clientWidth) {
          _x = x - menuWidth / 2;
        }
        menu.style.left = `${_x}px`;
        menu.style.top = `${_y}px`;
      });
    }

    function menuClick(menuItem: IRightMenuListItem) {
      menuItem.handler();
      close();
    }

    function close() {
      emit('destroy');
    }

    onMounted(() => {
      show();
    });

    return {
      rightMenu,
      show,
      menuClick,
      close
    };
  }
});
</script>

<style lang="less" scoped>
.right-menu {
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0px 0px 10px #8ba09b;
  position: fixed;
  border-radius: 4px;
  left: 50px;
  top: 120px;
  display: block;
}

.menu-item {
  text-align: left;
  font-size: 13px;
  color: #000;
  height: 36px;
  line-height: 36px;
  transition: 0.3s;
  padding: 0 20px;
  display: flex;
  white-space: nowrap;
}
.menu-item * {
  cursor: pointer;
}
.menu-item:hover {
  background-color: #f4f8f7;
  cursor: pointer;
}

.menu-item img {
  width: 20px;
  height: 20px;
  margin-top: 7px;
  margin-right: 10px;
}
.menu-item span {
  font-size: 13px;
}
</style>
