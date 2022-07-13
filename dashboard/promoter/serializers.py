

from rest_framework import serializers, viewsets

from promoter.models import Release

class ReleaseSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Release
        fields = "__all__"
