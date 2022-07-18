from django.urls import path
from promoter.views import get_promotions, get_release_and_distros

urlpatterns = [
    path(r'promotions/', get_promotions, name='get_promotions'),
    path(r'releases/', get_release_and_distros, name='releases')
]
