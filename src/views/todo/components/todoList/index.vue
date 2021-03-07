<template>
  <section class="todoapp">
    <!-- 头部 -->
    <header class="header">
      <input class="new-todo" autocomplete="off" placeholder="添加新待办…" @keyup.enter="addTodo" />
    </header>
    <!-- 头部 -->

    <!-- 中间 -->
    <section v-show="todos.length" class="main">
      <!-- 切换选择全部 -->
      <input
        id="toggle-all"
        :checked="allChecked"
        class="toggle-all"
        type="checkbox"
        @change="toggleAll({ done: !allChecked })"
      />
      <label for="toggle-all" />
      <!-- 切换选择全部 -->

      <!-- 列表区域 -->
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggle-todo="toggleTodo"
          @edit-todo="editTodo"
          @delete-todo="deleteTodo"
        />
      </ul>
      <!-- 列表区域 -->
    </section>
    <!-- 中间 -->

    <!-- 底部 -->
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>
          {{ remaining }}
        </strong>
        待办未完成
      </span>
      <div class="footer-right">
        <ul class="filters">
          <li v-for="item in filterList" :key="item.key">
            <a :class="{ selected: visibility === item.key }" @click.prevent="visibility = item.key">
              {{ item.label }}
            </a>
          </li>
        </ul>

        <div class="operate">
          <button class="clear-completed" v-show="todos.length > remaining" @click="clearCompleted">
            清空已完成
          </button>
        </div>
      </div>
    </footer>
    <!-- 底部 -->
  </section>
</template>

<script>
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Todo from './components/todo/index.vue';

const STORAGE_KEY = 'todos';
const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.done),
  completed: todos => todos.filter(todo => todo.done)
};

const filterList = [
  {
    label: '全部',
    key: 'all'
  },
  {
    label: '进行中',
    key: 'active'
  },
  {
    label: '已完成',
    key: 'completed'
  }
];

export default {
  components: { Todo },
  data() {
    return {
      visibility: 'all',
      filterList,
      todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [{ text: '学习', done: false }]
    };
  },
  computed: {
    allChecked() {
      return this.todos.every(todo => todo.done);
    },
    filteredTodos() {
      return filters[this.visibility](this.todos);
    },
    remaining() {
      return this.todos.filter(todo => !todo.done).length;
    }
  },
  methods: {
    setLocalStorage() {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
    },
    addTodo(e) {
      const text = e.target.value;
      if (text.trim()) {
        this.todos.push({
          text,
          done: false
        });
        this.setLocalStorage();
      }
      e.target.value = '';
    },
    toggleTodo(val) {
      val.done = !val.done;
      this.setLocalStorage();
    },
    deleteTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
      this.setLocalStorage();
    },
    editTodo({ todo, value }) {
      todo.text = value;
      this.setLocalStorage();
    },
    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.done);
      this.setLocalStorage();
    },
    toggleAll({ done }) {
      this.todos.forEach(todo => {
        todo.done = done;
        this.setLocalStorage();
      });
    }
  }
};
</script>

<style lang="less">
@import './index.less';
</style>
