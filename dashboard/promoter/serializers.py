from promoter.models import Release
from rest_framework import serializers


class ReleaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Release
        fields = "__all__"
