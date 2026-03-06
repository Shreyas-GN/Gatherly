import json
import boto3
import os

s3 = boto3.client('s3')
BUCKET = os.environ.get('S3_BUCKET', 'gatherly-data-shreyas-2')
REGISTRY_KEY = 'volunteers/registry.json'

def handler(event, context):
    try:
        # Load registry
        try:
            file = s3.get_object(Bucket=BUCKET, Key=REGISTRY_KEY)
            registry = json.loads(file['Body'].read().decode('utf-8'))
        except:
            registry = {'volunteers': [], 'total': 0}

        volunteers = registry.get('volunteers', [])

        # Filter by skill if provided
        params = event.get('queryStringParameters') or {}
        skill_filter = params.get('skill', None)
        if skill_filter:
            volunteers = [
                v for v in volunteers
                if skill_filter in v.get('skills', [])
            ]

        # Sort by most events participated
        volunteers.sort(
            key=lambda x: x.get('total_events', 0),
            reverse=True
        )

        return build_response(200, {
            'status': 'success',
            'volunteers': volunteers,
            'total': len(volunteers)
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
    