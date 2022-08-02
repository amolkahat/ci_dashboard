import json

import redis
from devtools.lib.mirror_sync_status import get_rdo_mirrors
from django.core.management.base import BaseCommand
from promoter.models import Release

r = redis.Redis()


class Command(BaseCommand):
    """
    Custom commands
    """
    help = "Update launchpad bugs"

    def handle(self, *args, **kwargs):
        """
        Call custom command
        """
        releases = Release.objects.all()
        release_name = [(i.release_name, i.distro) for i in releases]
        for release, distro in release_name:
            mirror_list = get_rdo_mirrors(release, distro)
            if "Invalid release or distro" not in mirror_list:
                data = mirror_list[release]
                r.setex(f'mirrors_{release}_{distro}', 10000,
                        json.dumps(data))
