<template>
  <el-drawer v-model="visibleModel" size="500px" direction="rtl">
    <div class="drawer">
      <!-- 插件基本信息 -->
      <div class="drawer-row base">
        <img :src="logoUrl" />

        <div class="base-info">
          <div class="base-info__name">
            {{ plugin.name }}
            <span class="base-info__version" title="版本号">{{ plugin.version }}</span>
          </div>
          <div class="base-info__desc">{{ plugin.desc }}</div>
          <div class="base-info__operate">
            <el-button
              v-if="isStore && !plugin.isDownload"
              type="primary"
              icon="el-icon-download"
              circle
              size="mini"
              title="下载插件"
            >
            </el-button>

            <el-button
              v-if="(isStore && plugin.isDownload) || isInstalled || isDev"
              type="primary"
              size="mini"
              title="启动插件"
              @click="openPlugin"
            >
              启动
            </el-button>

            <el-button v-if="isDev || isInstalled" type="danger" size="mini" title="删除插件" @click="confirmDel">
              删除
            </el-button>
          </div>
        </div>
      </div>
      <!-- 插件基本信息 -->

      <!-- 列表信息 -->
      <div v-if="isStore || isInstalled" class="drawer-row info-list">
        <div class="info-list__item">
          <div class="info-list__item-top">
            开发者
          </div>
          <div class="info-list__item-mid">
            官方
          </div>
        </div>

        <div class="info-list__item">
          <div class="info-list__item-top">
            大小
          </div>
          <div class="info-list__item-mid">
            {{ plugin.size }}
          </div>
          <div class="info-list__item-bottom">
            kb
          </div>
        </div>
      </div>
      <!-- 列表信息 -->

      <template v-if="isDev">
        <div class="drawer-row">
          <div class="drawer-row__title">
            插件ID
          </div>
          <div class="drawer-row__value">
            {{ plugin.id }}
          </div>
        </div>

        <div class="drawer-row">
          <div class="drawer-row__title">
            插件路径
          </div>
          <div class="drawer-row__value">
            {{ plugin.main }}
          </div>
        </div>

        <div class="drawer-row">
          <div class="drawer-row__title">
            操作
          </div>
          <div class="drawer-row__content">
            <template v-if="isDev">
              <el-button type="success" size="small" title="打包插件" @click="build">打包</el-button>
              <el-button type="warning" size="small" title="重新读取json配置文件并更新信息" @click="reload">
                重新加载
              </el-button>
            </template>
          </div>

          <div v-if="isDev">
            <el-button plain type="primary" size="small" title="发布插件到插件中心" @click="publishConfirm">
              发布
            </el-button>
            <el-button plain type="success" size="small" title="在文件夹中查看" @click="showInFolder">
              目录
            </el-button>
          </div>
        </div>
      </template>

      {{ plugin.readmeContent }}
    </div>
  </el-drawer>

  <Publish-Dialog v-model:visible="state.showDialog" @confirm="publish" />
</template>

<script lang="ts">
import PublishDialog from './components/publishDialog/index.vue';
import { getCurrentInstance, defineComponent, computed, reactive } from 'vue';

export default defineComponent({
  components: {
    PublishDialog
  },
  props: {
    type: String,
    visible: {
      type: Boolean,
      default: false
    },
    plugin: Object
  },
  emits: ['update:visible', 'reload', 'remove', 'publish'],
  setup(props, { emit }) {
    const { proxy }: any = getCurrentInstance();

    const plugin = computed(() => props.plugin);

    const visibleModel = computed({
      get() {
        return props.visible;
      },
      set(visible: boolean) {
        emit('update:visible', visible);
      }
    });

    const state = reactive({
      showDialog: false
    });

    const isStore = computed(() => {
      return props.type === 'store';
    });

    const isDev = computed(() => {
      return props.type === 'dev';
    });

    const isInstalled = computed(() => {
      return props.type === 'installed';
    });

    const logoUrl = computed(() => {
      return isStore.value ? plugin.value.logoUrl : plugin.value.logo;
    });

    /**
     * 打开插件
     */
    function openPlugin() {
      proxy.$ipcClient('plugin-open', plugin.value.id, isDev.value);
      visibleModel.value = false;
    }

    /**
     * 重新加载插件
     */
    async function reload() {
      const result = await proxy.$ipcClient('dev-plugin-update', plugin.value.id);
      emit('reload', result);
      proxy.$notify({
        type: 'success',
        message: '更新成功'
      });
    }

    /**
     * 打包插件
     */
    async function build() {
      await proxy.$ipcClient('dev-plugin-build', plugin.value.id);
      proxy.$notify({
        type: 'success',
        message: '打包成功'
      });
    }

    /**
     * 确认删除
     */
    async function confirmDel() {
      await proxy.$confirm('此操作将永久删除该插件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      delPlugin();
    }

    /**
     * 删除插件
     */
    async function delPlugin() {
      const event = isDev.value ? 'dev-plugin-del' : 'plugin-del';
      await proxy.$ipcClient(event, plugin.value.id);
      visibleModel.value = false;

      //  商店面板把此插件的下载按钮放开
      if (isInstalled.value) {
        proxy.$eventBus.emit('store-plugin-del', plugin.value.id);
      }

      proxy.$notify({
        type: 'success',
        message: '删除成功'
      });

      emit('remove');
    }

    /**
     * 发布确认
     */
    function publishConfirm() {
      if (plugin.value.version === plugin.value.publishVerson) {
        return proxy.$alert('发布的版本与上次发布的版本一致，请将版本号升级后再试', '提醒');
      }
      state.showDialog = true;
    }

    /**
     * 发布插件
     */
    async function publish(desc: string) {
      const result = await proxy.$ipcClientLoading('dev-plugin-publish', plugin.value.id, desc);
      emit('publish', result);
      proxy.$notify({
        type: 'success',
        message: '发布成功'
      });
    }

    /**
     * 在文件夹中查看
     */
    async function showInFolder() {
      await proxy.$ipcClient('dev-plugin-showInFolder', plugin.value.id);
    }

    return {
      state,
      isDev,
      isInstalled,
      isStore,
      logoUrl,
      visibleModel,
      openPlugin,
      confirmDel,
      build,
      reload,
      publish,
      publishConfirm,
      showInFolder
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
