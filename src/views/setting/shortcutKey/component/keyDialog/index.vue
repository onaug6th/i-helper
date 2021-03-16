<template>
  <el-dialog title="请按下新的快捷键" v-model="model" width="50%">
    <span>{{ keyStr }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      keyStr: ''
    };
  },
  computed: {
    model: {
      get() {
        return this.modelValue;
      },
      set(modelValue: boolean) {
        this.$emit('update:modelValue', modelValue);
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
      this.model = false;
    },
    confirm() {
      this.close();
    }
  }
};
</script>

<style lang="less" scoped></style>
