from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatViewSet, get_csrf_token, UserProfileView, RegisterView, LogoutView, LoginView

router = DefaultRouter()
router.register(r'chat', ChatViewSet, basename='chat')

urlpatterns = [
    path('', include(router.urls)),

    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),

    path('api/get-csrf-token/', get_csrf_token, name='get_csrf_token'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
