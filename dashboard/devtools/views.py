# Create your views here.

from devtools.lib.mirror_sync_status import get_rdo_mirrors
from devtools import serializers
from devtools.models import LaunchpadBugs, ZuulJob, ZuulJobHistory
from devtools.serializers import (LaunchpadBugsSerializer,
                                  ZuulJobHistorySerializer,
                                  ZuulJobReadSerializer,
                                  ZuulJobWriteSerializer)
from rest_framework import viewsets
from rest_framework.response import Response

from django.conf  import settings
from dashboard.tasks import add_history_records
from django.core.cache.backends.base import DEFAULT_TIMEOUT
import  logging
import json
import redis
logger = logging.getLogger(__name__)

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)


class MirrorViewSet(viewsets.ViewSet):
    serializer_class = serializers.MirrorSerializer

    def list(self, request):
        r = redis.Redis()
        data = r.get('mirrors')
        if not data[0]:
            print("Setting data")
            yourdata = get_rdo_mirrors('master', 'centos9')
            r.set('mirrors', json.dumps(yourdata))
        serializer = serializers.MirrorSerializer(
            instance=json.loads(data)['master'], many=True
        )
        return Response(serializer.data)


class ZuulJobsViewSet(viewsets.ModelViewSet):
    queryset = ZuulJob.objects.all()
    http_method_names = ['get', 'put', 'delete', 'post']
    serializer_class = ZuulJobWriteSerializer

    def get_serializer_class(self):
        """
        Determins which serializer to user `list` or `detail`
        """
        if self.action == 'retrieve':
            if hasattr(self, 'detail_serializer_class'):
                return self.detail_serializer_class
        return super().get_serializer_class()

    def list(self, serializer):
        data = ZuulJobWriteSerializer(self.queryset, many=True)
        return Response(data.data)


    def perform_create(self, serializer):
        d = {'job_name': serializer.validated_data.get('job_name', ""),
             'job_domain': serializer.validated_data.get('job_domain', ""),
             'job_url': serializer.validated_data.get('job_url', "")}
        serializer.validated_data.update(d)
        serializer.save()
        add_history_records(d)




class ZuulJobHistoryViewSet(viewsets.ViewSet):
    """
    """
    serializer_class = ZuulJobHistorySerializer

    def list(self, request, job_pk=None):
        queryset = ZuulJobHistory.objects.filter(job_name_id=job_pk)
        serializer = ZuulJobHistorySerializer(data=queryset, many=True)
        return Response(serializer.data.values())

    # def get_queryset(self):
    #     return ZuulJobHistory.objects.filter(job_name_id=self.kwargs.get('job_pk'))


class LaunchpadBugsViewSet(viewsets.ViewSet):
    """
    """
    serializer_class = LaunchpadBugsSerializer

    def list(self, request):
        queryset = LaunchpadBugs.objects.all()
        serializer = LaunchpadBugsSerializer(data=queryset, many=True)
        return Response(serializer.data.values())
