import multer from 'multer';
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES } from './consts.js';
import { getFileExt } from './getFileExt.js';

const storage = multer.memoryStorage();

export const uploadMulter = multer({
  fileFilter(_req, file, cb) {
    const extname = getFileExt(file.originalname);

    if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(extname)) {
      cb(null, true);
    } else {
      return cb(new Error('Неверный формат файла'));
    }
  },
  storage
});
