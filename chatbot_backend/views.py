from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from .chatbot_logic import get_chatbot_response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Profile
from .serializers import ProfileSerializer, LoginSerializer, RegisterSerializer
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.http import JsonResponse


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


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            # Căutăm utilizatorul pe baza username-ului
            user = authenticate(request, username=username, password=password)

            if user is not None:
                # Autentificăm utilizatorul
                login(request, user)
                return Response({
                    'message': 'Autentificare reușită!',
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
            username = serializer.validated_data['username']
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            # Creăm un utilizator nou
            user = User.objects.create_user(username=username, email=email, password=password)

            # Opțional: trimitem un email de confirmare
            send_mail(
                'Confirmare înregistrare',
                'Mulțumim pentru înregistrare!',
                'from@example.com',  # Adresa de e-mail de trimitere
                [email],
                fail_silently=False,
            )

            return Response({
                'message': 'Înregistrare reușită!',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


# UserProfileView
class UserProfileView(APIView):
    permission_classes = []

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response({"detail": "Profilul nu a fost găsit."}, status=status.HTTP_404_NOT_FOUND)

