import { Media } from "./image";

export interface Category {
  id: number,
  name: string,
  icon: string,
  high_light: boolean,
  categoryId: number,
}

export function newCategory(cr: CategoryResponse): Category {
  return {
    id: cr.id,
    name: cr.name,
    high_light: cr.high_light,
    icon: cr.image.image?.url ?? '',
    categoryId: cr.id,
  }
} 

export interface CategoryResponse {
  id: number,
  name: string,
  high_light: boolean,
  image: Media,
}

