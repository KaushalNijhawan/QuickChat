import { Storage } from "@google-cloud/storage";
import { BUCKET_NAME, CREDENTIALS_PATH, PROJECT_ID } from "../Constants/Constants";
import { Readable } from "stream";

const projectId = PROJECT_ID;
const keyFilename = CREDENTIALS_PATH;
const bucketName = BUCKET_NAME;
const storage = new Storage({
    projectId : projectId,
    keyFilename : keyFilename
});
export const saveBucketVideo = async (videoData: ArrayBuffer, fileName: string) : Promise<string>  => {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    console.log(fileName);
    const writeStream = file.createWriteStream();

  // Write the video data to the stream
  writeStream.write(Buffer.from(videoData));
  
  // Finalize the upload
  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
    writeStream.end();
  });

  const options : any = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };
  const start  = new Date().valueOf();
  console.log(`File Uploaded with the time taken as ${((new Date().getTime() - start)/1000)}  seconds`);
  const [metadata] = await file.getSignedUrl(options);
  return metadata;
}

export const uploadFileToBucket = async (base64Data : string, fileName: string, bucketName : string)=> {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
  
    const buffer = Buffer.from(base64Data, 'base64');
    const stream = file.createWriteStream({
      resumable: false,
      metadata: {
        contentType: 'audio/mpeg', // Replace with the appropriate content type
      },
    });
  
    return new Promise((resolve, reject) => {
      stream
        .on('finish', () => {
          resolve(`gs://${bucket.name}/${file.name}`);
        })
        .on('error', (error) => {
          reject(error);
        })
        .end(buffer);
    });
}