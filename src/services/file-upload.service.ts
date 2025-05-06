import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


const s3Client = new S3Client({
     region: import.meta.env.VITE_AWS_REGION,
     credentials: {
          accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
          secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
     },
     forcePathStyle: false,
});

const fileToUint8Array = async (file: File): Promise<Uint8Array> => {
     return new Uint8Array(await file.arrayBuffer()); // ✅ Converted File to Uint8Array
};

const uploadFile = async (
     file: File,
     folder: string,
): Promise<string> => {
     const bucketName = "easypact";
     const key = `${folder}/${file.name}`;

     const fileData = await fileToUint8Array(file);

     const uploadParams = {
          Bucket: bucketName,
          Key: key,
          Body: fileData,
          ContentType: file.type,

     };

     await s3Client.send(new PutObjectCommand({
          ...uploadParams,
          ACL: "public-read"

     }));

     const url: string = `https://${bucketName}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`
     return url;
};

export const uploadWebGl = async (file: File, folder: string = "webgl") => {
     const bucketName = "easypact";

     const relativePath = file.webkitRelativePath || file.name;
     const key = `${folder}/${relativePath}`;


     const fileData = await fileToUint8Array(file);

     const uploadParams = {
          Bucket: bucketName,
          Key: key,
          Body: fileData,
          ContentType: file.type,
     };
     await s3Client.send(new PutObjectCommand({
          ...uploadParams,
          ACL: "public-read"
     }));

     await new Promise((resolve) => setTimeout(resolve, 2000));
     return `https://${bucketName}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
};


export const uploadVideo = (file: File) => uploadFile(file, "videos");
export const uploadThumbnail = (file: File) => uploadFile(file, "thumbnails");
