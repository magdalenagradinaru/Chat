from django.contrib import admin
from .models import Conversation, Message

class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'started_at')
    search_fields = ('user__username',)
    list_filter = ('started_at',)

class MessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'sender', 'text', 'timestamp', 'response_type')
    search_fields = ('text',)
    list_filter = ('sender', 'response_type', 'timestamp')

admin.site.register(Conversation, ConversationAdmin)
admin.site.register(Message, MessageAdmin)
