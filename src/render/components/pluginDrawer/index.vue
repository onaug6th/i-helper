<template>
  <el-drawer v-model="visibleModel" :title="plugin.name" size="40%" direction="rtl">
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
        <div>
          <el-button type="primary" size="small" title="启动开发者插件" @click="openPlugin">启动</el-button>
          <template v-if="isDev">
            <el-button type="success" size="small" title="打包插件" @click="build">打包</el-button>
            <el-button type="warning" size="small" title="重新读取json配置文件并更新信息" @click="reload">
              重新加载
            </el-button>
          </template>
          <el-button type="danger" plain size="small" title="删除插件" @click="confirmDel">删除</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { getCurrentInstance, defineComponent, computed } from 'vue';

export default defineComponent({
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
    const { ctx }: any = getCurrentInstance();

    const plugin = computed(() => props.plugin);

    const visibleModel = computed({
      get() {
        return props.visible;
      },
      set(visible: boolean) {
        emit('update:visible', visible);
      }
    });

    /**
     * 打开插件
     */
    function openPlugin() {
      ipcRenderer.send('plugin-open', plugin.value.id, props.isDev);
    }

    /**
     * 重新加载插件
     */
    function reload() {
      ipcRenderer
        .invoke('dev-plugin-update', plugin.value.id)
        .then(plugin => {
          emit('reload', plugin);

          ctx.$notify({
            type: 'success',
            message: '更新成功'
          });
        })
        .catch(error => {
          ctx.$notify({
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
        ctx.$notify({
          type: 'success',
          message: '打包成功'
        });
      });
    }

    /**
     * 确认删除
     */
    function confirmDel() {
      ctx
        .$confirm('此操作将永久删除该插件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          delPlugin();
        });
    }

    /**
     * 删除插件
     */
    function delPlugin() {
      ipcRenderer.invoke(props.isDev ? 'dev-plugin-del' : 'plugin-del', plugin.value.id);
      emit('remove');
      visibleModel.value = false;
      ctx.$notify({
        type: 'success',
        message: '删除成功'
      });
    }

    return {
      visibleModel,
      openPlugin,
      confirmDel,
      build,
      reload
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
