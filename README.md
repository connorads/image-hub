# Imagehub

You are responsible for developing Imagehub, a programmatic image storage and processing service. Imagehub is designed to be used by other applications, offering high-performance programmatic access through its API, rather than targeting end-users with a web front-end.

Imagehub provides various image processing and transformation capabilities, such as compression, rotation, filters, thumbnail creation, and masking. These functionalities are delivered as high-performance web services that can operate on images provided in requests, remote images accessed via URLs, or existing images in the repository. All processing features are optimized for bulk operations and scalability.

Key tasks:

- Create a simple service in TypeScript and Node.js that can receive an uploaded image and return a unique identifier for future retrieval.
- Consider the deployment and testing strategy using AWS services (building effort is not required).
- Extend the service to support different image formats by utilizing specific file extensions in the image request URLs.
- Include at least one unit test to demonstrate the setup of a comprehensive testing suite.
- Focus on developing an MVP version, and any potential further extensions can be discussed separately without the need for immediate implementation.

## Notes

- Tests
    - Refactor into components and unit test them
    - Run some integration tests

- Questions
    - Image duplication?
    - Image renaming/aliasing?
    - Asynchronously convert images?

- Considerations
    - AWS Lambda has a 6 MB invocation payload request and response limit
    - AWS API Gateway timeout is 30 seconds
    - Logging and observability
    - CORS