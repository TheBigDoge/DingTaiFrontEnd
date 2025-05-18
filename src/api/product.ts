import { TimeMilli } from "@/utils/datetime";
import { CM, Meter } from "@/utils/length";
import { PricePerCM, PricePerMeter } from "@/utils/price";
import { Media } from "./image";
import { R } from ".";
import { Category, CategoryResponse } from "./category";
import http from "@/utils/http";

export interface Product {
  id: number,
  number: string,
  name: string,
  description: string,
  vip_only: boolean,
  total_stock: Meter,
  sold_stock: Meter,
  lock_stock: Meter,
  available_stock: Meter,
  min_order_stock: Meter,
  image: string,
  memberPrice: PricePerMeter,
  price: PricePerMeter,
  allow_partial_sale: boolean,
  order_quantity: number,
  media: Media[],
}

export function newProduct(pr: ProductResponse): Product {
  return {
    id: pr.id,
    number: pr.number,
    name: pr.name,
    description: pr.description,
    vip_only: pr.vip_only,
    total_stock: pr.total_stock / 100,
    sold_stock: pr.sold_stock / 100,
    lock_stock: pr.lock_stock / 100,
    available_stock: pr.available_stock / 100,
    min_order_stock: pr.min_order_stock / 100,
    image: pr.media
            .filter(m => m.type === 'image')
            .map(m => m.image.url)
            .at(0) ?? '',
    memberPrice: pr.vip_price * 100,
    price: pr.normal_price * 100,
    allow_partial_sale: pr.allow_partial_sale,
    order_quantity: pr.order_quantity,
    media: pr.media,
  }
}

export interface ProductResponse {
  id: number,
  number: string,
  name: string,
  description: string,
  vip_only: boolean,
  total_stock: CM,
  sold_stock: CM,
  lock_stock: CM,
  available_stock: CM,
  vip_price: PricePerCM,
  normal_price: PricePerCM,
  min_order_stock: CM,
  is_online: boolean,
  allow_partial_sale: boolean,
  order_quantity: number,
  recommend_order: number,
  recommended: boolean,
  create_date: TimeMilli,
  update_date: TimeMilli,
  media: Media[],
}

export enum ProductListSorting {
  General = "general",
  Price = "price",
  PriceDesc = "price_desc",
  Sell = "sell",
  SellDesc = "sell_desc",
  Recommend = "recommend",
}

export interface GetProductResponse {
  data: CateogryAndProductList[],
}

export interface CateogryAndProductList {
  category: CategoryResponse,
  products: ProductResponse[],
}

export async function GetProducts(keyword?: string, sort?: string, category_id?: number): R<GetProductResponse> {
  return await http.get('/api/v1/products', {
    keyword: keyword || undefined,
    sort: sort || undefined,
    category_id: category_id ?? undefined, // 接受category_id == 0的请求，虽然非法
  })
}

export async function GetProductById(id: number): R<ProductResponse> {
  return await http.get(`/api/v1/products/${id}`)
}
