# Create your views here.

import json
import logging

import redis
from devtools import serializers
from devtools.lib.mirror_sync_status import get_rdo_mirrors
from devtools.models import LaunchpadBugs, ZuulJob, ZuulJobHistory
from devtools.serializers import (LaunchpadBugsSerializer,
                                  ZuulJobHistorySerializer,
                                  ZuulJobReadSerializer,
                                  ZuulJobWriteSerializer)
from django.conf import settings
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse, HttpResponse
from dashboard.tasks import add_history_records
from rest_framework.parsers import JSONParser

logger = logging.getLogger(__name__)

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

redis_client = redis.Redis()


@api_view(['GET'])
def mirrors(request):
    if request.method == 'GET':
        release = request.query_params.get('release', 'master')
        distro = request.query_params.get('distro', 'centos9')
        data = redis_client.get(f'mirrors_{release}_{distro}')
        if not data:
            data = get_rdo_mirrors(release, distro)
            if isinstance(data, str):
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            else:
                data = data[release]
            redis_client.set(f'mirrors_{release}_{distro}',
                             json.dumps(data))
        else:
            data = json.loads(data)
        return Response(data, status=status.HTTP_200_OK)
    else:
        return Response("Bad Request", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'DELETE', 'PUT'])
def zuul_jobs(request):
    if request.method == "GET":
        jobs_in_redis = redis_client.get('zuul_jobs')
        if not jobs_in_redis:
            data = ZuulJob.objects.values()
            data = list(data)
            redis_client.set('zuul_jobs', json.dumps(data))
            return JsonResponse(data, safe=False, status=status.HTTP_200_OK)
        data = json.loads(jobs_in_redis)
        return JsonResponse(data, safe=False, status=status.HTTP_200_OK)
    if request.method == "POST":
        jobs_data = JSONParser().parse(request)
        jobs_serializer = ZuulJobWriteSerializer(jobs_data)
        if jobs_serializer.is_valid():
            jobs_serializer.save()
            return JsonResponse(jobs_serializer.data, safe=False,
                                status=status.HTTP_201_CREATED)
        return JsonResponse(jobs_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def job_history(request, job_name):
    if request.method == "GET":
        job_history = redis_client.get(f'history_{job_name}')
        if not job_history:
            # TODO create job history
            data = "Job history not found"
        else:
            data = json.loads(job_history)
        return HttpResponse(data, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def launchpad_bugs(request):
    queryset = LaunchpadBugs.objects.all()
    serializer = LaunchpadBugsSerializer(data=queryset, many=True)
    return Response(serializer.data.values(), status=status.HTTP_200_OK)
