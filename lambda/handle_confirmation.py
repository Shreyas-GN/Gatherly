import json
import boto3
import os
import urllib.request
from datetime import datetime

s3 = boto3.client('s3')
BUCKET = os.environ.get('S3_BUCKET', 'gatherly-data-shreyas-2')
N8N_SLOTS_FULL = os.environ.get('N8N_WEBHOOK_SLOTS_FULL', '')
N8N_CONFIRMED = os.environ.get('N8N_WEBHOOK_CONFIRMED', '')

def handler(event, context):
    try:
        # Handle both query string (email button click) and body (API call)
        params = event.get('queryStringParameters') or {}
        if params:
            volunteer_id = params.get('v')
            event_id = params.get('e')
            resp = params.get('r')
        else:
            body = json.loads(event.get('body', '{}'))
            volunteer_id = body.get('volunteer_id')
            event_id = body.get('event_id')
            resp = body.get('response')

        if not all([volunteer_id, event_id, resp]):
            return build_response(400, {
                'status': 'error',
                'message': 'Missing volunteer_id, event_id or response'
            })

        # Load event
        try:
            event_file = s3.get_object(
                Bucket=BUCKET,
                Key=f'events/{event_id}.json'
            )
            event_data = json.loads(event_file['Body'].read().decode('utf-8'))
        except:
            return build_response(404, {
                'status': 'error',
                'message': 'Event not found'
            })

        # Load volunteer info
        volunteer = {'volunteer_id': volunteer_id, 'name': 'Volunteer', 'email': ''}
        try:
            registry_file = s3.get_object(
                Bucket=BUCKET,
                Key='volunteers/registry.json'
            )
            registry = json.loads(registry_file['Body'].read().decode('utf-8'))
            matched = next(
                (v for v in registry['volunteers']
                 if v['volunteer_id'] == volunteer_id), None
            )
            if matched:
                volunteer = matched
        except:
            pass

        # Check if already responded
        confirmed_ids = [
            v.get('volunteer_id', v) if isinstance(v, dict) else v
            for v in event_data['volunteers_confirmed']
        ]
        if (volunteer_id in confirmed_ids or
                volunteer_id in event_data.get('volunteers_declined', [])):
            if params:
                return html_response('Already recorded', 'Your response was already recorded!')
            return build_response(200, {
                'status': 'success',
                'message': 'Response already recorded'
            })

        # Process CONFIRMED
        if resp == 'CONFIRMED':
            if event_data['slots_filled'] >= event_data['slots_total']:
                if params:
                    return html_response('Sorry!', 'All slots are now filled. Thank you for your interest!')
                return build_response(409, {
                    'status': 'error',
                    'message': 'All slots are filled'
                })

            event_data['volunteers_confirmed'].append({
                'volunteer_id': volunteer_id,
                'name': volunteer.get('name', ''),
                'email': volunteer.get('email', ''),
                'confirmed_at': datetime.utcnow().isoformat() + 'Z'
            })
            event_data['volunteers_pending'] = [
                v for v in event_data['volunteers_pending']
                if v != volunteer_id
            ]
            event_data['slots_filled'] += 1

            # Check if slots now full
            if event_data['slots_filled'] >= event_data['slots_total']:
                event_data['status'] = 'FILLED'
                if N8N_SLOTS_FULL:
                    trigger_n8n(N8N_SLOTS_FULL, {
                        'event': event_data,
                        'confirmed_volunteers': event_data['volunteers_confirmed'],
                        'pending_volunteers': event_data['volunteers_pending']
                    })

        # Process DECLINED
        elif resp == 'DECLINED':
            event_data['volunteers_declined'].append(volunteer_id)
            event_data['volunteers_pending'] = [
                v for v in event_data['volunteers_pending']
                if v != volunteer_id
            ]

        # Save updated event
        s3.put_object(
            Bucket=BUCKET,
            Key=f'events/{event_id}.json',
            Body=json.dumps(event_data, indent=2),
            ContentType='application/json'
        )

        # Save confirmation record
        try:
            conf_file = s3.get_object(
                Bucket=BUCKET,
                Key=f'confirmations/{event_id}.json'
            )
            confirmations = json.loads(conf_file['Body'].read().decode('utf-8'))
        except:
            confirmations = {'confirmations': []}

        confirmations['confirmations'].append({
            'volunteer_id': volunteer_id,
            'event_id': event_id,
            'response': resp,
            'responded_at': datetime.utcnow().isoformat() + 'Z'
        })
        s3.put_object(
            Bucket=BUCKET,
            Key=f'confirmations/{event_id}.json',
            Body=json.dumps(confirmations, indent=2),
            ContentType='application/json'
        )

        # Return HTML if button click, JSON if API call
        if params:
            if resp == 'CONFIRMED':
                return html_response(
                    '✅ Confirmed!',
                    f"You are confirmed for {event_data['name']}! See you there."
                )
            else:
                return html_response(
                    '👍 Got it!',
                    'No problem. We will keep you in mind for future events!'
                )

        return build_response(200, {
            'status': 'success',
            'message': f'Response {resp} recorded',
            'slots_remaining': event_data['slots_total'] - event_data['slots_filled']
        })

    except Exception as e:
        return build_response(500, {'status': 'error', 'message': str(e)})


def html_response(title, message):
    html = f"""
    <html>
    <head>
      <style>
        body {{ font-family: Arial, sans-serif; text-align: center;
               padding: 80px 20px; background: #f9fafb; }}
        .card {{ background: white; border-radius: 12px;
                padding: 40px; max-width: 400px;
                margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
        h2 {{ color: #111827; }}
        p {{ color: #6b7280; }}
      </style>
    </head>
    <body>
      <div class="card">
        <h2>{title}</h2>
        <p>{message}</p>
        <p style="margin-top:30px;font-size:12px;color:#9ca3af;">
          Powered by Gatherly
        </p>
      </div>
    </body>
    </html>
    """
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'text/html'},
        'body': html
    }


def trigger_n8n(webhook_url, payload):
    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            webhook_url,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        urllib.request.urlopen(req, timeout=10)
    except Exception as e:
        print(f'n8n trigger failed: {str(e)}')


def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        },
        'body': json.dumps(body)
    }