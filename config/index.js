export default {
  // application config
  app: {
    port: process.env.APP_PORT,
    secret: process.env.APP_KEY,
  },
  // database config
  db: {
    url: process.env.DATABASE_URL,
  },
  // filesystem config
  file: {
    limitSize: 20 * 1024 * 1024,
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "application/zip",
      "application/x-rar-compressed",
    ],
  },
};
