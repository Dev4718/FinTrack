export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const formattedErrors = parsed.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: formattedErrors
      });
    }
    req.body = parsed.data;
    next();
  } catch (err) {
    next(err);
  }
};
