from django.contrib import admin
from .models import Conversation, Message, UserProfile

class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'started_at')
    search_fields = ('user__username',)
    list_filter = ('started_at',)

class MessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'sender', 'text', 'timestamp', 'response_type', 'confidence_score')
    search_fields = ('text',)
    list_filter = ('sender', 'response_type', 'timestamp')

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'is_email_confirmed', 'phone_number')
    search_fields = ('user__username', 'phone_number', 'address')
    list_filter = ('category', 'is_email_confirmed')

admin.site.register(Conversation, ConversationAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
