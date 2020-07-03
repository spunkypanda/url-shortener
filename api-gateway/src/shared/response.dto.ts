export class Response {
  message: string;

  constructor(message) {
    this.message = message;
  }
}

export class SuccessResponse extends Response {
  data?: any;

  constructor(data?: any, message = 'Success') {
    super(message)
    if (data) this.data = data;
  }
}

export class ErrorResponse extends Response {
  constructor(err: Error | string) {
    if (err instanceof Error) {
      err = err.message;
    }
    super(err);
  }
}

export const DefaultSuccessResponse = new SuccessResponse();
