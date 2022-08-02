from django.test import Client, TestCase
from django.urls import reverse
from promoter.models import Release
from rest_framework import status

client = Client()

RELESE_DICT = {
    'release_name': 'master', 'distro': 'centos9',
    'dlrn_host': 'https://trunk.rdoproject.org/api-centos9-master-uc/',
    'hashes_count': 100,
    'source_registry': 'tripleomastercentos9',  # noqa: F601
    'target_registry': 'tripleomastercentos9',  # noqa: F601
    'source_registry': 'https://quay.rdoproject.org',  # noqa: F601
    'target_registry': 'https://quay.io',  # noqa: F601
    'promotions': {
        'criteria': [
            'periodic-tripelo-ci-build-containers-centos-9-push-master',
            'periodic-tripleo-centos-9-uildimage-overcloud-full-master'],
        'source_label': 'tripleo-ci-testing',
        'target_label': 'current-tripleo'}}


class TestGetAllRelease(TestCase):

    def setUp(self) -> None:
        Release.objects.create(
            release_id=1,
            **RELESE_DICT
        )
        wallaby = RELESE_DICT.copy()
        wallaby.update(
            {'release_name': 'wallaby',
             'dlrn_host': 'https://trunk.rdoproject.org/api-centos9-wallaby',
             'source_namespace': 'tripleowallabycentos9',
             'target_namespace': 'tripleowallabycentos9',
             'promotions': {'criteria': [
                 'periodic-tripleo-ci-build-containers-centos-9-push-wallaby',
                 'periodic-tripleo-centos-9-buildimage-overcloud-full-wallaby'
             ],
                 'source_label': 'tripleo-ci-testing',
                 'target_label': 'current-tripleo'}})
        Release.objects.create(release_id=2, **wallaby).save()

    def test_get_all_releases(self):
        response = client.get(reverse('releases'))
        self.assertEqual(list(response.data.keys()), ['master', 'wallaby'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_releases_with_args(self):
        response = client.get('/api/releases/')
        self.assertEqual(response.data['master'], ['centos9'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestPromotions(TestCase):
    def setUp(self) -> None:
        Release.objects.create(release_id=1, **RELESE_DICT).save()
        wallaby = RELESE_DICT.copy()
        wallaby.update(
            {
                'release_name': 'wallaby',
                'dlrn_host': 'https://trunk.rdoproject.org/api-centos9-'
                             'wallaby',
                'source_namespace': 'tripleowallabycentos9',
                'target_namespace': 'tripleowallabycentos9',
                'promotions': {
                    'criteria': [
                        'periodic-tripleo-ci-build-containers-centos-9-'
                        'push-wallaby',
                        'periodic-tripleo-centos-9-buildimage-overcloud-'
                        'full-wallaby'
                    ],
                    'source_label': 'tripleo-ci-testing',
                    'target_label': 'current-tripleo'}})
        Release.objects.create(release_id=2, **wallaby).save()

    def test_get_master_promotions(self):
        """
        Test master promotion check we are getting exact keys
        :return:
        """
        response = client.get('/api/promotions/')
        key = ''
        data = response.json()
        for k in data:
            key = k
            break
        hash_data = data[key][0]
        self.assertEqual(list(hash_data.keys()),
                         ['aggregate_hash', 'commit_hash', 'distro_hash',
                          'extended_hash', 'full_hash', 'timestamp',
                          'missing_jobs'])

    def test_get_wallaby_promotions(self):
        """
        Test wallaby promotion check exact keys
        :return:
        """
        response = client.get('/api/promotions',
                              {'release': 'wallaby',
                               'distro': 'centos9'})
        key = ''
        data = response.json()
        for k in data:
            key = k
            break
        hash_data = data[key][0]
        self.assertEqual(list(hash_data.keys()),
                         ['aggregate_hash', 'commit_hash', 'distro_hash',
                          'extended_hash', 'full_hash', 'timestamp',
                          'missing_jobs'])

    def test_get_wallaby_promotion_with_label(self):
        """
        Test promotion with label
        :return:
        """
        response = client.get('/api/promotions',
                              {'release': 'wallaby',
                               'distro': 'centos9',
                               'label': 'tripleo-ci-testing'})
        key = ''
        data = response.json()
        for k in data:
            key = k
            break
        hash_data = data[key][0]
        self.assertEqual(list(hash_data.keys()),
                         ['aggregate_hash', 'commit_hash', 'distro_hash',
                          'extended_hash', 'full_hash', 'timestamp',
                          'missing_jobs'])

    def test_get_invalid_release_promotion(self):
        """
        Test promotion with invalid release
        :return:
        """
        response = client.get('/api/promotions/', {'release': 'invalid',
                                                   'distro': 'centos9'})
        self.assertEqual(response.data, 'Invalid release or distro')
        self.assertEqual(response.status_code, 400)

    def test_get_invalid_distro_promotion(self):
        """
        Test promotion with invalid distro
        :return:
        """
        response = client.get('/api/promotions/', {'release': 'master',
                                                   'distro': 'centos99'})
        self.assertEqual(response.data, 'Invalid release or distro')
        self.assertEqual(response.status_code, 400)
