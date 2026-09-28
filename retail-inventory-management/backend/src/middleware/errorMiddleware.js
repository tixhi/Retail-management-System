function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.code === 11000 ? 409 : err.name === 'ValidationError' || err.name === 'CastError' ? 400 : err.status || 500;
  const message = err.code === 11000 ? 'A record with that unique value already exists.' : err.message || 'Internal server error';
  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = { errorHandler };
