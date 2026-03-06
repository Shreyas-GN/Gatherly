import json
import boto3
import os
import urllib.request
from datetime import datetime, timezone

s3 = boto3.client('s3')
BUCKET = os.environ.get('S3_BUCKET', 'gatherly-data-shreyas-2')
N8N_REMINDERS = os.environ.get('N8N_WEBHOOK_REMINDERS', '')

def handler(event, context):
    try:
        now = datetime.now(timezone.utc)
        results = []

        # List all events
        response = s3.list_objects_v2(Bucket=BUCKET, Prefix='events/')
        if 'Contents' not in response:
            return {'statusCode': 200, 'body': json.dumps({'message': 'No events found'})}

        for obj in response['Contents']:
            if not obj['Key'].endswith('.json'):
                continue

            file = s3.get_object(Bucket=BUCKET, Key=obj['Key'])
            event_data = json.loads(file['Body'].read().decode('utf-8'))

            # Skip non-active events
            if event_data['status'] in ['COMPLETED', 'CANCELLED']:
                continue

            # Calculate hours until event
            try:
                event_dt_str = f"{event_data['date']}T{event_data['time']}:00+05:30"
                event_dt = datetime.fromisoformat(event_dt_str)
                hours_until = (event_dt - now).total_seconds() / 3600
            except:
                continue

            updated = False
            pending = event_data.get('volunteers_pending', [])
            confirmed = event_data.get('volunteers_confirmed', [])

            # 48hr reminder → pending volunteers
            if (48 >= hours_until > 24
                    and not event_data['reminders_sent']['48hr']
                    and pending):
                trigger_reminder(event_data, pending, '48hr_pending')
                event_data['reminders_sent']['48hr'] = True
                updated = True
                results.append(f"48hr: {event_data['name']}")

            # 24hr briefing → confirmed volunteers
            if (24 >= hours_until > 2
                    and not event_data['reminders_sent']['24hr']
                    and confirmed):
                trigger_reminder(event_data, confirmed, '24hr_confirmed')
                event_data['reminders_sent']['24hr'] = True
                updated = True
                results.append(f"24hr: {event_data['name']}")

            # 2hr final briefing → confirmed volunteers
            if (2 >= hours_until > 0
                    and not event_data['reminders_sent']['2hr']
                    and confirmed):
                trigger_reminder(event_data, confirmed, '2hr_briefing')
                event_data['reminders_sent']['2hr'] = True
                updated = True
                results.append(f"2hr: {event_data['name']}")

            # Save if updated
            if updated:
                s3.put_object(
                    Bucket=BUCKET,
                    Key=obj['Key'],
                    Body=json.dumps(event_data, indent=2),
                    ContentType='application/json'
                )

        return {
            'statusCode': 200,
            'body': json.dumps({
                'status': 'success',
                'reminders_sent': results,
                'checked_at': now.isoformat()
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'status': 'error', 'message': str(e)})
        }


def trigger_reminder(event_data, volunteers, reminder_type):
    if not N8N_REMINDERS:
        print(f'No n8n webhook set, skipping reminder: {reminder_type}')
        return
    try:
        payload = json.dumps({
            'event': event_data,
            'volunteers': volunteers,
            'reminder_type': reminder_type
        }).encode('utf-8')
        req = urllib.request.Request(
            N8N_REMINDERS,
            data=payload,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        urllib.request.urlopen(req, timeout=10)
    except Exception as e:
        print(f'Reminder trigger failed: {str(e)}')