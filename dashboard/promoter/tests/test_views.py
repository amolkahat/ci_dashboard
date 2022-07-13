import json
from platform import release
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from ..models import Release
from ..serializers import ReleaseSerializer

client = Client()

RELESE_DICT = {'release_name': 'master','distro': 'centos9',
               'dlrn_host': 'https://trunk.rdoproject.org/api-centos9-master-uc/',
               'hashes_count': 100,'source_registry': 'tripleomastercentos9',
               'target_registry': 'tripleomastercentos9', 'source_registry': 'https://quay.rdoproject.org',
               'target_registry': 'https://quay.io', 
               'promotions': {
                   'criteria': ['periodic-tripelo-ci-build-containers-centos-9-push-master',
                                'periodic-tripleo-centos-9-uildimage-overcloud-full-master'],
                    'source_label': 'tripleo-ci-testing',
                    'target_label': 'current-tripleo'}}

class GetAllReleaseTest(TestCase):

    def setUp(self) -> None:
        Release.objects.create(
            release_id=1,
            **RELESE_DICT
        )
        wallaby = RELESE_DICT.copy()
        wallaby.update({'release_name': 'wallaby', 
                        'dlrn_host': 'https://trunk.rdoproject.org/api-centos9-wallaby',
                        'source_namespace': 'tripleowallabycentos9', 'target_namespace': 'tripleowallabycentos9',
                        'promotions': {'criteria': ['periodic-tripleo-ci-build-containers-centos-9-push-wallaby', 
                                                    'periodic-tripleo-centos-9-buildimage-overcloud-full-wallaby'],
                                       'source_label': 'tripleo-ci-testing', 'target_label': 'current-tripleo'}})
        Release.objects.create(release_id=2, **wallaby)


    def test_get_all_releases(self):
        response = client.get(reverse('get_releases'))
        self.assertEqual(response.data, ['master','wallaby'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_releases_with_args(self):
        response = client.get(reverse('get_releases', 
                                      kwargs={'release': 'wallaby', 'distro': 'centos9'}))
        print(response.data)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)