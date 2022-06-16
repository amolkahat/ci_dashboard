from django.db import models

# Create your models here.


class ZuulJob(models.Model):
    """
    """
    id = models.AutoField(primary_key=True)
    job_name = models.TextField(max_length=100)
    job_url = models.URLField(unique=True,max_length=200)

    def __str__(self):
        """
        """
        return self.job_name

class ZuulJobHistory(models.Model):
    """
    """
    job_name = models.ForeignKey(ZuulJob, on_delete=models.CASCADE)
    uuid = models.UUIDField(unique=True)
    tests_log_url = models.URLField(null=True,max_length=300)
    duration = models.IntegerField(null=True)
    end_time = models.DateTimeField(null=True)
    event_timestamp = models.DateTimeField(null=True)
    project = models.TextField(max_length=100)
    pipeline = models.TextField(max_length=50)
    result = models.TextField(max_length=10)
    voting = models.BooleanField()
    job_tests = models.TextField(max_length=500)

    def __str__(self):
        return str(self.job_name)
