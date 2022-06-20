from celery import Celery;
import os
from devtools.lib import zuul 
from devtools import models
celery_setings_value = 'dashboard.settings'

os.environ.setdefault("DJANGO_SETTINGS_MODULE", celery_setings_value)

app = Celery('dashboard')

app.autodiscover_tasks()

task = app.task

@app.task(bind=True)
def debug_task(self, data):
    print(data)


@app.task(bind=True)
def add_history_records(self, host, job_name):
    print("From Celery task: ", host, job_name)
    z = zuul.ZuulAPI(host)
    data = z.get_jobs_history(job_name=job_name)
    models.ZuulJobHistory(**data).save()