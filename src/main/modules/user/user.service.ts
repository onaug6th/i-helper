import * as api from '@/main/api/user';

interface RegisterData {
  name: string;
  email: string;
  password: number;
}

class userService {
  //  更新信息
  userInfo: any = {};

  /**
   * 应用初始化时执行
   */
  appOnReady() {
    debugger;
  }

  /**
   * 注册
   * @param data
   */
  async register(data: RegisterData) {
    try {
      await api.register(data);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new userService();
