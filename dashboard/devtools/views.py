# Create your views here.

from devtools import models
from devtools.lib import zuul
from devtools.models import LaunchpadBugs, ZuulJob, ZuulJobHistory
from devtools.serializers import (LaunchpadBugsSerializer,
                                  ZuulJobHistorySerializer,
                                  ZuulJobReadSerializer,
                                  ZuulJobWriteSerializer)
from rest_framework import viewsets
from rest_framework.response import Response

from dashboard.tasks import add_history_records


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
        d = {'job_name': '', 'job_domain': '', 'job_url': ''}
        d['job_url'] = serializer.validated_data.get('job_url')
        d['job_name'] = serializer.validated_data.get('job_name')
        d['job_domain'] = serializer.validated_data.get('job_domain')
        serializer.validated_data.update(d)

        def extract_tests(zuulJob):
            test_data = []
            for test in zuulJob.get_tests():
                for k, v in test.items():
                    test_data.append(f"{k}_{v}")
            return test_data

        job_dict = d.copy()
        print("From Celery task: ", job_dict)
        job_obj = models.ZuulJob.objects.filter(job_name=job_dict['job_name'])
        zuul_obj = zuul.ZuulJob(job_dict['job_name'], job_dict['job_url'], **job_dict)
        job_builds = zuul_obj.get_builds()
        for job in job_builds:
            log_url = job.log_url
            tests = extract_tests(job)
            models.ZuulJobHistory(
                job_name=job_obj,
                uuid=job.build_uuid,
                tests_log_url=log_url,
                duration=job.kwargs['duration'],
                end_time=job.kwargs['end_time'],
                event_timestamp=job.kwargs['event_timestamp'],
                project=job.kwargs['project'],
                pipeline=job.kwargs['pipeline'],
                result=job.kwargs['result'],
                voting=job.kwargs['voting'],
                job_tests=tests,
            ).save()
        serializer.save()


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
