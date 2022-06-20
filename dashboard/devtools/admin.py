from django.contrib import admin

# Register your models here.

from .models import ZuulJob, ZuulJobHistory


admin.site.register(ZuulJob)
admin.site.register(ZuulJobHistory)