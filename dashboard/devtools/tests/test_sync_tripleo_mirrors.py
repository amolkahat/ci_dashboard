import configparser

from devtools.lib import mirror_sync_status as mss

CENTOS_8_COMPOSE = "https://composes.centos.org/latest-CentOS-Stream-8/COMPOSE_ID"
CENTOS_9_COMPOSE = "https://odcs.stream.centos.org/production/latest-CentOS-Stream/compose/.composeinfo" # noqa E501

config = configparser.ConfigParser()

DUMMY_HOST = 'https://mymirror.com'
DUMMY_SLUG = 'centos/8-stream/COMPOSE_ID'
DUMMY_DISTRO = 'centos'
DUMMY_VERSION = '8'
DUMMY_RELEASE = 'master'
DUMMY_PROMOTION_NAME = 'current-tripleo'


class TestMirrorSyncStatus:
    """
    Test Tripleo Mirror Sync status class
    """
    def test_get_centos_compose_id_stream_9(self):
        """
        Test centos stream 9 compose id
        :return:
        """
        status = mss.get_centos_compose_id(CENTOS_9_COMPOSE)
        config.read_string(status)
        name = config['compose']['id']
        assert 'CentOS-Stream-9' in name

    def test_get_centos_compose_id_stream_8(self):
        """
        Test centos 8 compose id
        :return:
        """
        status = mss.get_centos_compose_id(CENTOS_8_COMPOSE)
        assert 'CentOS-Stream-8' in status

    def test_construct_centos_mirror(self):
        """
        Test construct centos mirror url
        :return:
        """
        m_name = mss.construct_centos_mirror('https://mymirror.com',
                                             DUMMY_SLUG)
        assert m_name == DUMMY_HOST + "/" + DUMMY_SLUG

    def test_generate_rdo_slug(self):
        """
        Test Generate rdo slug
        :return:
        """
        expected = f"{DUMMY_DISTRO}-{DUMMY_RELEASE}/{DUMMY_PROMOTION_NAME}"
        out = mss.generate_rdo_slug(DUMMY_DISTRO, DUMMY_RELEASE)
        assert out == expected

    def test_ger_delorean_md5_hash(self):
        """
        Test to get md5 hash
        :return:
        """
        expected = 32
        rdo_slug = f"{DUMMY_DISTRO}{DUMMY_VERSION}-" \
                   f"{DUMMY_RELEASE}/{DUMMY_PROMOTION_NAME}"
        output = mss.get_delorean_md5_hash(rdo_slug)
        assert expected == len(output)
