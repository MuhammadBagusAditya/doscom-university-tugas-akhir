import { zodErrorFormatter } from "@utils/formatter";

/**
 * Generate invalid query message
 *
 * @param {import("express").Response} res
 *
 */
export const queryError = (res) => {
  return res.status(400).json({
    status: "failed",
    message: "Query tidak valid",
  });
};

/**
 * Generate invalid input message
 *
 * @param {import("express").Response} res
 * @param {Record<string, Record<string, string[]?>>} issues
 */
export const validationError = (res, issues) => {
  return res.status(400).json({
    status: "failed",
    message: "Input tidak valid",
    errors: zodErrorFormatter(issues),
  });
};

/**
 * Generate forbidden message
 *
 * @param {import("express").Response} res
 * @param {string} type
 */
export const forbiddenError = (res, type) => {
  return res.status(403).json({
    status: "failed",
    message: type + " tidak dapat diakses",
  });
};

/**
 * Generate record not found message
 *
 * @param {import("express").Response} res
 * @param {string} type
 * @param {string | null} message
 *
 */
export const recordNotFound = (res, type, message = null) => {
  return res.status(404).json({
    status: "failed",
    message: message ? message : type + " tidak ditemukan",
  });
};

/**
 * Generate server error message
 *
 * @param {import("express").Response} res
 *
 */
export const serverError = (res) => {
  return res.status(500).json({
    status: "failed",
    message: "Server error",
  });
};

/**
 * Generate get success message
 *
 * @param {import("express").Response} res
 * @param {string} type
 * @param {any} data
 *
 */
export const getSuccess = (res, type, data) => {
  return res.status(200).json({
    status: "success",
    message: type + " ditemukan",
    data,
  });
};

/**
 * Generate get success message
 *
 * @param {import("express").Response} res
 * @param {string} type
 * @param {any} data
 *
 */
export const postSuccess = (res, type, data = undefined) => {
  return res.status(201).json({
    status: "success",
    message: type + " berhasil ditambahkan",
    data,
  });
};

/**
 * Generate get success message
 *
 * @param {import("express").Response} res
 * @param {string} type
 * @param {any} data
 *
 */
export const putSuccess = (res, type, data = undefined) => {
  return res.status(200).json({
    status: "success",
    message: type + " berhasil diubah",
    data,
  });
};

/**
 * Generate get success message
 *
 * @param {import("express").Response} res
 * @param {string} type
 *
 */
export const deleteSuccess = (res, type) => {
  return res.status(200).json({
    status: "success",
    message: type + " berhasil dihapus",
  });
};
