#!/usr/bin/python3
"""
A Python Script to check for current-tripleo dlrn md5 is synced on all
upstream cloud or not.

For running: $python3 mirror_sync_status.py

"""
import posixpath

import requests

# Target Mirrors generated using get_all_upstream_mirrors.py script
target_mirrors = [
    "http://mirror02.regionone.linaro-us.opendev.org",
    "http://mirror.regionone.linaro-us.opendev.org",
    "http://mirror02.mtl01.inap.opendev.org",
    "http://mirror.mtl01.inap.opendev.org",
    "http://mirror02.iad3.inmotion.opendev.org",
    "http://mirror.iad3.inmotion.opendev.org",
    "http://mirror02.gra1.ovh.opendev.org",
    "http://mirror.gra1.ovh.opendev.org",
    "http://mirror01.sjc1.vexxhost.opendev.org",
    "http://mirror.sjc1.vexxhost.opendev.org",
    "http://mirror01.regionone.osuosl.opendev.org",
    "http://mirror.regionone.osuosl.opendev.org",
    "http://mirror01.regionone.limestone.opendev.org",
    "http://mirror.regionone.limestone.opendev.org",
    "http://mirror01.ord.rax.opendev.org",
    "http://mirror.ord.rax.opendev.org",
    "http://mirror01-int.ord.rax.opendev.org",
    "http://mirror-int.ord.rax.opendev.org",
    "http://mirror01.kna1.airship-citycloud.opendev.org",
    "http://mirror.kna1.airship-citycloud.opendev.org",
    "http://mirror01.iad.rax.opendev.org",
    "http://mirror.iad.rax.opendev.org",
    "http://mirror01-int.iad.rax.opendev.org",
    "http://mirror-int.iad.rax.opendev.org",
    "http://mirror01.dfw.rax.opendev.org",
    "http://mirror.dfw.rax.opendev.org",
    "http://mirror01-int.dfw.rax.opendev.org",
    "http://mirror-int.dfw.rax.opendev.org",
    "http://mirror01.ca-ymq-1.vexxhost.opendev.org",
    "http://mirror.ca-ymq-1.vexxhost.opendev.org",
    "http://mirror01.bhs1.ovh.opendev.org",
    "http://mirror.bhs1.ovh.opendev.org",
]

# OpenStack releases
releases = ["master", "wallaby", "victoria", "ussuri", "train"]

# RDO port slug
rdo_content_port_slug = "8080/rdo"

# CentOS Package Compose
CENTOS_8_COMPOSE = "https://composes.centos.org/latest-CentOS-Stream-8/" \
                   "COMPOSE_ID"
CENTOS_9_COMPOSE = "https://odcs.stream.centos.org/production/" \
                   "latest-CentOS-Stream/compose/.composeinfo"  # noqa E501

# CentOS Mirror slug
CENTOS_8_SLUG = "centos/8-stream/COMPOSE_ID"
CENTOS_9_SLUG = "centos-stream/9-stream/COMPOSE_ID"


# Get CentOS compose ID


class CentosMirror:

    def __init__(self, distro='centos8'):
        self.distro = distro

        if distro == 'centos8':
            self.compose_url = CENTOS_8_COMPOSE
        else:
            self.compose_url = CENTOS_9_COMPOSE
        self.compose_id = self._get_compose_id()
        self.mirror_list = target_mirrors

    def _get_compose_id(self):
        """
        Get CentOS compose ID
        """
        return requests.get(self.compose_url).text

    def _construct_centos_mirror(self, mirror, centos_slug=CENTOS_8_SLUG):
        """
        Construct the CentOS proxy mirror
        """
        return posixpath.join(mirror, centos_slug)


class RDOMirror:
    def __init__(self, release, distro='centos9', promotion='current-tripleo'):
        self.release = release
        self.delorean_md5_file = 'delorean.repo.md5'
        self.promotion_name = promotion
        self.distro = distro
        self.rdo_source = 'https://trunk.rdoproject.org'
        self.dlrn_md5 = 'delorean.repo.md5'

        self.rdo_slug = posixpath.join("-".join([self.distro, self.release]),
                                       self.promotion_name)
        self.dlrn_md5_url = posixpath.join(self.rdo_source, self.rdo_slug,
                                           self.dlrn_md5)

    def verify_url(self):
        url = self.rdo_source + "/" + posixpath.join(
            "-".join([self.distro, self.release]))
        return self.__make_request(url)

    def __make_request(self, url, **headers):
        data = requests.get(url, headers=headers)
        return data

    # Get dlrn md5 hash
    def get_delorean_md5_hash(self,
                              rdo_slug=None,
                              rdo_source="https://trunk.rdoproject.org",
                              dlrn_md5="delorean.repo.md5"):

        """
        Retrive the delorean md5 hash
        """
        if not rdo_slug:
            rdo_slug = self.rdo_slug
        dlrn_md5_url = posixpath.join(rdo_source, rdo_slug, dlrn_md5)
        return self.__make_request(dlrn_md5_url)

    def construct_dlrn_md5_hash_url(self, md5_hash):
        """
        Return DLRN md5 hash generated URL
        """
        return f"{md5_hash[:2]}/{md5_hash[2:4]}/{md5_hash}"

    # Construct full proxy urlfetchMirrors
    def get_rdo_proxy_url(self, mirror, distro, release, md5_hash=None):
        """
        Return full rdo mirror proxy url
        """
        if not distro:
            distro = self.distro
        if not release:
            release = self.release
        release_distro_path = posixpath.join('-'.join([distro, release]),
                                             'current-tripleo')
        rdo_url = ":".join([mirror, '8080/rdo'])

        dlrn_md5_url = self.construct_dlrn_md5_hash_url(md5_hash)
        return posixpath.join(rdo_url, release_distro_path, dlrn_md5_url,
                              "delorean.repo.md5")

    def verify_content(self, content_url, compare_content):
        """
        It verifies the content from source (rdo/centos) to proxy mirror url.
        """
        try:
            proxy_content = requests.get(content_url, timeout=5)
            if compare_content == proxy_content.text:
                return "synced"
            else:
                return "not synced"
        except requests.exceptions.RequestException:
            return "Not found"


def get_rdo_mirrors(release, distro):
    """
    """
    mirror_list = {release: []}
    rdo_mirror = RDOMirror(release, distro)
    if rdo_mirror.verify_url():
        md5_sum = rdo_mirror.get_delorean_md5_hash().text
        for mirror in target_mirrors:
            rdo_proxy_url = rdo_mirror.get_rdo_proxy_url(mirror, distro,
                                                         release,
                                                         md5_sum)
            d = {}
            d['name'] = mirror
            d['release'] = release
            d['distro'] = distro
            d['status'] = rdo_mirror.verify_content(rdo_proxy_url, md5_sum)
            mirror_list[release].append(d)
        return mirror_list
    else:
        return "Invalid release or distro"
