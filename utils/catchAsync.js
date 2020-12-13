const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    res.send({
      status: err.statusCode,
      message: ""+ err,
    });
  });
};

export default catchAsync;
