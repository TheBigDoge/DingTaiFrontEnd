import { HttpResponse } from "@/utils/http";

export type R<T> = Promise<HttpResponse<T>>;
