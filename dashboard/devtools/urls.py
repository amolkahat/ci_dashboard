from devtools.views import (job_history, launchpad_bugs, mirrors, review_list,
                            zuul_jobs)
from django.urls import path

urlpatterns = [
    path('jobs/', zuul_jobs, name='jobs'),
    path('jobs/<str:job_name>', job_history, name='zuul_history'),
    path('launchpad/', launchpad_bugs, name='rr'),
    path('mirrors/', mirrors, name='mirrors'),
    path('reviews/', review_list, name='review_list')
]
