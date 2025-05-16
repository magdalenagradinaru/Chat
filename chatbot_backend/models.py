from django.contrib.auth import get_user_model
from django.db import models
from django.contrib.auth.models import User

# Modele pentru a defini structura Bazei de Date

# Chatbot..................................................
class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation {self.id} - {self.user.username if self.user else 'Guest'}"

# Mesaje cu chatbot-ul....................................
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
        blank=True,
        default=""
    )
    confidence_score = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.sender} ({self.response_type if self.response_type else 'N/A'}): {self.text[:50]}"


# Profilul utilizatorilor.....................................
class UserProfile(models.Model):
    CATEGORY_CHOICES = [
        ('consumer', 'Consumator'),
        ('company', 'Companie'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='consumer')
    is_email_confirmed = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    education = models.TextField(null=True, blank=True)
    work_experience = models.TextField(null=True, blank=True)
    biography = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"



# Postările utilizatorilor ...............................................
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.author.username} on {self.created_at}"

User = get_user_model()


class PostMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    post = models.ForeignKey('Post', on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)  # <-- adăugat

    def __str__(self):
        return f"From {self.sender} to {self.recipient}"
