from statistics import mode
from django.db import models

# Create your models here.


class ZuulJob(models.Model):
    """
    Zuul Job
    """
    id = models.AutoField(primary_key=True)
    job_name = models.TextField(max_length=100)
    job_url = models.URLField(unique=True,max_length=200)
    job_domain = models.TextField(max_length=100)

    def __str__(self):
        """
        Print job name
        """
        return self.job_name

class ZuulJobHistory(models.Model):
    """
    Zuul Job history
    """
    job_name = models.ForeignKey(ZuulJob, on_delete=models.CASCADE)
    uuid = models.UUIDField(primary_key=True, unique=True)
    tests_log_url = models.URLField(null=True,max_length=300)
    duration = models.IntegerField(null=True)
    end_time = models.DateTimeField(null=True)
    event_timestamp = models.DateTimeField(null=True)
    project = models.TextField(max_length=100)
    pipeline = models.TextField(max_length=50)
    result = models.TextField(max_length=10)
    voting = models.BooleanField()
    job_tests = models.TextField(max_length=1500)

    def __str__(self):
        "Print job name"
        return "ZuulJobHistory " + str(self.job_name)
