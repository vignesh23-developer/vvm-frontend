export class ResponseDTO {
   public error   : boolean;
   public value   : any;
   public message : string;
   public status? : string;

   constructor(error: boolean, value: any, message: string, status?: string ) {
     this.error = error;
     this.value = value;
     this.message = message;
     this.status = status
   }
}
