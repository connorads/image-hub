import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";
import { fileTypeFromBuffer } from 'file-type';
import { nanoid } from 'nanoid'

export const handler = ApiHandler(async (event) => {
    console.info("Received event:", JSON.stringify(event, null, 2));
    const body = event.body;
    if (!body) return { statusCode: 400, body: "Missing body" };
    const request: { blob: string } = JSON.parse(body); // TODO validate body, JSON parse could throw
    const image = Buffer.from(request.blob, "base64");
    const fileType = await fileTypeFromBuffer(image);
    if (!fileType) return { statusCode: 400, body: "Invalid image" };
    const client = new S3Client({ region: "eu-west-1" });
    // TODO validate if file magic number is image
    
    try {
        const id = nanoid();
        const filename = `${id}.${fileType.ext}`;
        const key = `${id}/${fileType.ext}`
        const putObjectCommand = new PutObjectCommand({ Bucket: Bucket.Uploads.bucketName, Key: key, Body: image });
        await client.send(putObjectCommand);

        return {
            statusCode: 201,
            body: JSON.stringify({ filename: filename }),
        };
    } catch (error) {
        return {
            statusCode: 500,
        }

    }
});