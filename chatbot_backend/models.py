from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation {self.id} - {self.user.username if self.user else 'Guest'}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, null=True, blank=True)
    sender = models.CharField(
        max_length=10,
        choices=[('user', 'User'), ('bot', 'Bot')],
        null= True,
        blank=False
    )
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    response_type = models.CharField(
        max_length=10,
        choices=[('ai', 'AI'), ('rule', 'Rule')],
        blank=True,  # Poate fi gol dacă nu este necesar
        default=""    # Evităm erori la salvare
    )
    confidence_score = models.FloatField(null=True, blank=True)  # Poate lipsi pentru reguli

    def __str__(self):
        return f"{self.sender} ({self.response_type if self.response_type else 'N/A'}): {self.text[:50]}"


class Profile(models.Model):
    objects = None
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Legătură cu User
    bio = models.TextField(null=False, default='No bio available')  # Set a default value here
    phone = models.CharField(max_length=15, blank=True, null=True)
    mobile = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_pics/", blank=True, null=True)

    def __str__(self):
        return self.user.username