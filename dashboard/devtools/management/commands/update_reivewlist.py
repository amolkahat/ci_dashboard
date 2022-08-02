from devtools.lib.review_list import get_gerrit_meta
from devtools.models import GerritModel
# redis_client = redis.Redis()
# Do we need redis?
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """
    Custom commands
    """
    help = "Update launchpad bugs"

    def handle(self, *args, **kwargs):
        """
        Call custom command
        """

        data = GerritModel.objects.all()
        for review in data:
            gerrit_meta = get_gerrit_meta(review.review_url)
            review.review_status = gerrit_meta['status']
            review.save()

        GerritModel.objects.filter(review_status="MERGED").delete()
        GerritModel.objects.filter(completed=True).delete()
