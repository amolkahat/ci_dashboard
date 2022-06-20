"""
Serializers
"""
# import the todo data model
from devtools.models import ZuulJob, ZuulJobHistory
from rest_framework import serializers
from rest_framework import viewsets


# create a serializer class
class ZuulJobReadSerializer(viewsets.ReadOnlyModelViewSet):
    """
    Zuul job read serializer
    """
    # create a meta class
    class Meta:
        model = ZuulJob
        fields = "__all__"

class ZuulJobWriteSerializer(serializers.ModelSerializer):
    """
    Zuul job write serializer
    """
    class Meta:
        model = ZuulJob
        fields = "__all__"


class ZuulJobHistorySerializer(viewsets.ReadOnlyModelViewSet):
    """
    Zuul job history read only serializer
    """
    jobs = ZuulJobReadSerializer(read_only=True, many=True)
    class Meta:
        """
        """
        model = ZuulJobHistory
        fields = "__all__"