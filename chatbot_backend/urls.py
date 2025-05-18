from django.urls import path, include

from . import views
from .views import ChatViewSet, get_csrf_token, RegisterView, LogoutView, LoginView, UserProfileAPIView, PostAPIView, \
    InboxMessagesView, PublicProfileView
from .views import ActivateAccountView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'chat', ChatViewSet, basename='chat')

urlpatterns = [
    path('', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/profile/', UserProfileAPIView.as_view(), name='user-profile'),
    path('api/posts/', PostAPIView.as_view(), name='post-list'),
    path('api/send-message/', views.send_message, name='send_message'),  # Adaugă prefixul 'api/'
    path('api/activate/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activate-account'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/get-csrf-token/', get_csrf_token, name='get_csrf_token'),
    path('api/messages/inbox/', InboxMessagesView.as_view(), name='inbox-messages'),
    path('api/messages/<int:pk>/mark_read/', InboxMessagesView.as_view(), name='mark-message-read'),
    path('api/profile/<str:username>/', PublicProfileView.as_view(), name='public-profile'),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
