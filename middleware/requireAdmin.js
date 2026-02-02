module.exports = function requireAdmin(req, res, next) {
  // authMiddleware already sets req.userRole
  if (req.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

  next();
};
