module.exports = (fn) => {
  return (req, res, next) => {
    /*call the incoming function i.e fn that accepts (req ,res, next) , here next is for globalErrorHandling , pass the error to next() */
    fn(req, res, next).catch(next);
  };
};
