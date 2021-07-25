/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { mapActions } from 'vuex';

export default {
  name: 'register',
  props: {
    type: {
      type: String,
      default: 'register'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      registerForm: {
        name: '',
        email: '',
        password: '',
        rePassword: ''
      },
      loginForm: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: this.validatePass, trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: this.validateRePass, trigger: 'blur' }
        ]
      },

      typeModel: this.type
    };
  },
  computed: {
    title() {
      return this.typeModel === 'register' ? '注册账户' : '登录账户';
    },
    visibleModel: {
      get() {
        return this.visible;
      },
      set(visible: boolean) {
        this.$emit('update:visible', visible);
      }
    },
    isLogin() {
      return this.typeModel === 'login';
    }
  },
  methods: {
    ...mapActions({ setUser: 'app/setUser' }),

    /**
     * 切换类型
     * @param type
     */
    switchType(type: string) {
      this.typeModel = type;
    },

    /**
     * 校验密码
     * @param rule
     * @param value
     * @param callback
     */
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.registerForm.rePassword !== '') {
          this.$refs.ruleForm.validateField('rePassword');
        }
        callback();
      }
    },

    /**
     * 校验重复输入密码
     * @param rule
     * @param value
     * @param callback
     */
    validateRePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    },

    /**
     * 关闭弹窗
     */
    close() {
      this.$emit('close');
      this.visibleModel = false;
    },

    /**
     * 注册提交
     */
    registerSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.register();
        }
      });
    },

    /**
     * 注册
     */
    async register() {
      const user = await this.$ipcClient('user-register', { ...this.registerForm });

      if (user) {
        this.$notify({
          type: 'success',
          message: '注册成功'
        });

        this.login(user);

        this.close();
      }
    },

    /**
     * 登录提交
     */
    loginSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.login({ ...this.loginForm });
        }
      });
    },

    /**
     * 登录
     * @param data
     */
    async login(data) {
      await this.$ipcClient('user-login', data);

      this.$notify({
        type: 'success',
        message: '登录成功'
      });

      this.setUser();
      this.close();
    }
  }
};
