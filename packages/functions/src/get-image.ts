import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";
import { GetObjectCommand, ListObjectsV2Command, NoSuchKey, S3Client } from "@aws-sdk/client-s3";
import Path from 'path'
import sharp from 'sharp';

export const handler = ApiHandler(async (event) => {
  console.info("Received event:", JSON.stringify(event, null, 2));
  const id = event.pathParameters?.id; // TODO rename param
  if (!id) return { statusCode: 400 };
  const thing = Path.parse(id);
  if (thing.ext === '') return { statusCode: 400 };
  // TODO validate if we support image extension

  const client = new S3Client({ region: "eu-west-1" });
  const listObjectsCommand = new ListObjectsV2Command({ Bucket: Bucket.Uploads.bucketName, Prefix: `${thing.name}/` });
  const listObjectsCommandOutput = await client.send(listObjectsCommand);
  const objects = listObjectsCommandOutput.Contents;
  if (!objects) return { statusCode: 404 };
  console.info("Found objects:", JSON.stringify(objects, null, 2));

  const objectForImageInCorrectFormat = objects.find(o => `.${o.Key?.split("/")[1]}` === thing.ext);

  if (!objectForImageInCorrectFormat) {
    const keyForimageInDifferentFormat = objects[0].Key;
    const getObjectCommand = new GetObjectCommand({ Bucket: Bucket.Uploads.bucketName, Key: keyForimageInDifferentFormat });
    const getObjectCommandOutput = await client.send(getObjectCommand);
    const objectBody = getObjectCommandOutput.Body;
    if (!objectBody) return { statusCode: 500 };
    const sharpInstance = sharp(await objectBody.transformToByteArray());
    if (thing.ext === '.jpg' || thing.ext === '.jpeg') {
      // TODO how to handle PNG to JPEG conversion when PNG has transparency?
      const image = (await sharpInstance.jpeg().toBuffer()).toString("base64");
      // TODO upload image to S3
      return {
        statusCode: 200,
        isBase64Encoded: true,
        headers: { "Content-Type": "image/jpeg" },
        body: image,
      };
    } else {
      // TODO support converting to/from other image types
      return { statusCode: 500 };
    }
  }

  try {
    const getObjectCommand = new GetObjectCommand({ Bucket: Bucket.Uploads.bucketName, Key: objectForImageInCorrectFormat.Key });
    const getObjectCommandOutput = await client.send(getObjectCommand);
    const objectBody = getObjectCommandOutput.Body;
    if (!objectBody) return { statusCode: 500 };
    const image = await objectBody.transformToString("base64");

    return {
      statusCode: 200,
      isBase64Encoded: true,
      // TODO return content type
      body: image,
    };
  } catch (error) {
    if (error instanceof NoSuchKey) {
      return {
        statusCode: 404,
      };
    } else {
      return {
        statusCode: 500,
      }
    }
  }
});
