import { BehaviorSubject } from 'rxjs';
import info from "../../info.json";

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

    this.userInfo.next({
      loading: false,
      data: info,
    });
  }
}

export const userService = new UserService();

