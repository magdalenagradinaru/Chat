from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatViewSet, get_csrf_token, RegisterView, LogoutView, LoginView
from .views import ActivateAccountView, ProfileView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'chat', ChatViewSet, basename='chat')

urlpatterns = [
    path('', include(router.urls)),

    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),

    path('api/activate/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activate-account'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/get-csrf-token/', get_csrf_token, name='get_csrf_token'),
]