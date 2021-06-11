import { Router } from 'express';
import aws from 'aws-sdk';
import multer from 'multer';
import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';

import 'dotenv/config';

const spacesEndpoint = new aws.Endpoint(process.env.AWS_SPACE_ENDPOINT);

const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  credentials: {
    accessKeyId: process.env.AWS_ACESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
  },
});

const router = Router();

const files = FileController(s3);

router.get('/files', files.index);

router.get('/files/:Key', files.download);

router.post('/files', multer(multerConfig(s3)).single('file'), files.create);

router.delete('/files/:Key', files.destroy);

export default router;
