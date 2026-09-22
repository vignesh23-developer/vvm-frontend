export class AxiosErrorDTO<D = any> {
  public isAxiosError: true = true;
  public status?: number;
  public data?: D;
  public message: string;

  constructor(message: string, status?: number, data?: D) {
    this.message = message;
    this.status = status;
    this.data = data;
  }

  toString(): string {
    return this.message;
  }
}

export class GenericErrorDTO {
  public isError: boolean = false;
  public message: string;

  constructor(message: string, isError: boolean) {
    this.message = message;
    this.isError = isError;
  }

  toString(): string {
    return this.message;
  }
}
