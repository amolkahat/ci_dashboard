

from .views import (LaunchpadBugsViewSet, ZuulJobHistoryViewSet,
                    ZuulJobsViewSet, MirrorViewSet)
from django.urls import include, path

zuul_job_view_set = {'put': 'perform_create', 'get': 'list'}
launchpad_view_set = {'get': 'list'}
mirror_view_set = {'get': 'list'}
dlrn_view_set = {'get': 'list'}

urlpatterns = [
    path('jobs', ZuulJobsViewSet.as_view(zuul_job_view_set), name='jobs'),
    path('launchpad', LaunchpadBugsViewSet.as_view(launchpad_view_set), name='rr'),
    path('mirrors', MirrorViewSet.as_view(mirror_view_set   ), name='mirror'),
]