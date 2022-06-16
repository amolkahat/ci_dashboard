# import the todo data model
from devtools.models import ZuulJob, ZuulJobHistory
from rest_framework import serializers


# create a serializer class
class ZuulJobReadSerializer(serializers.ModelSerializer):
    """
    """
    # create a meta class
    class Meta:
        model = ZuulJob
        fields = "__all__"

class ZuulJobWriteSerializer(serializers.ModelSerializer):
    """
    """
    class Meta:
        model = ZuulJob
        fields = ("job_url",)


class ZuulJobHistorySerializer(serializers.ModelSerializer):
    """
    """
    jobs = ZuulJobReadSerializer(read_only=True)
    job_name = serializers.SerializerMethodField()
    class Meta:
        model = ZuulJobHistory
        fields = "__all__"

    def get_job_name(self, obj):
        print(self)
