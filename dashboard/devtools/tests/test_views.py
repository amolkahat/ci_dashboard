import redis
from django.test import Client, TestCase

client = Client()

redis_client = redis.Redis()


class TestDevtoolsViews(TestCase):
    def setUp(self):
        self.mirrors = [{
            "name": "http://mirror02.regionone.linaro-us.opendev.org",
            "status": "synced",
            "release": "master",
            "distro": "centos9"
        }]

    def test_mirrors_view(self):
        response = client.get('/api/mirrors/')
        self.assertEqual(response.data[0].keys(), self.mirrors[0].keys())

    def test_mirror_view_with_args(self):
        response = client.get('/api/mirrors/', {'release': 'master',
                                                'distro': 'def'})
        self.assertEqual(response.data, 'Invalid release or distro')
