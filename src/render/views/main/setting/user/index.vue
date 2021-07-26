<template>
  <div class="user">
    <div class="user-info">
      <template v-if="userId">
        <img class="user-info__avatar" :src="user.avatar || state.avatar" alt="" />
        <div class="user-info__name">{{ user.name }}</div>
        <div class="user-info__email">{{ user.email }}</div>
        <div class="user-info__operate">
          <!-- <el-button size="mini" @click="editInfo">修改信息</el-button> -->
          <el-button type="danger" size="mini" @click="quit">退出账号</el-button>
        </div>
      </template>
      <template v-else>
        <el-button type="primary" size="mini" @click="state.showLogin = true">登录账户</el-button>
      </template>
    </div>
  </div>

  <Register v-model:visible="state.showLogin" type="login" />
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { computed, defineComponent, getCurrentInstance, reactive } from 'vue';
import Register from '@render/components/register/index.vue';

export default defineComponent({
  name: 'user',
  components: {
    Register
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const store = useStore();
    const getters = store.getters;

    const state = reactive({
      showLogin: false,
      avatar: 'https://onaug6th-1253668581.cos.ap-guangzhou.myqcloud.com/common/92249761857029110.jpg'
    });

    const user = computed(() => getters.user);
    const userId = computed(() => getters.userId);

    /**
     * 修改个人信息
     */
    function editInfo() {
      debugger;
    }

    /**
     * 退出账号
     */
    async function quit() {
      await proxy.$ipcClientLoading('user-quit');

      //  获取账户信息
      store.dispatch('app/setUser');

      proxy.$notify({
        type: 'success',
        message: '退出账号成功'
      });
    }

    return {
      editInfo,
      quit,
      state,
      userId,
      user
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
