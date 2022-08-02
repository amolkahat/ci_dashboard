from devtools import models
from django.test import TestCase

# Create your tests here.

ZUUL_JOB = {
    'id': 1,
    'job_name': 'periodic-tripleo-ci-centos-9-scenario001-standlaone',
    'job_url': 'https://review.rdoproject.org/zuul/builds?job_name='
               'periodic-tripleo-ci-centos-9-scenario001-standalone-master',
    'job_domain': 'rdoproject.org',
}

ZUUL_JOB_HISTORY = {
    'job_name': 1,
    'uuid': '7b18a497-30fc-4c38-be52-6e64596e7b22',
    'test_log_url': '',
    'duration': '',
    'end_time': '',
    'event_timestamp': '',
    'project': '',
    'pipeline': '',
    'result': '',
    'voting': '',
    'job_tests': '',
}


class TestDevtoolsModels(TestCase):

    def setUp(self):
        """
        Setup dummy data for class
        :return:
        """

    def test_zuul_job_model(self):
        """
        Test zuul job class model
        :return:
        """
        models.ZuulJob(**ZUUL_JOB).save()
        zuul_job = models.ZuulJob.objects.all()
        self.assertEqual(zuul_job[0].job_name, ZUUL_JOB['job_name'])
