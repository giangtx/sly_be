import multer from "multer";
import util from "util";

const storage = multer.diskStorage({
  destination: ({ des }, file, callback) => {
    callback(null, des);
  },
  filename: (request, file, callback) => {
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      return callback("Only allowed to upload image jpeg or png.", null);
    }
    let filename = Date.now() + "-upload-" + file.originalname;
    callback(null, filename);
  },
});

const uploadManyFiles = multer({ storage: storage }).array("file");
const uploadSingleFile = multer({ storage: storage }).single("file");

export const multipleUpload = util.promisify(uploadManyFiles);
export const singleUpload = util.promisify(uploadSingleFile);
