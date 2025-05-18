import { TimeMilli } from "@/utils/datetime";
import { R } from ".";
import http from "@/utils/http";

export interface PremiumStatus {
  active: boolean,
  start_date?: Date,
  end_date?: Date,
}

export function isPremiumUser(ps: PremiumStatus): boolean {
  return ps.active && (!ps.end_date || ps.end_date > new Date())
}

export function newPremiumStatus(r: PremiumStatusResponse): PremiumStatus {
  return {
    active: r.active,
    start_date: r.start_date ? new Date(r.start_date) : undefined,
    end_date: r.end_date ? new Date(r.end_date) : undefined,
  }
}

export interface PremiumStatusResponse {
  active: boolean,
  start_date?: TimeMilli,
  end_date?: TimeMilli,
}

export async function getPremiumStatus(): R<PremiumStatusResponse> {
  return http.get('/api/v1/premium')
}
