# Create your views here.


from devtools.models import ZuulJob, ZuulJobHistory
from devtools.serializers import (ZuulJobHistorySerializer,
                                  ZuulJobReadSerializer,
                                  ZuulJobWriteSerializer)
from rest_framework import viewsets


class ZuulJobsViewSet(viewsets.ModelViewSet):
    queryset = ZuulJob.objects.all()
    http_method_names = ['get', 'put', 'delete', 'post']

    def get_serializer_class(self):
        if self.action in ['create', 'delete']:
            return ZuulJobWriteSerializer
        return ZuulJobReadSerializer

    def perform_create(self, serializer):
        url = serializer.validated_data.get('job_url')
        job_name = url.split("job_name=")[1].strip()
        serializer.validated_data.update({'job_name': job_name})
        serializer.save()


class ZuulJobHistoryViewSet(viewsets.ModelViewSet):
    queryset = ZuulJobHistory.objects.all()
    http_method_names = ['get', 'post', 'delete']


    def get_serializer_class(self):
        if 'job_name' in self.request.query_params:
            name = self.request.query_params.get('job_name')
            queryset = ZuulJobHistory.objects.filter(job_name=name)
            print(queryset)
        return ZuulJobHistorySerializer

    def get_serializer_context(self):
        print("CONtext Serializer")
        return {'job_name': self.request.GET.get('job_name')}
