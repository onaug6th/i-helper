<template>
  <el-drawer v-model="visibleModel" size="500px" direction="rtl">
    <div class="drawer">
      <!-- 插件基本信息 -->
      <div class="drawer-row base">
        <img :src="plugin.logo" />

        <div class="base-info">
          <div class="base-info__name">
            {{ plugin.name }}
            <span class="base-info__version" title="版本号">
              {{ plugin.version }}
            </span>
          </div>
          <div class="base-info__desc">{{ plugin.desc }}</div>
          <div class="base-info__operate">
            <el-button v-if="showUpdate" type="success" size="mini" title="更新插件" @click="updatePlugin">
              更新
            </el-button>

            <el-button v-if="showOpen" type="primary" size="mini" title="启动插件" @click="pluginStart">
              启动
            </el-button>

            <el-button v-if="showDelete" type="danger" size="mini" title="删除插件" @click="confirmDel">
              删除
            </el-button>

            <i v-if="isInstalled" class="iconfont icon-set" title="插件设置" @click="toggleSetting"></i>
          </div>
        </div>
      </div>
      <!-- 插件基本信息 -->

      <div class="main">
        <Plugin-setting v-if="state.showSetting" :plugin="plugin" />

        <template v-else>
          <!-- 开发模式下独有信息 -->
          <template v-if="isDev">
            <div class="drawer-row">
              <div class="drawer-row__title">
                插件ID
              </div>
              <div class="drawer-row__value" title="插件的唯一id">
                {{ plugin.id }}
              </div>
            </div>

            <div class="drawer-row">
              <div class="drawer-row__title">
                插件路径
              </div>
              <div class="drawer-row__value" title="插件的文件路径">
                {{ plugin.main }}
              </div>
            </div>

            <div class="drawer-row">
              <div class="drawer-row__title">
                操作
              </div>
              <div class="drawer-row__content">
                <el-button
                  plain
                  type="primary"
                  size="small"
                  :title="isInReview ? '插件正在审核中' : '发布插件到插件商店'"
                  :disabled="isInReview"
                  @click="publishConfirm"
                >
                  发布
                </el-button>

                <el-button
                  type="success"
                  size="small"
                  title="将插件打包为插件压缩包，压缩包能拖拽进入到面板中安装"
                  @click="build"
                >
                  打包
                </el-button>

                <el-button plain type="warning" size="small" title="重新读取json配置文件并更新信息" @click="reload">
                  重载插件
                </el-button>

                <el-button type="warning" size="small" title="修改插件读取的json路径" @click="updateJsonPath">
                  修改插件路径
                </el-button>

                <el-button plain type="success" size="small" title="在文件夹中查看" @click="showInFolder">
                  文件夹中查看
                </el-button>
              </div>
            </div>
          </template>
          <!-- 开发模式下独有信息 -->

          <!-- 列表信息 -->
          <div v-else class="drawer-row info-list">
            <div class="info-list__item">
              <div class="info-list__item-top">
                开发者
              </div>
              <div class="info-list__item-mid">
                {{ plugin.authorName }}
              </div>
            </div>

            <div class="info-list__item">
              <div class="info-list__item-top">
                大小
              </div>
              <div class="info-list__item-mid">
                {{ plugin.sizeFormat }}
              </div>
            </div>
          </div>
          <!-- 列表信息 -->

          <v-md-preview :text="plugin.readmeContent"></v-md-preview>
        </template>
      </div>
    </div>
  </el-drawer>

  <Publish-Dialog v-model:visible="state.showDialog" @confirm="publish" />

  <Register v-model:visible="state.showRegister" type="register" />
</template>

<script lang="ts">
import { getCurrentInstance, defineComponent, computed, reactive } from 'vue';
import { useStore } from 'vuex';
import useButton from './composables/useButton';
import usePlugin from './composables/usePlugin';
import PublishDialog from './components/publishDialog/index.vue';
import PluginSetting from './components/pluginSetting/index.vue';
import Register from '@render/components/register/index.vue';

export default defineComponent({
  components: {
    PublishDialog,
    PluginSetting,
    Register
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
    const store = useStore();
    const { proxy }: any = getCurrentInstance();

    const visibleModel = computed({
      get() {
        return props.visible;
      },
      set(visible: boolean) {
        emit('update:visible', visible);
      }
    });

    const state = reactive({
      showDialog: false,
      showSetting: false,
      showRegister: false
    });

    const plugin = computed(() => props.plugin);

    const userId = computed(() => store.getters.userId);

    const isStore = computed(() => {
      return props.type === 'store';
    });

    const isDev = computed(() => {
      return props.type === 'dev';
    });

    const isInstalled = computed(() => {
      return props.type === 'installed';
    });

    function toggleSetting() {
      state.showSetting = !state.showSetting;
    }

    const { showUpdate, showOpen, showDelete, isInReview } = useButton(
      {
        isStore: isStore.value,
        isDev: isDev.value,
        isInstalled: isInstalled.value
      },
      plugin
    );

    const {
      updatePlugin,
      pluginStart,
      reload,
      build,
      confirmDel,
      publishConfirm,
      publish,
      showInFolder,
      updateJsonPath
    } = usePlugin({
      plugin,
      proxy,
      visibleModel,
      isDev,
      state,
      userId,
      emit
    });

    return {
      state,
      isDev,
      isInstalled,
      isStore,
      visibleModel,

      showUpdate,
      showOpen,
      showDelete,
      isInReview,

      updatePlugin,
      pluginStart,
      reload,
      build,
      confirmDel,
      publishConfirm,
      publish,
      showInFolder,
      updateJsonPath,

      toggleSetting
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
