from django.core.management.base import BaseCommand
from django.utils import timezone
from devtools.models import ZuulJob, ZuulJobHistory
from datetime import datetime, timedelta
from django.db import IntegrityError
import requests
import datetime

ZUUL_LIST = {
    'opendev': {'url': 'https://zuul.opendev.org', 'tenant': 'openstack'},
    'rdoproject': {'url': 'https://review.rdoproject.org/zuul/', 'tenant': 'rdoproject.org'},
    'redhat.com': {'url': "", 'tenant': ""},
}

API_SLUG = '/api/tenant/{}/builds'
def get_jobs(url):
    try:
        data = requests.get(url)
        if data.status_code == 200:
            return data.json()
        else:
            return None
    except Exception as e:
        print(e)


def get_history(job):
    jobs_data = {'job_name': job.job_name}
    if 'opendev' in job.job_url:
        tmp_url = ZUUL_LIST['opendev'].get('url')
        api_slug = API_SLUG.format(ZUUL_LIST['opendev'].get('tenant'))
    elif 'rdoproject' in job.job_url:
        tmp_url = ZUUL_LIST['rdoproject'].get('url')
        api_slug = API_SLUG.format(ZUUL_LIST['rdoproject'].get('tenant'))
    tmp_url = tmp_url + api_slug + f"?job_name={job.job_name}"
    return get_jobs(tmp_url)
    # for history in job_history:
        
    #     jobs_data.update({
    #         'tests_log_url': 
    #     })



class Command(BaseCommand):
    help = "Update Zuul History database"
    def handle(self, *args, **kwargs):
        zuul_jobs = ZuulJob.objects.all()
        new_data = {}
        # Remove data which is older than 15 days
        # ZuulJobHistory.objects.filter(
                # event_timestamp__lte=datetime.utcnow().replace(
                                # tzinfo=timezone.utc)-timedelta(days=15)
                # ).delete()
        # self.stdout.write("Removed data older  than 15 days")
        
        # Update database
        for z_job in zuul_jobs:
            job_history = get_history(z_job)
            if job_history:
                data_list = []
                for job in job_history:
                    log_url = job.get('log_url', None)
                    if not log_url:
                        # Skip job whose log url is not present.
                        continue
                    event_timestamp = job['event_timestamp']
                    import pdb; pdb.set_trace()
                    data_list.append(
                        ZuulJobHistory(job_name=z_job,
                        tests_log_url = log_url,
                        uuid = job.get('uuid'),
                        duration = job.get('duration', ''),
                        end_time = job.get('end_time', ''),
                        event_timestamp = event_timestamp or None,
                        project = job['project'],
                        pipeline = job['pipeline'],
                        result = job.get('result', 'Failed'),
                        voting = job.get('voting', False)))
                ZuulJobHistory.objects.bulk_create(data_list)
