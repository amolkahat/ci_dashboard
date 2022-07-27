"""
Serializers
"""
from devtools.models import GerritModel, LaunchpadBugs, ZuulJob, ZuulJobHistory
from rest_framework import serializers, viewsets


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


class LaunchpadBugsSerializer(viewsets.ReadOnlyModelViewSet):
    """
    Launchpad serializers
    """

    class Meta:
        """
        """
        model = LaunchpadBugs
        fields = "__all__"


class MirrorSerializer(serializers.Serializer):
    """
    Mirror serializer.
    """
    name = serializers.CharField(max_length=256)
    status = serializers.CharField(max_length=20)
    release = serializers.CharField(max_length=20)
    distro = serializers.CharField(max_length=20)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        return instance

    def create(self, validated_data):
        for field, value in validated_data.items():
            setattr(self, field, value)


class ReviewListSerializer(serializers.ModelSerializer):
    """
    Review List serializer
    """
    class Meta:
        model = GerritModel
        fields = "__all__"
