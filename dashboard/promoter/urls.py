from promoter.views import get_promotions, get_release

from django.urls import path



urlpatterns = [
    path(r'promotions/', get_promotions, name='get_promotions'),
    path(r'releases/', get_release, name='get_releases')
]
