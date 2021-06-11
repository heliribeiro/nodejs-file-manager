import 'dotenv/config';

function FileController(s3) {
  return {
    create: async (req, res) => {
      // eslint-disable-next-line prefer-const
      let { originalname: name, key, location: url = '' } = req.file;
      if (!url) {
        url = `${process.env.APP_URL}/local/${key}`;
      }

      res.json({ name, key });
    },
    index: async (req, res) => {
      try {
        s3.listObjects({ Bucket: process.env.AWS_BUCKET }, (err, data) => {
          const result = [];
          if (err) console.log(err, err.stack);
          else {
            data.Contents.forEach((obj) => {
              console.log(obj.Key);
              result.push(obj);
            });
          }

          return res.json(result);
        });
      } catch (error) {
        return res.json({ error: true });
      }
    },
    destroy: async (req, res) => {
      const { Key } = req.params;
      const params = { Bucket: process.env.AWS_BUCKET, Key };
      s3.deleteObject(params, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(data);
      });

      res.json({ ok: true });
    },
    download: async (req, res) => {
      const expireSeconds = 60 * 5;
      const { Key } = req.params;
      const url = s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_BUCKET,
        Key,
        Expires: expireSeconds,
      });
      res.json(url);
    },
  };
}
export default FileController;
