from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatViewSet, get_csrf_token, RegisterView, LogoutView, LoginView, UserProfileAPIView
from .views import ActivateAccountView
from rest_framework_simplejwt.views import TokenRefreshView

from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register(r'chat', ChatViewSet, basename='chat')

urlpatterns = [
    path('', include(router.urls)),

    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileAPIView.as_view(), name='user-profile'),

    path('api/activate/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activate-account'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/get-csrf-token/', get_csrf_token, name='get_csrf_token'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
