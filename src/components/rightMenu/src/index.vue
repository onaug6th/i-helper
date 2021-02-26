<template>
  <div>
    菜单
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { IRightMenuListItem } from './types';

export default defineComponent({
  name: 'rightMenu',
  props: {
    message: {
      type: Array as PropType<Array<IRightMenuListItem>>,
      default: ''
    },
    onClose: {
      type: Function as PropType<() => void>,
      required: true
    },
    zIndex: { type: Number, default: 0 }
  },
  emits: ['destroy'],
  setup(props, { emit }) {
    const visible = ref(false);

    function close() {
      visible.value = false;
      emit("destroy");
    }

    return {
      visible,
      close
    };
  }
});
</script>
