export interface ApiResponseTypes<T> {
  statusCode: number;
  data?: T | null;
  message: string;
}
