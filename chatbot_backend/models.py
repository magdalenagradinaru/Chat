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



class UserProfile(models.Model):
    CATEGORY_CHOICES = [
        ('consumer', 'Consumator'),
        ('company', 'Companie'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='consumer')
    is_email_confirmed = models.BooleanField(default=False)

    # Câmpuri noi
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)  # Foto de profil
    education = models.TextField(null=True, blank=True)  # Studii
    work_experience = models.TextField(null=True, blank=True)  # Experiență de muncă
    biography = models.TextField(null=True, blank=True)  # Biografie

    def __str__(self):
        return f"{self.user.username}'s profile"

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()
