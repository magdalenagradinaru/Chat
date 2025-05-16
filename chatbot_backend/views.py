from rest_framework.decorators import api_view, permission_classes
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
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.conf import settings
from .models import UserProfile
from .serializers import UserProfileSerializer
from django.utils.http import urlsafe_base64_decode
from django.shortcuts import redirect
from .models import Post
from .serializers import PostSerializer
from rest_framework.parsers import MultiPartParser, FormParser

# Chatbot view....................................................................
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


# Login view....................................................................................
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



# Logout view...........................................................................
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Delogăm utilizatorul
        logout(request)
        return Response({'message': 'Delogare reușită!'}, status=200)



# Register view.......................................................................
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



# Activarea contului prin email................................................................
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

        return Response({'error': 'Link invalid sau expirat!'}, status=status.HTTP_400_BAD_REQUEST)



# Endpoint pentru verificarea autentificării utilizatorului................................................
def check_authentication(request):
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True, 'username': request.user.username})
    return JsonResponse({'authenticated': False})


# Endpoint pentru token-ul CSRF...........................................................................
def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


# view pentru profilul utilizatorului.....................................................................
class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profilul nu există.'}, status=404)

    def put(self, request):
        profile = request.user.userprofile
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

# Post view.................................................................................
class PostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        content = request.data.get('content')
        if not content:
            return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)

        post = Post.objects.create(author=request.user, content=content)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


from .models import PostMessage
from .serializers import PostMessageSerializer




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    post_id = request.data.get('post_id')
    content = request.data.get('message')  # mesajul trimis din frontend



    if not post_id or not content:
        return Response({"detail": "Post ID and message are required."}, status=400)


    try:
        post = Post.objects.get(id=post_id)
        recipient = post.author

        print(f"User: {request.user.username}")
        print(f"Post Author: {recipient.username}")

        if request.user == recipient:
            return Response({"detail": "Nu poți trimite mesaje pentru propria postare."}, status=400)

        message = PostMessage.objects.create(
            sender=request.user,
            recipient=recipient,
            post=post,
            content=content
        )

        serializer = PostMessageSerializer(message)
        return Response(serializer.data, status=201)

    except Post.DoesNotExist:
        return Response({"detail": "Post not found."}, status=404)
    except Exception as e:
        return Response({"detail": f"Error sending message: {str(e)}"}, status=500)



class InboxMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        messages = PostMessage.objects.filter(recipient=user).order_by('-created_at')
        serializer = PostMessageSerializer(messages, many=True)
        return Response(serializer.data)

    def patch(self, request, pk=None):
        user = request.user
        message_id = pk or request.data.get('id')
        if not message_id:
            return Response({'error': 'ID mesaj lipsă'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            message = PostMessage.objects.get(id=message_id, recipient=user)
        except PostMessage.DoesNotExist:
            return Response({'error': 'Mesajul nu există sau nu îți aparține'}, status=status.HTTP_404_NOT_FOUND)

        if not message.is_read:
            message.is_read = True
            message.save()

        return Response({'status': 'Mesaj marcat ca citit'}, status=status.HTTP_200_OK)
