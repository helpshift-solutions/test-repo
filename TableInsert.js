const { app } = require('@azure/functions');
const { TableClient } = require('@azure/data-tables');

const connectionString = process.env.AzureWebJobsStorage;
const tableName = 'MyTable';

app.http('TableInsert', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            if (!connectionString) {
                context.log('Missing AzureWebJobsStorage connection string');
                return { status: 500, body: 'Storage connection string missing' };
            }

            const tableClient = TableClient.fromConnectionString(connectionString, tableName);

            // Create table safely
            try {
                await tableClient.createTable();
            } catch (err) {
                if (err.statusCode !== 409) { // Ignore "AlreadyExists"
                    context.log('Error creating table:', err.message);
                    return { status: 500, body: `Table creation failed: ${err.message}` };
                }
            }

            const body = await request.json().catch(() => ({}));

            const entity = {
                partitionKey: 'UserPartition',
                rowKey: Date.now().toString(),
                name: body.name || 'Default Name',
                email: body.email || 'default@example.com'
            };

            await tableClient.createEntity(entity);

            return { status: 200, body: `Entity inserted: ${JSON.stringify(entity)}` };

        } catch (err) {
            context.log('Unexpected Error:', err);
            return { status: 500, body: `Unexpected error: ${err.message}` };
        }
    }
});
