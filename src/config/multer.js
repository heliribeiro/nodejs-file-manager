import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import multers3 from 'multer-s3';
import 'dotenv/config';

export default function multerConfig(s3) {
  const storageTypes = {
    local: multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
      },
      filename: (req, file, callback) => {
        crypto.randomBytes(16, (err, hash) => {
          if (err) callback(err);

          file.key = `${hash.toString('hex')}`;

          callback(null, file.key);
        });
      },
    }),
    s3: multers3({
      s3,
      contentType: multers3.AUTO_CONTENT_TYPE,
      acl: 'private',
      bucket: process.env.AWS_BUCKET,
      key: (req, file, callback) => {
        crypto.randomBytes(16, (err, hash) => {
          if (err) callback(err);

          const filename = `${hash.toString('hex')}`;

          callback(null, filename);
        });
      },
    }),
  };

  return {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes.s3,
    limits: {
      fileSize: 4 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
      const allowedMimes = [
        'application/pdf',
        'image/jpeg',
        'image/pjpeg',
        'image/png',
      ];

      if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error('Invalid file type'));
      }
    },
  };
}
