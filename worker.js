import Queue from 'bull';
import { promises } from 'fs';
import generateThumbnail from 'image-thumbnail';
import { FilesCollection } from './utils/file';

const { writeFile } = promises;

const THUMBNAIL_SIZES = [500, 250, 100];

const fileQueue = new Queue('image-thumbnail-worker', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

async function createAndSaveThumbnail(path, width) {
  const thumbnail = await generateThumbnail(
    path, { width, responseType: 'base64' },
  );
  const filePath = `${path}_${width}`;
  await writeFile(filePath, Buffer.from(thumbnail, 'base64'));
}

fileQueue.process(async (job, done) => {
  const { userId, fileId } = job.data;
  if (!fileId) { done(new Error('Missing fileId')); }
  if (!userId) { done(new Error('Missing userId')); }

  const filesCollection = new FilesCollection();
  const file = await filesCollection.findUserFileById(userId, fileId, false);
  if (!file) { done(new Error('File not found')); }

  THUMBNAIL_SIZES.forEach(async (size) => {
    await createAndSaveThumbnail(file.localPath, size);
  });
  done();
});

export default fileQueue;
