const { app } = require('@azure/functions');
const { QueueClient } = require('@azure/storage-queue');

const connectionString = process.env.AzureWebJobsStorage;
const queueName = 'mytestingqueue';

app.http('QueueAdd', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try{
            const queueClient = new QueueClient(connectionString, queueName);
            await queueClient.createIfNotExists();

            // you can also pass json data also or even plain text
            
            // const message = (await request.text()) || request.query.get('message') || 'Hello from Azure Queue!';

            // const message = {
            //     text: "Hello from Azure Queue!",
            //     timestamp: new Date().toISOString()
            // };
            const message = request.query.get('name') || await request.text() || 'Hello world';

            await queueClient.sendMessage(message);

            return { body: `Message added: ${message}` };
        }
        catch (err) {
            context.log("Error sending message to queue:", err.message);
            return {
                status: 500,
                body: `Error: ${err.message}`
            };
        }
    }
});









