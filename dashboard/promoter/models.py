from django.db import models

# Create your models here.

class Release(models.Model):
    release_id = models.IntegerField(primary_key=True, auto_created=True,
                                     null=False)
    release_name = models.CharField(null=False, max_length=30)
    distro = models.CharField(max_length=30)
    dlrn_host = models.URLField(max_length=200)
    hashes_count = models.IntegerField()
    source_namespace = models.CharField(max_length=50)
    target_namespace = models.CharField(max_length=50)
    source_registry = models.URLField()
    target_registry = models.URLField()
    # Use ArrayField to add multiple targets
    promotions = models.JSONField(null=True)

    def __str__(self):
        return self.release_name + "_" + self.distro
