export class ResponseDTO<T = any> {
  constructor(
    public error: boolean,
    public data: T,
    public message: string,
    public status?: string,
  ) {}
}
