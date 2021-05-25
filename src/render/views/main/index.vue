<template>
  <div class="home" @dragover.prevent="drapOver">
    <!-- 操作遮罩层 -->
    <div v-show="state.showShade" class="shade" @drop.prevent="drop" @dragleave.prevent="drapLeave">
      <div class="shade-content">
        <div v-if="state.currentFile.name" class="file-name">{{ state.currentFile.name }} 可能是一个插件</div>
        <div class="operate">
          <el-button v-if="isJson" type="primary" size="small" @click="addDev">添加到开发者</el-button>
          <el-button v-if="isZip" type="primary" size="small" @click="install">安装插件</el-button>
        </div>
      </div>
    </div>
    <!-- 操作遮罩层 -->

    <Header />

    <div class="home-content">
      <!-- 左侧侧边栏 -->
      <div class="home-content__sidebar">
        <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="true">
          <el-menu-item
            v-for="(menuItem, menuIndex) in menuList"
            :index="String(menuIndex + 1)"
            :key="menuIndex"
            @click="menuTo(menuItem.path)"
          >
            <i :class="`el-icon-${menuItem.icon}`"></i>
            <template #title>{{ menuItem.label }}</template>
          </el-menu-item>
        </el-menu>
      </div>
      <!-- 左侧侧边栏 -->

      <!-- 右侧主体内容 -->
      <div class="home-content__main">
        <el-scrollbar>
          <router-view v-slot="{ Component }">
            <transition name="main-fade">
              <div class="transition" :key="routeName">
                <keep-alive>
                  <component :is="Component" />
                </keep-alive>
              </div>
            </transition>
          </router-view>
        </el-scrollbar>
      </div>
      <!-- 右侧主体内容 -->
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { defineComponent, ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '@render/components/header/index.vue';
import { ElNotification } from 'element-plus';

export default defineComponent({
  components: {
    Header
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const routeName = ref(route.name);

    const state: {
      showShade: boolean;
      currentFile: {
        name?: string;
        type?: string;
        file?: File;
      };
    } = reactive({
      //  展示操作遮罩层
      showShade: false,
      //  当前文件
      currentFile: {}
    });

    const menuList: Array<{
      label: string;
      path: string;
      icon: string;
    }> = [
      {
        label: '插件',
        path: '/pluginList',
        icon: 'potato-strips'
      },
      {
        label: '开发者',
        path: '/dev',
        icon: 'potato-strips'
      },
      {
        label: '设置',
        path: '/setting/common',
        icon: 'setting'
      }
    ];

    const isJson = computed(() => {
      return state.currentFile.type === 'json';
    });

    const isZip = computed(() => {
      return state.currentFile.type === 'zip';
    });

    /**
     * 跳转路由
     */
    function menuTo(path: string) {
      router.push({
        path
      });
    }

    /**
     * 文件放下
     */
    function drop(event) {
      state.showShade = true;

      //  拖拽进来的文件
      const files = Array.prototype.slice.call(event.dataTransfer.files);
      //  网络路径
      const uriList = event.dataTransfer.getData('text/uri-list');
      //  拖拽进来的文字
      const text = event.dataTransfer.getData('text/plain');

      uriList;
      text;

      if (files.length === 1) {
        const fileName = files[0].name;
        const reg = /([^\\/]+)\.([^\\/]+)/i;
        reg.test(fileName);
        const fileType = RegExp.$2;

        switch (fileType) {
          case 'json': {
            if (fileName === 'plugin.json') {
              state.currentFile = {
                name: 'plugin.json',
                type: 'json',
                file: files[0]
              };
            }
            break;
          }
          case 'zip': {
            state.currentFile = {
              name: fileName,
              type: 'zip',
              file: files[0]
            };
            break;
          }
        }
      }
    }

    /**
     * 拖拽经过
     */
    function drapOver() {
      state.showShade = true;
    }

    /**
     * 拖拽离开
     */
    function drapLeave() {
      closeShade();
    }

    function closeShade() {
      state.showShade = false;
    }

    function addDev() {
      ipcRenderer.invoke('dev-plugin-add', state.currentFile.file.path);
      ElNotification({
        type: 'success',
        message: '添加开发者插件成功'
      });
      closeShade();
    }

    function install() {
      debugger;
    }

    return {
      menuList,
      routeName,
      menuTo,
      state,
      isJson,
      isZip,
      drop,
      drapOver,
      drapLeave,
      addDev,
      install
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
