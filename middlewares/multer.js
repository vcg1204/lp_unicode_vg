import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination: "../uploads",
    filename: (req, file, cb) => {
      cb(
        null,
        Date.now() + "-" + file.originalname + path.extname(file.originalname)
      );
    },
  });
  const upload = multer({
    storage: storage,
  });
  
  export default upload;