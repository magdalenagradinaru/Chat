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
    category = serializers.ChoiceField(choices=UserProfile.USER_CATEGORIES)

    def validate(self, data):
        # Validăm dacă parolele sunt identice
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Parolele nu se potrivesc!")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        category = validated_data.pop('category')

        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, category=category)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    category = serializers.CharField(read_only=True)  # Elimină source='category'

    class Meta:
        model = UserProfile
        fields = ['email', 'category']
