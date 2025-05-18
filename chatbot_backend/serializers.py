# transforma obiecte Python (modele Django) în date JSON utile ăn lucru cu API

from .models import Conversation, Message, UserProfile
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from .models import Post


# Trimite/recepționează mesaje în cadrul conversațiilor.....................
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['conversation', 'sender', 'text', 'timestamp']



# Include toate mesajele aferente conversației ...............................
class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'user', 'started_at', 'messages']


# Validează cererile de autentificare..........................................
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)



# Verifică coincidența parolelor la înregistrare.............................
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)
    category = serializers.ChoiceField(choices=UserProfile.CATEGORY_CHOICES)

    def validate(self, data):
        # Validăm dacă parolele sunt identice
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Parolele nu se potrivesc!")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        category = validated_data.pop('category')
        email = validated_data['email']  # rămâne în validated_data pentru user
        user = User.objects.create_user(**validated_data)
       # UserProfile.objects.create(user=user, category=category, email=email)
        UserProfile.objects.create(user=user, category=category)

        return user

class ProfileAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'title', 'url']

# Include email din modelul User (prin relația OneToOneField)..................................
class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)  # <-- aceasta linie
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username','user', 'email', 'phone_number', 'address', 'profile_picture',
                  'education', 'work_experience', 'biography', 'category']
        read_only_fields = ['user', 'email']

    def update(self, instance, validated_data):
        attachments_data = validated_data.pop('attachments', None)
        profile = super().update(instance, validated_data)


        return profile

class PublicProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    full_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "username",
            "email",
            "full_name",
            "phone_number",
            "address",
            "education",
            "work_experience",
            "biography",
            "profile_picture",
        ]
        read_only_fields = fields

# Afișează autorului pentru fiecare postare...................................................
class PostSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'created_at']
        read_only_fields = ['author', 'created_at']


from rest_framework import serializers
from .models import PostMessage

class PostMessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source='sender.email', read_only=True)

    class Meta:
        model = PostMessage
        fields = ['id', 'sender_email', 'recipient', 'post', 'content', 'created_at', 'is_read']
        read_only_fields = ['sender_email', 'created_at', 'is_read']
