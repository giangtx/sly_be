const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
    .catch((err) => 
        res.send({
            status: 500,
            message: 'Error is: ' + err
        })
    );
};
  
export default catchAsync;