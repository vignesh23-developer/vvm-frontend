export class ResponseDTO<T = any> {
  public error: boolean
  public data: T
  public message: string
  public status?: string

  constructor(init: Partial<ResponseDTO>) {
    this.error = init.error ?? false
    this.data = init.data
    this.message = init.message ?? ''
    this.status = init.status ?? ''
  }
}
