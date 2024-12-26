import multer, { diskStorage } from "multer";
import path from "path";

export const uploadAttachment = multer({
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, "storage/attachments/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now();
      cb(null, "attachment-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
});
