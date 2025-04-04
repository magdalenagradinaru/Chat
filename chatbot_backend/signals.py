from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile  # Asigură-te că ai un model Profile

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, created, **kwargs):
    if created:  # Dacă utilizatorul a fost creat
        Profile.objects.create(user=instance)  # Crează un profil nou pentru utilizator
    else:
        instance.profile.save()  # Salvează profilul existent