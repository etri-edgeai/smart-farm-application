export class ResponseBody {
  message?: string;
  timestamp: string = new Date().toISOString();
  constructor(public statusCode: number, message = "") {
    if (message) {
      this.message = Array.isArray(message) ? message[0] : message;
    }
  }
}
