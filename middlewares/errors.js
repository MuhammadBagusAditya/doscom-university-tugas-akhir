import { MulterError } from "multer";

/**
 * error 404 fallback function
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const notFound = (req, res) => {
  res.status(404).json({
    status: "failed",
    message: "Route yang anda tuju, tidak dapat ditemukan",
  });
};

/**
 * error 500 fallback function
 *
 * @param {any} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const error = (err, req, res, next) => {
  console.log(err);
  if (err instanceof MulterError) {
    return res.status(500).json({
      status: "failed",
      message: "File tidak dapat diupload",
    });
  }

  if (err.status && err.status === 401) {
    res.status(401).json({
      status: "failed",
      message: "User tidak dikenali",
    });
  } else {
    res.status(500).json({
      status: "failed",
      message: "Ooops, ada error di server, coba lagi nanti",
    });
  }
};
