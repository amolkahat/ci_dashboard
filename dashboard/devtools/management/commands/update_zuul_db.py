import requests
from devtools.lib.launchpad import get_bugs
from devtools.lib.zuul import ZUUL_LIST
from devtools.models import LaunchpadBugs, ZuulJob, ZuulJobHistory
from django.core.management.base import BaseCommand


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
    """
    Get History
    :param job:
    :return:
    """
    jobs_data = {'job_name': job.job_name}
    if 'opendev' in job.job_url:
        data_dict = ZUUL_LIST['opendev']
        tmp_url = data_dict['opendev'].get('url')
        api_slug = data_dict['api_slug'].format(data_dict.get('tenant'))
    elif 'rdoproject' in job.job_url:
        data_dict = ZUUL_LIST['rdoproject']
        tmp_url = data_dict.get('url')
        api_slug = data_dict.get('api_slug')
    tmp_url = tmp_url + api_slug + f"?job_name={job.job_name}"
    return get_jobs(tmp_url)


def update_zuul_job_history():
    """
    Update zuul job history
    """
    zuul_jobs = ZuulJob.objects.all()
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
            for job in job_history:
                log_url = job.get('log_url', None)
                if not log_url:
                    # Skip job whose log url is not present.
                    continue
                event_timestamp = job['event_timestamp']
                try:
                    ZuulJobHistory(job_name=z_job,
                                   tests_log_url=log_url,
                                   uuid=job.get('uuid'),
                                   duration=job.get('duration', ''),
                                   end_time=job.get('end_time', ''),
                                   event_timestamp=event_timestamp or None,
                                   project=job['project'],
                                   pipeline=job['pipeline'],
                                   result=job.get('result', 'Failed'),
                                   voting=job.get('voting', False)).save()
                except Exception as e:
                    print(e)


def get_launchpad_bugs():
    """
    Get launchpad bugs
    """
    status = ['New', 'Triaged', 'In Progress', 'Confirmed', 'Fix Committed']
    bugs = get_bugs(status=status)
    for bug in bugs:
        LaunchpadBugs(id=bug.bug.id,
                      status=bug.status,
                      tags=bug.bug.tags,
                      title=bug.bug.title,
                      link=bug.web_link).save()

    # TODO remove old bugs


class Command(BaseCommand):
    """
    Custom commands
    """
    help = "Update Zuul History database"

    def handle(self, *args, **kwargs):
        """
        Call custom command
        """
        # update_zuul_job_history()
        get_launchpad_bugs()
