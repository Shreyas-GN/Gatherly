import json
import boto3
import os

s3 = boto3.client('s3')
BUCKET = os.environ.get('S3_BUCKET', 'gatherly-data-shreyas-2')

def handler(event, context):
    try:
        # List all event files in S3
        response = s3.list_objects_v2(
            Bucket=BUCKET,
            Prefix='events/'
        )

        events = []

        if 'Contents' in response:
            for obj in response['Contents']:
                if obj['Key'].endswith('.json'):
                    # Load each event file
                    file = s3.get_object(
                        Bucket=BUCKET,
                        Key=obj['Key']
                    )
                    event_data = json.loads(
                        file['Body'].read().decode('utf-8')
                    )
                    events.append(event_data)

        # Sort by date
        events.sort(key=lambda x: x.get('date', ''))

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=120, s-maxage=300'
            },
            'body': json.dumps({
                'status': 'success',
                'events': events,
                'total': len(events)
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'status': 'error',
                'message': str(e)
            })
        }