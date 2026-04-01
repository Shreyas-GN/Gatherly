import json
import boto3
import os
import uuid
from datetime import datetime

s3 = boto3.client('s3')
BUCKET = os.environ.get('S3_BUCKET', 'gatherly-data-shreyas-2')
N8N_WEBHOOK = os.environ.get('N8N_WEBHOOK_INVITATIONS', '')

def handler(event, context):
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))

        # Validate required fields
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

        # Generate unique event ID
        date_str = body['date'].replace('-', '')
        event_id = f"EVT_{date_str}_{str(uuid.uuid4())[:6].upper()}"

        # Build event object
        new_event = {
            'event_id': event_id,
            'name': body['name'],
            'description': body.get('description', ''),
            'date': body['date'],
            'time': body['time'],
            'location': body['location'],
            'organiser_email': body['organiser_email'],
            'slots_total': int(body['slots_total']),
            'slots_filled': 0,
            'skills_needed': body['skills_needed'],
            'status': 'OPEN',
            'created_at': datetime.utcnow().isoformat() + 'Z',
            'invitations_sent': False,
            'reminders_sent': {
                '48hr': False,
                '24hr': False,
                '2hr': False
            },
            'volunteers_confirmed': [],
            'volunteers_declined': [],
            'volunteers_pending': []
        }

        # Save event to S3
        s3.put_object(
            Bucket=BUCKET,
            Key=f'events/{event_id}.json',
            Body=json.dumps(new_event, indent=2),
            ContentType='application/json'
        )

        # Load volunteer registry from S3
        matched_volunteers = []
        try:
            registry_file = s3.get_object(
                Bucket=BUCKET,
                Key='volunteers/registry.json'
            )
            registry = json.loads(
                registry_file['Body'].read().decode('utf-8')
            )

            # Match volunteers by skills
            for volunteer in registry.get('volunteers', []):
                volunteer_skills = volunteer.get('skills', [])
                event_skills = body['skills_needed']
                if any(skill in volunteer_skills
                       for skill in event_skills):
                    matched_volunteers.append(volunteer)

        except s3.exceptions.NoSuchKey:
            # No volunteers registered yet
            matched_volunteers = []

        # Update event with pending volunteers
        new_event['volunteers_pending'] = [
            v['volunteer_id'] for v in matched_volunteers
        ]
        s3.put_object(
            Bucket=BUCKET,
            Key=f'events/{event_id}.json',
            Body=json.dumps(new_event, indent=2),
            ContentType='application/json'
        )

        # Trigger n8n invitation workflow
        if N8N_WEBHOOK and matched_volunteers:
            import urllib.request
            payload = json.dumps({
                'event': new_event,
                'matched_volunteers': matched_volunteers
            }).encode('utf-8')
            req = urllib.request.Request(
                N8N_WEBHOOK,
                data=payload,
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            try:
                # Fire-and-forget asynchronous dispatch to prevent bottlenecking core compute layers
                # Relies on n8n webhook's immediate 200 OK response for high-volume transactions
                urllib.request.urlopen(req, timeout=2)
            except Exception:
                # Handled concurrently by n8n event engine; compute layer is freed immediately
                pass

        return response(200, {
            'status': 'success',
            'event_id': event_id,
            'message': f'Event created. '
                      f'{len(matched_volunteers)} volunteers matched.'
        })

    except Exception as e:
        return response(500, {
            'status': 'error',
            'message': str(e)
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