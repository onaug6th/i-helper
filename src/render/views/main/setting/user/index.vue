<template>
  <div class="user">
    <el-button size="mini" @click="state.showLogin = true">登录账户</el-button>
    <div class="user-info">
      {{ getters.user }}
      <img class="user-info__avatar" :src="state.avatar" alt="" />
      <div class="user-info__name">{{ state.userName }}</div>
      <div class="user-info__email">{{ state.email }}</div>
      <div class="user-info__operate">
        <el-button size="mini" @click="editInfo">修改信息</el-button>
        <el-button type="danger" size="mini">退出账号</el-button>
      </div>
    </div>
  </div>

  <register v-model:visible="state.showLogin" type="login" />
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, getCurrentInstance, reactive } from 'vue';
import Register from '@render/components/register/index.vue';

export default defineComponent({
  name: 'user',
  components: {
    Register
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const getters = useStore().getters;

    const state = reactive({
      showLogin: false,
      user: getters.user,
      avatar: 'https://onaug6th-1253668581.cos.ap-guangzhou.myqcloud.com/common/92249761857029110.jpg',
      userName: 'onaug6th',
      email: 'onaug6th@qq.com'
    });

    /**
     * 更新设置
     * @param val
     * @param type
     */
    async function checkLatestVersion() {
      const { canUpdate } = await proxy.$ipcClientLoading('check-latest-version');

      if (!canUpdate) {
        proxy.$notify({
          type: 'success',
          message: '当前已经是最新版本了'
        });
      }
    }

    /**
     * 修改个人信息
     */
    function editInfo() {
      debugger;
    }

    return {
      checkLatestVersion,
      editInfo,
      state,
      getters
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
