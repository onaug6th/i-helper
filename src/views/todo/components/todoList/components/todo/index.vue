<template>
  <li :class="{ completed: todo.done, editing: editing }" class="todo">
    <input
      v-if="editing"
      v-focus="editing"
      class="edit"
      :value="todo.text"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit"
    />
    <div v-else class="view">
      <input :checked="todo.done" class="toggle" type="checkbox" @change="toggleTodo(todo)" />
      <label v-text="todo.text" @click="editing = true" />
      <button class="destroy" @click="deleteTodo(todo)" />
    </div>
  </li>
</template>

<script>
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export default {
  name: 'Todo',
  directives: {
    focus(el, binding) {
      const { value, instance } = binding;
      if (value) {
        instance.$nextTick(() => {
          el.focus();
        });
      }
    }
  },
  props: {
    todo: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      editing: false
    };
  },
  methods: {
    deleteTodo(todo) {
      this.$emit('delete-todo', todo);
    },
    editTodo({ todo, value }) {
      this.$emit('edit-todo', { todo, value });
    },
    toggleTodo(todo) {
      this.$emit('toggle-todo', todo);
    },
    doneEdit(e) {
      const value = e.target.value.trim();
      const { todo } = this;
      if (!value) {
        this.deleteTodo({
          todo
        });
      } else if (this.editing) {
        this.editTodo({
          todo,
          value
        });
        this.editing = false;
      }
    },
    cancelEdit(e) {
      e.target.value = this.todo.text;
      this.editing = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
