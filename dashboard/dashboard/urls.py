"""dashboard URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views

    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from devtools.views import (LaunchpadBugsViewSet, ZuulJobHistoryViewSet,
                            ZuulJobsViewSet, MirrorViewSet)
from django.contrib import admin
from django.urls import include, path
# from rest_framework import routers
from rest_framework_nested import routers

router = routers.DefaultRouter()

router.register(r'jobs', ZuulJobsViewSet, 'jobs')
router.register(r'launchpad', LaunchpadBugsViewSet, basename='rr')
router.register(r'mirrors', MirrorViewSet, basename='mirros')

domains_router = routers.NestedSimpleRouter(router, r'jobs',
                                            lookup='job')
domains_router.register(r'history', ZuulJobHistoryViewSet,
                        basename='jobs-history')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include(domains_router.urls)),
    # path('api/', include(rr_router.urls))
]
