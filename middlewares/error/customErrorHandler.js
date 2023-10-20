import { CustomError } from "../../helpers/error/CustomError.js";
const customErrorHandler = (err, req, res, next) => {
  let customError = err;

  if (err.name === "SyntaxError") {
    customError = new CustomError("unexpected syntax", 400);
  }
  if (err.name === "ValidatorError") {
    customError = new CustomError(err.message, 400);
  }

  if (err.name === "MongoServerError" && err.code == 11000) {
    customError = new CustomError(
      "Mail adresi ile kayıtlı kullanıcı zaten bulunmaktadır.",
      400
    );
  }
  if (err.name === "ValidationError") {
    customError = new CustomError(err.errors.password.properties.message, 400);
  }

  console.log(err.name)
  res.status(customError.status || 500).json({
    succes: false,
    message: customError.message || "internal Server error",
  });
};

export { customErrorHandler };
