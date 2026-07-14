import { BehaviorSubject } from 'rxjs';
import { UserState } from '../types';
import info from '../../info.json';

class UserService {
  userInfo = new BehaviorSubject<UserState>({
    loading: true,
    data: null,
  });

  async getUserInfo(): Promise<void> {
    this.userInfo.next({ loading: true, data: null });
    this.userInfo.next({ loading: false, data: info as unknown as UserState['data'] });
  }
}

export const userService = new UserService();
