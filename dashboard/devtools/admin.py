from django.contrib import admin

from .models import ZuulJob, ZuulJobHistory

# Register your models here.



admin.site.register(ZuulJob)
admin.site.register(ZuulJobHistory)
