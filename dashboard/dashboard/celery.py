import os

from celery import Celery

# from django.conf import settings


# settings.configure()
os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'dashboard.settings')
import django

django.setup()
app = Celery('dashboard', backend="redis://localhost:6379/0",
             broker="redis://localhost:6379/0")

app.config_from_object('django.conf:settings', namespace='CELERY')
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
app.autodiscover_tasks()
