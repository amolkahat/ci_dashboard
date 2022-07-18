from devtools import models
from devtools.lib import zuul
from devtools.models import ZuulJob

from .celery import app


@app.task(bind=True)
def add_history_records(self, job_dict):
    def extract_tests(zuulJob):
        test_data = []
        tests = zuulJob.get_tests()
        for k, v in tests.items():
            key = k.split("(")[-1].replace("']", "")
            test_data.append(f"{key}_{v}")
        return test_data

    print("From Celery task: ", job_dict)
    zuul_obj = ZuulJob.objects.get(job_name=job_dict['job_name'])
    zuul_ci_obj = zuul.ZuulJob(name=job_dict['job_name'],
                               url=job_dict['job_url'],
                               **job_dict)
    job_builds = zuul_ci_obj.get_builds()

    print(job_builds)
    for job in job_builds:
        log_url = job.log_url
        tests = extract_tests(job)
        models.ZuulJobHistory(
            job_name=zuul_obj,
            uuid=job.build_uuid,
            tests_log_url=log_url,
            duration=job.kwargs['duration'],
            end_time=job.kwargs['end_time'],
            event_timestamp=job.kwargs['event_timestamp'],
            project=job.kwargs['project'],
            pipeline=job.kwargs['pipeline'],
            result=job.kwargs['result'],
            voting=job.kwargs['voting'],
            job_tests=tests,
        ).save()
