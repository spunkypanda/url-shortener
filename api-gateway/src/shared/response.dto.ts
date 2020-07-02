export interface Response {
  message: string
}

export interface SuccessResponse extends Response {
  data?: object
}

export interface ErrorResponse extends Response {}

export const DefaultSucessResponse: SuccessResponse = {
  message: 'Success'
};