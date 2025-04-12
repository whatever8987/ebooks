from django.contrib import admin
from .models import Ebook, Type

# Customize the display of the Type model in the admin
class TypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'slug', 'title')  # Fields to display in the list view
    search_fields = ('title',)  # Enable search by title
    list_filter = ('slug',)  # Add filters for slug

# Customize the display of the Ebook model in the admin
class EbookAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'type', 'duration')  # Fields to display in the list view
    list_filter = ('type',)  # Add filters for type
    search_fields = ('title', 'description')  # Enable search by title and description
    readonly_fields = ('duration',)  # Make duration read-only since it's calculated automatically

    # Optional: Customize the form fields displayed in the detail view
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'image', 'audio', 'type')
        }),
        ('Advanced Options', {
            'fields': ('duration',),
            'classes': ('collapse',),  # Collapse this section by default
        }),
    )

# Register the models with their respective admin classes
admin.site.register(Type, TypeAdmin)
admin.site.register(Ebook, EbookAdmin)