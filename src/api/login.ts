import { delAuthToken, setAuthToken } from "@/utils/auth";
import http from "@/utils/http";
import { R } from '.';
import { CategoryResponse } from "./category";
import { ProductResponse } from "./product";
import { newUser, UserResponse } from "./user";
import { GlobalData } from "@/store";
import { newPremiumStatus, PremiumStatusResponse } from "./premium";

export interface LoginResponse {
  token: string;
}

/**
 * 登录成功后（或获取到新的token后），调用这个函数来设置token
 * @param loginResponse
 */
function commonHandleLogin(loginResponse?: LoginResponse) {
  if (loginResponse?.token) {
    setAuthToken(loginResponse.token);
  } else {
    delAuthToken()
  }
}

export async function handleAfterLogin(loginResponse?: LoginResponse) {
  // 获取必要数据
  return Promise.all([
    GlobalData.fetchUser(),
    GlobalData.fetchPremiumStatus(),
  ])
}

export interface StartupResponse extends LoginResponse {
  categories: CategoryResponse[];
  high_light_categories: CategoryResponse[];
  recommend_products: ProductResponse[], 
  user?: UserResponse,
  premium_status: PremiumStatusResponse,
}

export async function startup(): R<StartupResponse>  {
  const response = await http.get<StartupResponse>('/api/v1/login');
  if (response.token) {
    commonHandleLogin(response);
  }
  if (response.user) {
    const user = newUser(response.user);
    GlobalData.set_user(user);
  }
  if (response.premium_status) {
    const status = newPremiumStatus(response.premium_status);
    GlobalData.set_premium_status(status);
  } else {
    GlobalData.set_premium_status(null);
  }
  return response;
}


export interface WechatLoginRequest {
  code: string,
}

/**
 * 微信登录
 * @param req
 */
export async function WechatLogin(req: WechatLoginRequest): R<LoginResponse> {
  let response = await http.post<WechatLoginRequest, LoginResponse>('/api/v1/login/wechat', req);
  commonHandleLogin(response);
  return response;
}

export interface WechatRegisterRequest {
  code: string,
  encrypted_data: string,
  iv: string,
}

/**
 * 微信注册
 * @param req
 */
export async function WechatRegister(req: WechatRegisterRequest): R<LoginResponse> {
  let response = await http.post<WechatRegisterRequest, LoginResponse>('/api/v1/login/wechat/register', req);
  commonHandleLogin(response);
  return response;
}
