export interface ApiResponseTypes<T> {
  statusCode: number;
  data: T;
  message: string;
}
