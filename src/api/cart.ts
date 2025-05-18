import { TimeMilli } from "@/utils/datetime";
import { CM, Meter } from "@/utils/length";
import { newProduct, Product, ProductResponse } from "./product";
import { R } from ".";
import http from "@/utils/http";
import { PaginationResponse } from "@/utils/pagination";

/**
 * 购物车的物品
 */
export interface CartItem {
  id: number,
  product_id: number,
  is_partial_sale: boolean,
  stock: Meter,
  product: Product,
}

export function newCartItem(response: CartItemResponse): CartItem {
  return {
    id: response.id,
    product_id: response.product_id,
    is_partial_sale: response.is_partial_sale,
    stock: response.stock / 100,
    product: newProduct(response.product),
  }
}


export interface CartItemResponse {
  id: number,
  user_id: number,
  product_id: number,
  stock: CM,
  is_partial_sale: boolean,
  is_active: boolean,
  create_date: TimeMilli,
  update_date: TimeMilli,
  product: ProductResponse,
}


export interface AddCartItemRequest {
  product_id: number,
  is_partial_sale: boolean,
  stock: CM,
}

export async function AddCartItem(req: AddCartItemRequest): R<CartItemResponse> {
  return await http.post('/api/v1/carts', req);
}

export async function ListCartItems(page: number, page_size: number): R<PaginationResponse<CartItemResponse>> {
  return await http.get('/api/v1/carts', {
    page,
    page_size,
  })
}

export async function DeleteCartItem(id: number): R<{}> {
  return await http.delete(`/api/v1/carts/${id}`);
}

export async function DeleteCartItems(ids: number[]): Promise<void>  {
  const future = [] as Promise<{}>[];
  for (const id of ids) {
    future.push(DeleteCartItem(id));
  }

  return Promise.all(future).then();
}
