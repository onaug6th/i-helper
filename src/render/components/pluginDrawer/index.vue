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
          <el-button type="primary" size="small" title="启动开发者插件" @click="openPlugin">启动</el-button>
          <template v-if="isDev">
            <el-button type="primary" plain size="small" title="打包插件" @click="build">打包</el-button>
            <el-button type="warning" size="small" title="重新读取json配置文件并更新信息" @click="reload">
              重新加载
            </el-button>
          </template>
          <el-button type="danger" plain size="small" title="删除插件" @click="confirmDel">删除</el-button>
        </div>
        <div>
          <el-button type="success" size="small" title="发布插件到插件中心" @click="publishConfirm">发布</el-button>
        </div>
      </div>
    </div>
  </el-drawer>

  <Publish-Dialog v-model:visible="state.showDialog" @confirm="publish" />
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import PublishDialog from './components/publishDialog/index.vue';
import { getCurrentInstance, defineComponent, computed, reactive } from 'vue';

export default defineComponent({
  components: {
    PublishDialog
  },
  props: {
    isDev: Boolean,
    visible: {
      type: Boolean,
      default: false
    },
    plugin: Object
  },
  emits: ['update:visible', 'reload', 'remove'],
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

    /**
     * 打开插件
     */
    function openPlugin() {
      ipcRenderer.send('plugin-open', plugin.value.id, props.isDev);
      visibleModel.value = false;
    }

    /**
     * 重新加载插件
     */
    function reload() {
      ipcRenderer
        .invoke('dev-plugin-update', plugin.value.id)
        .then(plugin => {
          emit('reload', plugin);

          proxy.$notify({
            type: 'success',
            message: '更新成功'
          });
        })
        .catch(error => {
          proxy.$notify({
            type: 'error',
            message: `更新失败${error}`
          });
        });
    }

    /**
     * 打包插件
     */
    function build() {
      ipcRenderer.invoke('dev-plugin-build', plugin.value.id).then(() => {
        proxy.$notify({
          type: 'success',
          message: '打包成功'
        });
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
    function delPlugin() {
      ipcRenderer.invoke(props.isDev ? 'dev-plugin-del' : 'plugin-del', plugin.value.id);
      emit('remove');
      visibleModel.value = false;
      proxy.$notify({
        type: 'success',
        message: '删除成功'
      });
    }

    /**
     * 发布确认
     */
    function publishConfirm() {
      state.showDialog = true;
    }

    /**
     * 发布插件
     */
    function publish(desc: string) {
      ipcRenderer.invoke('dev-plugin-publish', plugin.value.id, desc);
    }

    return {
      state,
      visibleModel,
      openPlugin,
      confirmDel,
      build,
      reload,
      publish,
      publishConfirm
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
