import { StackContext, Api, Bucket } from "sst/constructs";

export function MyStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "Uploads");

  const api = new Api(stack, "api", {
    routes: {
      "GET /images/{id}": { function: { handler: "packages/functions/src/get-image.handler", bind: [bucket] } },
      "POST /images": { function: { handler: "packages/functions/src/upload-image.handler", bind: [bucket] } },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}