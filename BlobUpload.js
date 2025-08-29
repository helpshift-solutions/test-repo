const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');

const connectionString = process.env.AzureWebJobsStorage;

app.http('BlobUpload', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerName = 'mycontainer';
            const containerClient = blobServiceClient.getContainerClient(containerName);

            await containerClient.createIfNotExists();

            const blobName = 'sample.txt';
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            const content = 'Hello from Azure Blob!';
            await blockBlobClient.upload(content, Buffer.byteLength(content));

            return { body: 'File uploaded successfully!' };
        } catch (err) {
            context.log(err.message);
            return { status: 500, body: 'Error uploading file' };
        }
    }
});
