const { diskStorage } = require('multer');

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, ${Date.now()}-${file.originalname});
    }
  })
};
