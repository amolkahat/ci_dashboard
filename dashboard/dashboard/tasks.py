from django.forms import DurationField
from .celery import app

from devtools import models
from devtools.lib import zuul

import json

from devtools.lib import tempest_html_json


@app.task(bind=True)
def add_history_records(self, job_dict):
    print("From Celery task: ", job_dict)
    job_obj = models.ZuulJob.objects.filter(job_name=job_dict['job_name'])
    data = zuul.get_jobs_history(job_dict)
    if isinstance(data, str):
        data = json.loads(data)
    for d in data:
        log_url = d['log_url']
        if not log_url:
            continue
        tests = ""
        # tests = get_job_tests(job_dict)
        models.ZuulJobHistory(
            job_name=job_obj,
            uuid=d['uuid'],
            tests_log_url=log_url,
            duration=d['duration'],
            end_time=d['end_time'],
            event_timestamp=d['event_timestamp'],
            project=d['project'],
            pipeline=d['pipeline'],
            result=d['result'],
            voting=d['voting'],
            job_tests=tests,
        ).save()
