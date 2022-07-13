from django.test import TestCase

from promoter.models import Release

# Create your tests here.


class ReleaseTest(TestCase):

    def setUp(self) -> None:
        Release.objects.create(
            release_id=1,
            release_name='master',
            distro='centos9',
            dlrn_host='https://trunk.rdoproject.org/api-centos9-master-uc/',
            hashes_count=100,
            source_namespace='tripleomastercentos9',
            target_namespace='tripleomastercentos9',
            source_registry='https://quay.rdoproject.org',
            target_registry='https://quay.io',
            promotions={'criteria':['periodic-tripelo-ci-build-containers-centos-9-push-master',
                                    'periodic-tripleo-centos-9-uildimage-overcloud-full-master'],
                        'source_label': 'tripleo-ci-testing',
                        'target_label': 'current-tripleo'}
        )

    def test_release_model(self):
        release = Release.objects.get(release_name='master')
        self.assertEqual(release.release_name, 'master')
        self.assertEqual(release.distro, 'centos9')
        self.assertEqual(release.dlrn_host, 'https://trunk.rdoproject.org/api-centos9-master-uc/')
        self.assertEqual(release.source_namespace, 'tripleomastercentos9')
        self.assertEqual(release.target_namespace, 'tripleomastercentos9')
        self.assertEqual(release.source_registry, 'https://quay.rdoproject.org')
        self.assertEqual(release.target_registry, 'https://quay.io')
        self.assertEqual(release.promotions.keys(), {'criteria', 'source_label', 'target_label'})
        self.assertEqual(str(release), 'master_centos9')