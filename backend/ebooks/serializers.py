from rest_framework import serializers
from .models import Ebook, Type

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ['id', 'slug', 'title']

class EbookSerializer(serializers.ModelSerializer):
    type = serializers.PrimaryKeyRelatedField(queryset=Type.objects.all(), required=False, allow_null=True)
    image = serializers.ImageField(required=False, use_url=True)
    audio = serializers.FileField(required=False, use_url=True)

    class Meta:
        model = Ebook
        fields = [
            'id', 'title', 'description', 'image', 'audio', 'duration', 'type'
        ]
        read_only_fields = ['duration']  # Duration is calculated automatically

    def validate_audio(self, value):
        """Validate the uploaded audio file."""
        ext = os.path.splitext(value.name)[1].lower()
        valid_extensions = ['.mp3', '.wav']
        if ext not in valid_extensions:
            raise serializers.ValidationError(f"Unsupported file type. Only {', '.join(valid_extensions)} are allowed.")
        return value