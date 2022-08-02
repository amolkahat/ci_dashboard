import json
import os

import requests
from devtools.lib import tempest_html_json, utils  # noqa: E402

ZUUL_LIST = {
    'opendev': {'name:': 'opendev',
                'url': 'https://zuul.opendev.org/',
                'tenant': 'openstack',
                'api_slug': 'api/tenant/openstack/builds?job_name='},
    'rdoproject': {'name': 'opendev',
                   'url': 'https://review.rdoproject.org/zuul/',
                   'tenant': 'https://rdoproject.org/zuul/',
                   'api_slug': 'api/builds?job_name='},
    'redhat.com': {'name': "", 'url': "", 'tenant': "", 'api_slug': ''},
}

import logging

log = logging.getLogger(__name__)


class ZuulJob:
    """
    Zuul Job base class
    """

    def __init__(self, name, url, **kwargs):
        self.name = name
        self.url = url
        self.release = kwargs.get('release', 'master')
        self.domain = ZUUL_LIST[kwargs.get('domain', 'opendev')]
        self.build_uuid = kwargs.get('uuid', None)
        self.log_url = kwargs.get('log_url', None)
        self.kwargs = kwargs
        self.tempest_path = "/logs/undercloud/var/log/tempest/"
        self.tempest_result_file = "stestr_results.html" \
            if self.release == "master" else "stestr_results.html.gz"
        self.api_url = self.domain['url'] + self.domain['api_slug']
        self.job_builds = []

    def __str__(self):
        return str(self.name)

    def __eq__(self, obj):
        return self.name == obj.name

    def get_builds(self):
        """
        Get job builds
        """
        url = os.path.join(self.api_url + self.name)
        log.info(f"URL: {url}")
        data = utils._make_request(url)
        if isinstance(data, str):
            data = json.loads(data)

        for job in data:
            name = job['job_name']
            log.info(f"Job Name: {name}")
            # Check log url exists else skip.
            if not job.get('log_url', None):
                continue
            tempest_path = job.get(
                'log_url') + self.tempest_path + self.tempest_result_file
            log.info(f"Tempest URL: {tempest_path}")
            status = requests.get(tempest_path)
            # Check logs exists on the server else skip job.
            if status.status_code == 200:
                newJob = ZuulJob(name, job.get('log_url'), **job)
                log.info("Adding job to builds")
                self.job_builds.append(newJob)
        return self.job_builds

    def get_tests(self):
        """
        Get tests from job
        :return:
        """
        log_url = self.log_url + self.tempest_path + self.tempest_result_file
        log.info(f"get tests Log URL: {log_url}")
        return tempest_html_json.output(log_url)


class Pipeline:
    """
    Pipeline class
    """

    def __init__(self, name, **kwargs):
        self.name = name
        self.kwargs = kwargs
        self.jobs = []

    def add_job(self, job):
        """
        Add job to pipeline
        """
        if job not in self.jobs:
            self.jobs.append(job)
