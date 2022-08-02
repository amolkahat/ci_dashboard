# Create your views here.

import json
import logging

import redis
from devtools.lib.launchpad import get_bugs
from devtools.lib.mirror_sync_status import get_rdo_mirrors
from devtools.lib.review_list import get_gerrit_meta
from devtools.models import ZuulJob
from devtools.serializers import ReviewListSerializer, ZuulJobWriteSerializer
from django.conf import settings
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from django.db import IntegrityError
from django.http import HttpResponse, JsonResponse
from rest_framework import status as st
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from .models import GerritModel

logger = logging.getLogger(__name__)
CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)
redis_client = redis.Redis()


def url_is_valid(url):
    """
    Check that url is valid or not
    """
    val = URLValidator()
    try:
        val(url)
        return True
    except ValidationError:
        return False


@api_view(['GET', 'POST'])
def review_list(request):
    """
    """
    if request.method == "GET":
        data = GerritModel.objects.all()
        rl = ReviewListSerializer(data, many=True)
        return JsonResponse(rl.data, safe=False,
                            status=st.HTTP_200_OK)

    elif request.method == "POST":
        return_data = {}
        data = {}
        url = request.data['review_url']
        data['review_url'] = url
        return_status = st.HTTP_200_OK
        if url_is_valid(url):
            review_data = get_gerrit_meta(url)
            if isinstance(review_data, dict):
                data.update({
                    'review_status': review_data['status'],
                    'review_topic': review_data.get('topic', ''),
                    'review_owner': review_data['owner']['_account_id'],
                    'subject': review_data['subject']
                })
                try:
                    GerritModel(**data).save()
                    return_status = st.HTTP_201_CREATED
                except IntegrityError:
                    msg = f"Duplicate url: {url}"
                    return_data['error'] = True
                    return_data['msg'] = msg
                    return_status = st.HTTP_400_BAD_REQUEST
            # else:
            #     return_data.update({'list': reviews_list, 'error': True,
            #                         'msg': f'Invalid URL: {url}'})
            #     return_status = st.HTTP_400_BAD_REQUEST
            # return JsonResponse(return_data, safe=False,
            #                     status=return_status)
        else:
            return_data.update({'error': True, 'msg': f'Invalid URL: {url}'})
            return_status = st.HTTP_400_BAD_REQUEST
        gerrit_data = GerritModel.objects.all()
        review_list = ReviewListSerializer(gerrit_data, many=True)

        return_data.update({'list': review_list.data})
        return JsonResponse(return_data, safe=False,
                            status=return_status)


@api_view(['POST'])
def mark_done(request, id):
    if request.method == "POST":
        if id is not None:
            data = GerritModel.objects.filter(id=id)
            if not data:
                return JsonResponse({'msg': 'Invalid id'},
                                    status=st.HTTP_404_NOT_FOUND)
            else:
                data[0].completed = True
                data[0].save()
                return JsonResponse({'msg': 'Marked done'},
                                    status=st.HTTP_200_OK)
        else:
            return JsonResponse({'msg': 'Review id required'},
                                status=st.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def mirrors(request):
    if request.method == 'GET':
        release = request.query_params.get('release', 'master')
        distro = request.query_params.get('distro', 'centos9')
        data = redis_client.get(f'mirrors_{release}_{distro}')
        if not data:
            data = get_rdo_mirrors(release, distro)
            if isinstance(data, str):
                return Response(data, status=st.HTTP_400_BAD_REQUEST)
            else:
                data = data[release]
            redis_client.setex(f'mirrors_{release}_{distro}', 10000,
                               json.dumps(data))
        else:
            data = json.loads(data)
        return Response(data, status=st.HTTP_200_OK)
    else:
        return Response("Bad Request", status=st.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'DELETE', 'PUT'])
def zuul_jobs(request):
    if request.method == "GET":
        jobs_in_redis = redis_client.get('zuul_jobs')
        if not jobs_in_redis:
            data = ZuulJob.objects.values()
            data = list(data)
            redis_client.set('zuul_jobs', json.dumps(data))
            return JsonResponse(data, safe=False, status=st.HTTP_200_OK)
        data = json.loads(jobs_in_redis)
        return JsonResponse(data, safe=False, status=st.HTTP_200_OK)
    if request.method == "POST":
        jobs_data = JSONParser().parse(request)
        jobs_serializer = ZuulJobWriteSerializer(jobs_data)
        if jobs_serializer.is_valid():
            jobs_serializer.save()
            return JsonResponse(jobs_serializer.data, safe=False,
                                status=st.HTTP_201_CREATED)
        return JsonResponse(jobs_serializer.errors,
                            status=st.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def job_history(request, job_name):
    if request.method == "GET":
        job_history = redis_client.get(f'history_{job_name}')
        if not job_history:
            # TODO create job history
            data = "Job history not found"
        else:
            data = json.loads(job_history)
        return HttpResponse(data, status=st.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def launchpad_bugs(request):
    bugs = redis_client.get('launchpad_bugs')
    if not bugs:
        bugs_list = [{}]
        status = ['New', 'Triaged', 'In Progress', 'Confirmed',
                  'Fix Committed']
        bugs = get_bugs(status=status)
        bugs_list = [{'id': bug.bug.id, 'status': bug.status,
                      'tag': bug.bug.tags, 'link': bug.web_link,
                      'title': bug.bug.title} for bug in bugs]
        redis_client.setex('launchpad_bugs', 10000, json.dumps(bugs_list))
        return Response(bugs_list, status=st.HTTP_200_OK)
    else:
        return Response(json.loads(bugs), status=st.HTTP_200_OK)
