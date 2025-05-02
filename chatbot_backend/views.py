from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from .chatbot_logic import get_chatbot_response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import  LoginSerializer, RegisterSerializer
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.http import JsonResponse

from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.conf import settings

from django.utils.http import urlsafe_base64_decode
from django.shortcuts import redirect


from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser

# Chatbot view
class ChatViewSet(ViewSet):
    def create(self, request):
        user_message = request.data.get('message')

        if not user_message:
            return Response({'error': 'No message provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            bot_response = get_chatbot_response(user_message)
            return Response({'response': bot_response}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Error generating chatbot response: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from rest_framework_simplejwt.tokens import RefreshToken


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)

                # Generate JWT token
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                return Response({
                    'access': access_token,
                    'refresh': str(refresh),
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Username sau parolă incorectă'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            activation_link = request.build_absolute_uri(
                reverse('activate-account', kwargs={'uidb64': uid, 'token': token})
            )

            message = render_to_string('email_confirmation.html', {
                'user': user,
                'activation_link': activation_link,
            })

            send_mail(
                'Confirmă-ți contul',
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
                html_message=message
            )

            return Response({'message': 'Înregistrare reușită. Verifică email-ul pentru confirmare.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivateAccountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            # Decodifică uid și obține utilizatorul
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        # Verifică tokenul de activare
        if user and default_token_generator.check_token(user, token):
            user.profile.is_email_confirmed = True
            user.profile.save()

            # Redirecționează către frontend (react app)
            return redirect(settings.LOGIN_REDIRECT_URL)

        # În caz de eroare, returnează un răspuns JSON
        return Response({'error': 'Link invalid sau expirat!'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Delogăm utilizatorul
        logout(request)
        return Response({'message': 'Delogare reușită!'}, status=200)

# Endpoint pentru verificarea autentificării utilizatorului
def check_authentication(request):
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True, 'username': request.user.username})
    return JsonResponse({'authenticated': False})


# Endpoint pentru token-ul CSRF
def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework import status

class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profilul nu există.'}, status=404)

    def put(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profilul nu există.'}, status=404)

        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
