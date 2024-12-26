import { UserRole } from "@prisma/client";

/**
 * @param {UserRole} role
 */
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        status: "failed",
        message: "Anda tidak memiliki akses",
      });
    }

    next();
  };
};

export default checkRole;
