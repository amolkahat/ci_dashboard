import configparser

from . import mirror_sync_status as mss

centos_8_compose = "https://composes.centos.org/latest-CentOS-Stream-8/COMPOSE_ID"
centos_9_compose = "https://odcs.stream.centos.org/production/latest-CentOS-Stream/compose/.composeinfo"

config = configparser.ConfigParser()

dummy_host = 'https://mymirror.com'
dummy_slug = 'centos/8-stream/COMPOSE_ID'
dummy_distro = 'centos'
dummy_version = '8'
dummy_release = 'master'
dummy_promotion_name = 'current-tripleo'


class TestMirrorSyncStatus:
    def test_get_centos_compose_id_stream_9(self):
        status = mss.get_centos_compose_id(centos_9_compose)
        config.read_string(status)
        name = config['compose']['id']
        assert 'CentOS-Stream-9' in name

    def test_get_centos_compose_id_stream_8(self):
        status = mss.get_centos_compose_id(centos_8_compose)
        assert 'CentOS-Stream-8' in status

    def test_construct_centos_mirror(self):
        m_name = mss.construct_centos_mirror('https://mymirror.com', dummy_slug)
        assert m_name == dummy_host + "/" + dummy_slug

    def test_generate_rdo_slug(self):
        expected = f"{dummy_distro}-{dummy_release}/{dummy_promotion_name}"
        out = mss.generate_rdo_slug(dummy_distro, dummy_release)
        assert out == expected

    def test_ger_delorean_md5_hash(self):
        expected = 32
        rdo_slug = f"{dummy_distro}{dummy_version}-{dummy_release}/{dummy_promotion_name}"
        output = mss.get_delorean_md5_hash(rdo_slug)
        assert expected == len(output)

    def test_construct_rdo_proxy_mirror_url(self):
        pass
