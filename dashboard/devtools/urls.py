from django.urls import path
from devtools.views import launchpad_bugs, mirrors, zuul_jobs, job_history

urlpatterns = [
    path('jobs/', zuul_jobs, name='jobs'),
    path('jobs/<str:job_name>', job_history, name='zuul_history'),
    path('launchpad/', launchpad_bugs, name='rr'),
    path('mirrors/', mirrors, name='mirrors'),
]
