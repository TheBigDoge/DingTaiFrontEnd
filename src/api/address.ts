import { TimeMilli } from "@/utils/datetime";
import { R } from ".";
import http from "@/utils/http";
import { PaginationResponse } from "@/utils/pagination";

export interface Address {
  id: number,
  name: string,
  phone: string,
  province: string,
  city: string,
  district: string,
  address: string,
  isDefault: boolean,
  tags: string[],
}

export function newAddress(ar: AddressResponse): Address {
  return {
    id: ar.id,
    name: ar.name,
    phone: ar.phone,
    province: ar.province,
    city: ar.city,
    district: ar.district,
    address: ar.address,
    isDefault: ar.is_default,
    tags: ar.tags,
  }
}

export interface AddressResponse {
  id: number,
  name: string,
  phone: string,
  province: string,
  city: string,
  district: string,
  address: string,
  is_default: boolean,
  tags: string[],
  is_active: boolean,
  create_date: TimeMilli,
  update_date: TimeMilli,
}

export async function listAddresses(): R<PaginationResponse<AddressResponse>> {
  return await http.get('/api/v1/addresses')
}

export async function createAddress(address: Address): R<AddressResponse> {
  return await http.post('/api/v1/addresses', {
    ...address,
    id: undefined,
    isDefault: undefined,
    is_default: address.isDefault,
  })
}

export async function deleteAddress(id: number): R<{}> {
  return await http.delete(`/api/v1/addresses/${id}`)
}

export async function updateAddress(address: Address): R<AddressResponse> {
  return await http.put(`/api/v1/addresses/${address.id}`, {
    ...address,
    id: undefined,
    isDefault: undefined,
    is_default: address.isDefault,
  })
}
