// This is queue trigger - not working currently

const { app } = require('@azure/functions');

app.storageQueue('QueueProcessor', {
    queueName: 'myqueue',
    connection: 'AzureWebJobsStorage',
    handler: async (message, context) => {
        context.log(`Processing message from queue: ${message}`);

        if (typeof queueItem === 'string') {
            try {
                message = JSON.parse(queueItem);
            } catch (e) {
                message = queueItem; // It's plain text
            }
        } else {
            message = queueItem; // It's already an object
        }
        
        context.log('Processed message:', message);
    }
});
