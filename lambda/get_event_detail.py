import json
import boto3
import os

s3 = boto3.client('s3')
BUCKET = os.environ.get('S3_BUCKET', 'gatherly-data-shreyas-2')

def handler(event, context):
    try:
        # Get event_id from path parameter
        event_id = event.get('pathParameters', {}).get('id')

        if not event_id:
            return build_response(400, {
                'status': 'error',
                'message': 'Missing event_id'
            })

        # Load event from S3
        try:
            file = s3.get_object(
                Bucket=BUCKET,
                Key=f'events/{event_id}.json'
            )
            event_data = json.loads(file['Body'].read().decode('utf-8'))
        except s3.exceptions.NoSuchKey:
            return build_response(404, {
                'status': 'error',
                'message': 'Event not found'
            })

        # Load confirmations
        try:
            conf_file = s3.get_object(
                Bucket=BUCKET,
                Key=f'confirmations/{event_id}.json'
            )
            confirmations = json.loads(conf_file['Body'].read().decode('utf-8'))
        except:
            confirmations = {'confirmations': []}

        return build_response(200, {
            'status': 'success',
            'event': event_data,
            'confirmations': confirmations
        })

    except Exception as e:
        return build_response(500, {'status': 'error', 'message': str(e)})


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