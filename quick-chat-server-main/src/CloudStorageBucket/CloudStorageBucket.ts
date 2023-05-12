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
    const blob = bucket.file(fileName);
    
    // const buffer = Buffer.from(videoData);
    const start  = new Date().getTime();


  const videoFile = bucket.file(fileName);
  
  await new Promise((resolve, reject) => {
    const stream = videoFile.createWriteStream({
      resumable: false, // Disable resumable uploads for ArrayBuffer data
    });

    stream.on('error', reject).on('finish', resolve);

    stream.end(Buffer.from(videoData));
  });
  const options : any = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };
  console.log(`File Uploaded with the time taken as ${((new Date().getTime() - start)/1000)}  seconds`);
  const [metadata] = await videoFile.getSignedUrl(options);
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