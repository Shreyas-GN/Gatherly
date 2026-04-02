import json
import os
import uuid
import boto3
from datetime import datetime
from pymongo import MongoClient

# MongoDB Client setup
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://user:pass@cluster0.mongodb.net/?retryWrites=true&w=majority')
db_client = MongoClient(MONGO_URI)
db = db_client['gatherly_db']

# AWS Config for Event-Driven Async Dispatch
# This sends a message to SQS or invokes the Node.js lambda asynchronously
sqs = boto3.client('sqs')
QUEUE_URL = os.environ.get('BACKGROUND_WORKFLOW_QUEUE_URL', '')

def handler(event, context):
    try:
        # Structured API Endpoint: POST /api/v1/events
        body = json.loads(event.get('body', '{}'))
        
        required = [
            'name', 'date', 'time',
            'location', 'slots_total',
            'skills_needed', 'organiser_email'
        ]
        for field in required:
            if field not in body:
                return response(400, {
                    'status': 'error',
                    'message': f'Missing required field: {field}'
                })

        event_id = f"EVT_{body['date'].replace('-', '')}_{str(uuid.uuid4())[:6].upper()}"

        # 1. Structure the Event Document for MongoDB
        new_event_doc = {
            "event_id": event_id,
            "name": body['name'],
            "description": body.get('description', ''),
            "schedule": {
                "date": body['date'],
                "time": body['time'],
            },
            "location": body['location'],
            "organiser_email": body['organiser_email'],
            "requirements": {
                "slots_total": int(body['slots_total']),
                "slots_filled": 0,
                "skills_needed": body['skills_needed'],
            },
            "state": "OPEN",
            "workflow_status": {
                "invitations_dispatched": False,
                "last_sync_timestamp": datetime.utcnow().isoformat() + 'Z'
            },
            "created_at": datetime.utcnow()
        }

        # 2. Insert into MongoDB
        events_collection = db['events']
        events_collection.insert_one(new_event_doc)

        # 3. Asynchronous Background Processing Pipeline Trigger
        # This replaces the inline matching and n8n webhook with a robust SQS queue event
        if QUEUE_URL:
            message_payload = {
                "workflow_type": "EVENT_CREATED",
                "event_id": event_id,
                "event_data": {
                    "event_id": event_id,
                    "name": body['name'],
                    "requirements": new_event_doc["requirements"]
                }
            }
            # Fire-and-forget asynchronous dispatch
            sqs.send_message(
                QueueUrl=QUEUE_URL,
                MessageBody=json.dumps(message_payload)
            )

        return response(201, {
            'status': 'success',
            'event_id': event_id,
            'message': 'Event successfully created and background matching workflow queued.'
        })

    except Exception as e:
        # Error handling for fault tolerance
        print(f"[ERROR] Failed to process event creation: {str(e)}")
        return response(500, {
            'status': 'error',
            'message': 'Failed to create event.'
        })


def response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS'
        },
        'body': json.dumps(body)
    }