# Create your views here.

from devtools.models import ZuulJob, ZuulJobHistory
from devtools.serializers import (ZuulJobHistorySerializer,
                                  ZuulJobReadSerializer,
                                  ZuulJobWriteSerializer)
from rest_framework import viewsets
from rest_framework.response import Response
from dashboard.celery import add_history_records

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

    def perform_create(self, serializer):
        url = serializer.validated_data.get('job_url')
        host, job_name = url.split("job_name=")
        serializer.validated_data.update({'job_name': job_name})
        serializer.save()
        add_history_records.delay(host, job_name)


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