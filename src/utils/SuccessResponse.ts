import { IMetaPagination } from "@/resource/pagination";

export class SuccessResponse {
  success: boolean;
  message?: string;
  code: number;
  data: any;
  meta?: IMetaPagination;

  constructor(data: any, code = 200, message?: string, success = true, meta?: IMetaPagination) {
    this.success = success;
    this.code = code;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}
