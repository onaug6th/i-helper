import * as api from '@/main/api/user';
import appStorageService from '../appStorage/appStorage.service';

interface RegisterData {
  name: string;
  email: string;
  password: number;
}

interface LoginData {
  email: string;
  password: number;
}

class userService {
  storageName = 'user';

  //  更新信息
  user: any = {};

  /**
   * 应用初始化时执行
   */
  appOnReady() {
    this.user = appStorageService.getData(this.storageName);
  }

  /**
   * 获取用户
   * @returns
   */
  getUser() {
    return this.user;
  }

  /**
   * 注册
   * @param data
   */
  async register(data: RegisterData) {
    try {
      return await api.register(data);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * 登录
   */
  async login(data: LoginData) {
    try {
      const user = await api.login(data);
      this.user = user;
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new userService();
