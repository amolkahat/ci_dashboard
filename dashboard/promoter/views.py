import json

import redis
from django.contrib.auth import authenticate
from django.http import JsonResponse
from promoter.lib.dlrn_client import get_component_hashes, get_hashes
from promoter.models import Release
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.


r = redis.Redis()


@api_view(["POST"])
def login(request):
    """
    Handle login for the dashboard.
    :param request:
    :return:
    """
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if not user:
        return Response({"error": "Login failed"},
                        status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})


@api_view(['GET', 'POST'])
def get_release_and_distros(request):
    """
    GET /api/release/ -> Return release list
    GET /api/release/?release=master -> Return distro list
    POST /api/release -> Create release

    :param request:
    :return:
    """
    if request.method == "GET":
        release_query = request.query_params.get("release")
        if not release_query:
            release_list = Release.objects.all()
            output_list = [rel.release_name for rel in release_list]
        else:
            release_list = Release.objects.filter(release_name=release_query)
            output_list = [rel.distro for rel in release_list]
        return Response(output_list, status=status.HTTP_200_OK)
    elif request.method == "POST":
        if request.data:
            print(request.data)
            return Response("Found params")
        else:
            return Response("Not found")


def get_detail_release(request, release):
    """
    GET /api/release/master -> Return specific release
    POST /api/release/master -> Update release
    DELETE /api/release/master -> Delete release

    :param request:
    :param release:
    :return:
    """
    pass


@api_view(['GET'])
def get_promotions(request):
    """
    Get promotion candidates

    :param request:
    :return: JSON response with promotion candidates
    """
    release_name = request.query_params.get('release', 'master')
    distro = request.query_params.get('distro', 'centos9')
    label = request.query_params.get('label', 'tripleo-ci-testing')
    release_db = Release.objects.filter(release_name=release_name,
                                        distro=distro)
    if not release_db:
        return Response("Invalid release or distro",
                        status=status.HTTP_400_BAD_REQUEST)

    release_data = release_db[0].__dict__
    db_hashes = r.get(f"{release_name}_{distro}_{label}")
    # r.delete(f"{release_name}_{distro}_{label}")
    if not db_hashes:
        db_hashes = get_hashes(release_data, label)
        for i in db_hashes.keys():
            if db_hashes[i]['hash_list']:
                db_hashes[i]['hash_list'].sort(key=lambda h: h['timestamp'],
                                               reverse=True)
        r.setex(f"{release_name}_{distro}_{label}", 10000,
                json.dumps(db_hashes))
        return JsonResponse(db_hashes, status=status.HTTP_200_OK)
    return JsonResponse(json.loads(db_hashes),
                        status=status.HTTP_200_OK)


@api_view(['GET'])
def component_promotions(request):
    """
    Get component promotion candidates
    :param request:
    :return: JSON response with component promotion candidates
    """
    c_hash = r.get('component_hashes')
    print(r.ttl('component_hashes'))
    if not c_hash:
        c_hash = get_component_hashes()
        r.setex('component_hashes', 10000, json.dumps(c_hash))
    else:
        c_hash = json.loads(c_hash)
    return JsonResponse(c_hash, status=status.HTTP_200_OK)
