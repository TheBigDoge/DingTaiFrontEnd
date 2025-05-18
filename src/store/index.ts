import { getPremiumStatus, newPremiumStatus, PremiumStatus } from "@/api/premium";
import { fetchUserInfo, newUser, User } from "@/api/user";

export type Nullable<T> = T | null;

export class Once<T> {
  data: Nullable<T>;
  
  constructor() {
    this.data = null;
  }

  set(val: Nullable<T>) {
    this.data = val;
  }

  get(): Nullable<T> {
    const val = this.data;
    this.set(null);
    return val;
  }
};

class GlobalDataS {
  user: Nullable<User> = null;
  redirect_id: Once<number> = new Once();
  premium_status: Nullable<PremiumStatus> = null;

  get_user(): Nullable<User> {
    return this.user;
  }

  set_user(user: Nullable<User>) {
    this.user = user;
  }

  get_redirect_id(): Nullable<number> {
    return this.redirect_id.get();
  }

  set_redirect_id(id: Nullable<number>) {
    this.redirect_id.set(id);
  }

  get_premium_status(): Nullable<PremiumStatus> {
    return this.premium_status;
  }

  set_premium_status(status: Nullable<PremiumStatus>) {
    this.premium_status = status;
  }

  is_premium(): boolean {
    return this.premium_status?.active || false;
  }

  async fetchPremiumStatus(): Promise<PremiumStatus> {
    const statusResponse = await getPremiumStatus();
    const status = newPremiumStatus(statusResponse);
    this.set_premium_status(status);
    return status;
  }

  async fetchUser(): Promise<User> {
    const currentUser = this.get_user();
    if (currentUser) {
      return currentUser;
    }
    
    const userResponse = await fetchUserInfo();
    const user = newUser(userResponse);
    this.set_user(user);
    return user;
  }
}

export const GlobalData = new GlobalDataS();
