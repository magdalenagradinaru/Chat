from .models import Conversation, Message, UserProfile
from rest_framework import serializers
from django.contrib.auth.models import User


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['conversation', 'sender', 'text', 'timestamp']


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'user', 'started_at', 'messages']



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

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
        UserProfile.objects.create(user=user, category=category, email=email)
        return user


# serializers.py
from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)  # <-- aceasta linie

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'email', 'phone_number', 'address', 'profile_picture',
                  'education', 'work_experience', 'biography', 'category']
        read_only_fields = ['user', 'email']


from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'created_at']
        read_only_fields = ['author', 'created_at']
