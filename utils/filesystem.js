import { unlink } from "fs";

export const deleteFile = (path) => {
  unlink(path, (err) => {
    console.log(err);
  });
};
