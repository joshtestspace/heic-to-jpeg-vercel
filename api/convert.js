import { readFile } from 'fs/promises';
import formidable from 'formidable';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ error: 'Upload failed' });
    }

    const filePath = files.file[0].filepath;

    try {
      const inputBuffer = await readFile(filePath);
      const outputBuffer = await sharp(inputBuffer)
        .jpeg()
        .toBuffer();

      res.setHeader('Content-Type', 'image/jpeg');
      return res.send(outputBuffer);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Conversion failed' });
    }
  });
}
