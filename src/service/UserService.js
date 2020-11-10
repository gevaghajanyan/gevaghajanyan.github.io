import axios from 'axios'
import { BehaviorSubject } from 'rxjs'

class UserService {
  userInfo = new BehaviorSubject({
    loading: true,
    data: null,
  });

  async getUserInfo() {
    this.userInfo.next({
      loading: true,
      data: null,
    });
    const { data } = await axios.get('/api/info');
    this.userInfo.next({
      loading: false,
      data,
    });
  }
}

export const userService = new UserService();

