<template>
  <div class="home" @dragover.prevent="drapOver">
    <!-- 操作遮罩层 -->
    <div v-show="state.showShade" class="shade" @drop.prevent="drop" @dragleave.prevent="drapLeave">
      <i class="iconfont icon-close" @click="drapLeave"></i>
      <div class="shade-content">
        <div v-if="state.currentFile.name" class="file-name">{{ state.currentFile.name }} {{ state.shadeText }}</div>

        <div class="operate">
          <el-button v-if="fileType.isJson" type="primary" size="small" @click="addDev">添加到开发者插件</el-button>
          <el-button v-if="fileType.isZip" type="primary" size="small" @click="install">安装插件</el-button>
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
            <img v-if="menuItem.link" class="sidebar-img" :src="menuItem.link" />
            <i v-else :class="`el-icon-${menuItem.icon}`"></i>
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
              <div class="transition">
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
import { getCurrentInstance, defineComponent, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@render/components/header/index.vue';

export default defineComponent({
  name: 'main',
  components: {
    Header
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const router = useRouter();

    const state: {
      showShade: boolean;
      shadeText: string;
      currentFile: {
        name?: string;
        type?: string;
        file?: File;
      };
    } = reactive({
      //  展示操作遮罩层
      showShade: false,
      shadeText: '',
      //  当前文件
      currentFile: {}
    });

    const menuList: Array<{
      label: string;
      path: string;
      icon?: string;
      link?: string;
    }> = [
      {
        label: '我的插件',
        path: '/installed',
        link: 'https://github.githubassets.com/images/icons/emoji/round_pushpin.png'
      },
      {
        label: '插件商店',
        path: '/store',
        link: 'http://sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/juejin-extension-icon.4b79fb4.png'
      },
      {
        label: '开发者',
        path: '/dev',
        link: 'https://github.githubassets.com/images/icons/emoji/octocat.png'
      },
      {
        label: '设置',
        path: '/setting/common',
        link: 'https://github.githubassets.com/images/icons/emoji/wrench.png'
      }
    ];

    const fileType = computed(() => {
      const type = state.currentFile.type;
      return {
        isJson: type === 'json',
        isZip: type === 'zip'
      };
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
              state.shadeText = '是一个插件配置文件';
            }
            break;
          }
          case 'zip': {
            state.currentFile = {
              name: fileName,
              type: 'zip',
              file: files[0]
            };
            state.shadeText = '可能是一个插件';
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

    /**
     * 关闭遮罩
     */
    function closeShade() {
      state.showShade = false;
    }

    /**
     * 添加开发者插件
     */
    async function addDev() {
      await proxy.$ipcClient('dev-plugin-add', state.currentFile.file.path);
      proxy.$notify({
        type: 'success',
        message: '添加开发者插件成功'
      });
      proxy.$eventBus.emit('dev-updateList');
      closeShade();
    }

    /**
     * 安装插件
     */
    async function install() {
      await proxy.$ipcClient('plugin-install', state.currentFile.file.path);
      proxy.$notify({
        type: 'success',
        message: '安装插件成功'
      });
      proxy.$eventBus.emit('installed-update');
    }

    return {
      menuList,
      menuTo,
      state,
      fileType,
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
