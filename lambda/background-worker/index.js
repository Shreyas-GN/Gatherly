const { MongoClient } = require('mongodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Node.js AWS Lambda for Asynchronous Background Processing
// This executes the trigger-based "EventCreated" workflow.

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://user:pass@cluster0.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGO_URI);
const sesClient = new SESClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    try {
        console.log(`[INIT] Async Workflow Processor Triggered. Event Records: ${event.Records.length}`);
        await client.connect();
        const db = client.db('gatherly_db');
        const volunteersCollection = db.collection('volunteers');
        const workflowCollection = db.collection('workflow_executions');

        for (const record of event.Records) {
            // Trigger-based execution payload
            const payload = JSON.parse(record.body); 
            
            if (payload.workflow_type === 'EVENT_CREATED') {
                const targetEvent = payload.event_data;
                console.log(`[PROCESSING] Matching volunteers for event: ${targetEvent.event_id}`);

                // Record execution start for tracking
                const executionId = await workflowCollection.insertOne({
                    trigger_source: "EVENTBRIDGE",
                    event_type: "EVENT_CREATED",
                    target_event_id: targetEvent.event_id,
                    status: "RUNNING",
                    started_at: new Date(),
                    error_log: null,
                    metrics: {}
                });

                // Algorithm-Driven AI Skill Matching - using standard NoSQL query on normalized taxonomy
                // $in operator handles overlapping skills for perfect compatibility
                const matchedVolunteers = await volunteersCollection.find({
                    ai_normalized_skills: { $in: targetEvent.requirements.skills_needed },
                    status: 'ACTIVE'
                }).limit(targetEvent.requirements.slots_total * 3).toArray();

                console.log(`[MATCH FOUND] Found ${matchedVolunteers.length} potential volunteers.`);

                // Dispatch Email Notifications Asynchronously
                for (const vol of matchedVolunteers) {
                    await sendInvitation(vol.contact.email, targetEvent);
                }

                // Complete Execution Tracking
                await workflowCollection.updateOne(
                    { _id: executionId.insertedId },
                    { 
                        $set: { 
                            status: "COMPLETED", 
                            completed_at: new Date(),
                            metrics: {
                                candidates_found: matchedVolunteers.length,
                                emails_dispatched: matchedVolunteers.length
                            }
                        } 
                    }
                );
            }
        }
        
        return { statusCode: 200, body: 'Asynchronous Workflow Executed Successfully' };

    } catch (error) {
        // Implemented error handling mechanisms to ensure fault tolerance
        console.error(`[CRITICAL ERROR] Workflow execution failed`, error);
        throw error; // AWS Lambda will automatically retry if configured for SQS/EventBridge
    } finally {
        await client.close();
    }
};

async function sendInvitation(email, event_data) {
    // Structure transactional email dispatch
    const params = {
        Destination: { ToAddresses: [email] },
        Message: {
            Body: {
                Text: { Data: `Hello! You've been matched for the ${event_data.name} event based on your unique AI skills. Please RSVP on your dashboard.` }
            },
            Subject: { Data: `Event Invitation: ${event_data.name}` }
        },
        Source: 'alerts@gatherly.app'
    };
    return sesClient.send(new SendEmailCommand(params));
}
