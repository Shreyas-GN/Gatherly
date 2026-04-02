import json
import os
import uuid
import boto3
from datetime import datetime
from pymongo import MongoClient
import openai

# Initialize MongoDB Client
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://user:pass@cluster0.mongodb.net/?retryWrites=true&w=majority')
db_client = MongoClient(MONGO_URI)
db = db_client['gatherly_db']

# Initialize OpenAI
openai.api_key = os.environ.get('OPENAI_API_KEY', 'dummy-key')

# Initialize AWS Lambda Client for Async Dispatch
lambda_client = boto3.client('lambda')

def handler(event, context):
    try:
        # Parse incoming rest API payload
        body = json.loads(event.get('body', '{}'))
        
        required = ['first_name', 'last_name', 'email', 'bio']
        for field in required:
            if field not in body:
                return response(400, {'error': f'Missing required field: {field}'})

        volunteer_id = f"VOL_{str(uuid.uuid4())[:8].upper()}"

        # 1. LLM API for Intelligent Decision Making - Extract & Normalize Skills
        prompt = f"""
        Extract professional and volunteer skills logically from this bio.
        Return only a JSON array of specific skill keywords.
        Bio: "{body['bio']}"
        """
        
        try:
            llm_res = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "system", "content": prompt}]
            )
            extracted_skills = json.loads(llm_res.choices[0].message.content)
        except Exception as e:
            # Fallback if LLM fails
            extracted_skills = ["general_volunteer"]

        # 2. Structure MongoDB Document
        volunteer_doc = {
            "volunteer_id": volunteer_id,
            "first_name": body['first_name'],
            "last_name": body['last_name'],
            "contact": {
                "email": body['email'],
                "phone": body.get('phone', None)
            },
            "raw_bio": body['bio'],
            "ai_normalized_skills": extracted_skills,
            "trust_score": 100.0,
            "status": "ACTIVE",
            "created_at": datetime.utcnow()
        }

        # 3. Model & Store in MongoDB Collection
        volunteers_collection = db['volunteers']
        volunteers_collection.insert_one(volunteer_doc)

        # 4. Trigger Asynchronous Background Processing Pipeline (Event-Driven)
        # Dispatches a background job to check if this new volunteer matches any currently OPEN events.
        payload = {
            "workflow_type": "VOLUNTEER_ONBOARDED",
            "volunteer_id": volunteer_id,
            "skills": extracted_skills
        }
        
        lambda_client.invoke(
            FunctionName=os.environ.get('BACKGROUND_WORKFLOW_LAMBDA', 'gatherly-background-job'),
            InvocationType='Event', # Fire-and-Forget, Async workflow!
            Payload=json.dumps(payload)
        )

        return response(201, {
            'status': 'success',
            'message': 'Volunteer registered successfully. Workflow triggered.',
            'volunteer_id': volunteer_id,
            'extracted_skills': extracted_skills
        })

    except Exception as e:
        # Logging and error handling mechanisms to ensure system reliability
        print(f"[ERROR] Failed to ingest volunteer event: {str(e)}")
        return response(500, {
            'status': 'error',
            'message': 'Internal Server Error during event ingestion.'
        })

def response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }
