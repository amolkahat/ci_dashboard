
from django.http import HttpResponse
from promoter.lib.dlrn_client import get_hashes
from rest_framework import status
from promoter.models import Release
# Create your views here.

from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
import redis


r = redis.Redis()


@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if not user:
        return Response({"error": "Login failed"}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})


@api_view(['GET'])
def get_release(request):
    if request.method == 'GET':
        if request.query_params.get('release', None):
            release_name = request.query_params.get('release')
            distro_list = Release.objects.filter(release_name=release_name)
            distro_list = [distro.distro for distro in distro_list]
            return Response(distro_list)
        else:
            releases = Release.objects.all()
            release_list = [release.release_name for release in releases]
            return Response(release_list)


@api_view(['GET'])
def get_promotions(request):
    release_name = request.query_params.get('release', 'master')
    distro = request.query_params.get('distro', 'centos9')
    label = request.query_params.get('label', 'tripleo-ci-testing')

    import pdb; pdb.set_trace()
    release = Release.objects.filter(release_name=release_name,
                                        distro=distro)
    if not release:
        return Response("Invalid release or distro", status=status.HTTP_400_BAD_REQUEST)

    release_data = release[0].__dict__
    get_hashes(release_data, label)
    return HttpResponse("Success, {} {}".format(release_name,distro))