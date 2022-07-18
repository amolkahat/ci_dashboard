import re
import redis
from django.contrib.auth import authenticate
from django.http import HttpResponse, JsonResponse
from promoter.lib.dlrn_client import get_hashes
from promoter.models import Release
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json

# Create your views here.


r = redis.Redis()


@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if not user:
        return Response({"error": "Login failed"},
                        status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})


@api_view(['GET'])
def get_release_and_distros(request):
    if request.method == "GET":
        release_dict = {}
        release_list = Release.objects.all()
        for release in release_list:
            if release.release_name in release_dict.keys():
                release_dict[release.release_name].append(release.distro)
            else:
                release_dict[release.release_name] = []
                release_dict[release.release_name].append(release.distro)
        return Response(release_dict, status=status.HTTP_200_OK)
    # if request.method == 'GET':
    #     if request.query_params.get('release', None):
    #         release_name = request.query_params.get('release')
    #         distro_list = Release.objects.filter(release_name=release_name)
    #         if not distro_list:
    #             return Response("Invalid Release",
    #                             status=status.HTTP_400_BAD_REQUEST)
    #         distro_list = [distro.distro for distro in distro_list]
    #         return Response(list(set(distro_list)), status=status.HTTP_200_OK)
    #     else:
    #         releases = Release.objects.all()
    #         release_list = [release.release_name for release in releases]
    #         return Response(list(set(release_list)))


@api_view(['GET'])
def get_promotions(request):
    release_name = request.query_params.get('release', 'master')
    distro = request.query_params.get('distro', 'centos9')
    label = request.query_params.get('label', 'tripleo-ci-testing')

    print(release_name, distro)

    release_db = Release.objects.filter(release_name=release_name,
                                        distro=distro)
    if not release_db:
        return Response("Invalid release or distro",
                        status=status.HTTP_400_BAD_REQUEST)

    release_data = release_db[0].__dict__
    db_hashes = r.get(f"{release_name}_{distro}_{label}")
    print(f"{release_name}_{distro}_{label}")
    # r.delete(f"{release_name}_{distro}_{label}")
    if not db_hashes:
        db_hashes = get_hashes(release_data, label)
        r.setex(f"{release_name}_{distro}_{label}", 1000, json.dumps(db_hashes))
        return JsonResponse(db_hashes, status=status.HTTP_200_OK)
    return JsonResponse(json.loads(db_hashes),
                        status=status.HTTP_200_OK)
