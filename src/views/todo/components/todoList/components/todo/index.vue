<template>
  <li :class="{ completed: todo.done, editing: editing }" class="todo">
    <div class="view">
      <input :checked="todo.done" class="toggle" type="checkbox" @change="toggleTodo(todo)" />
      <label @dblclick="editing = true" v-text="todo.text" />
      <button class="destroy" @click="deleteTodo(todo)" />
    </div>
    <input
      v-show="editing"
      class="edit"
      :value="todo.text"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit"
    />
  </li>
</template>

<script>
export default {
  name: 'Todo',
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
