import { ApiResponseTypes } from "../types/api-response.types";

class ApiResponse<T> {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;

  constructor({ statusCode, data, message = "Success" }: ApiResponseTypes<T>) {
    this.statusCode = statusCode;
    this.data = data || null;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
