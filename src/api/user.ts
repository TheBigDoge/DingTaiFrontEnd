import http from "@/utils/http";
import { R } from ".";
import { Media } from "./image";

export interface User {
  id: number,
  nickname: string,
  phone: string,
  avatar: string,
}

export function newUser(ur: UserResponse): User {
  return {
    id: ur.id,
    nickname: ur.nickname,
    phone: ur.phone,
    avatar: ur.avatar.image?.url ?? '',
  }
}

export interface UserResponse {
  id: number,
  nickname: string,
  phone: string,
  avatar: Media,
}

export async function fetchUserInfo(): R<UserResponse> {
  return await http.get('/api/v1/users')
}
