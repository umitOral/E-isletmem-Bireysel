
class CustomError extends Error {
    constructor(message,status,error){
        super(message);
        this.status=status;
        this.error=error;
        this.errorMessage=error.message;
    }
}

export {CustomError}