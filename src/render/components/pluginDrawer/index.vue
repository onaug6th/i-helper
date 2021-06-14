<template>
  <el-drawer v-model="visibleModel" size="40%" direction="rtl" :title="plugin.name">
    <div class="drawer">
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
          版本号
        </div>
        <div class="drawer-row__value">
          {{ plugin.version }}
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
          <el-button
            v-if="isDev || isInstalled || plugin.isDownload"
            type="primary"
            size="small"
            title="启动开发者插件"
            @click="openPlugin"
          >
            启动
          </el-button>

          <template v-if="isDev">
            <el-button type="success" size="small" title="打包插件" @click="build">打包</el-button>
            <el-button type="warning" size="small" title="重新读取json配置文件并更新信息" @click="reload">
              重新加载
            </el-button>
          </template>

          <el-button v-if="isDev || isInstalled" type="danger" plain size="small" title="删除插件" @click="confirmDel">
            删除
          </el-button>
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
