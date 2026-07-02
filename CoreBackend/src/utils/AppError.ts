
export class ApiError extends Error {
    statusCode: number;
      isOperational: boolean;
    constructor(statusCode: number, message: string){
        super(message);
        this.statusCode =statusCode;
        this.isOperational= true;

        //  maint proper stack trace forv8 engines 
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }

    }
}

const throwError = (statusCode: number, message: string) : never =>{
    throw new ApiError(statusCode, message)
}
export default  throwError;
