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
      form: {
        name: '',
        email: '',
        password: '',
        rePassword: ''
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
      }
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
    typeModel: {
      get() {
        return this.type;
      },
      set(type: string) {
        this.$emit('update:type', type);
      }
    },
    isLogin() {
      return this.typeModel === 'login';
    }
  },
  methods: {
    ...mapActions({ setShortcutKey: 'app/setShortcutKey' }),

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
        if (this.form.rePassword !== '') {
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
      } else if (value !== this.form.password) {
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
     * 表单提交
     */
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.register();
        }
      });
    },

    /**
     * 确认
     */
    async register() {
      const user = await this.$ipcClient('user-register', this.form);

      if (user) {
        this.$notify({
          type: 'success',
          message: '注册成功'
        });

        this.$emit('close');
        this.visibleModel = false;
      }
    }
  }
};
