class Response {
  constructor() {}
  static successResponse(success,message,code=200,data) {
    return {
      success,
      message,
      code,
      data
    };
  }
  static unsuccessResponse(success,message,code=200,data) {
    return {
      success,
      message,
      code,
      data
    };
  }
  static errorResponse(error,message) {
    return {
      error:error.code,
      error: {
        error: error.message,
        message:message
      },
    };
  }
}


export {Response}