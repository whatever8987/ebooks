from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from mutagen.mp3 import MP3
import os
import logging
from .models import Ebook, Type
from .serializers import EbookSerializer, TypeSerializer

logger = logging.getLogger(__name__)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class PaginatedListCreateAPIView(generics.ListCreateAPIView):
    pagination_class = StandardResultsSetPagination


class EbookListCreateView(PaginatedListCreateAPIView):
    queryset = Ebook.objects.all()
    serializer_class = EbookSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['type']
    search_fields = ['title', 'description']

    def perform_create(self, serializer):
        """Handle creation logic, including saving files."""
        ebook = serializer.save()
        self.calculate_audio_duration(ebook)

    def calculate_audio_duration(self, ebook):
        """Calculate and save the duration of the audio file."""
        if ebook.audio:
            try:
                if hasattr(ebook.audio, 'path') and os.path.isfile(ebook.audio.path):
                    audio_path = ebook.audio.path
                    audio = MP3(audio_path)
                    ebook.duration = audio.info.length
                    ebook.save()
                else:
                    logger.error("Audio file path is invalid.")
            except Exception as e:
                logger.error(f"Error calculating duration: {e}")


class EbookRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ebook.objects.all()
    serializer_class = EbookSerializer

    def perform_update(self, serializer):
        """Handle update logic, including recalculating duration."""
        ebook = serializer.save()
        self.calculate_audio_duration(ebook)

    def calculate_audio_duration(self, ebook):
        """Calculate and save the duration of the audio file."""
        if ebook.audio:
            try:
                if hasattr(ebook.audio, 'path') and os.path.isfile(ebook.audio.path):
                    audio_path = ebook.audio.path
                    audio = MP3(audio_path)
                    ebook.duration = audio.info.length
                    ebook.save()
                else:
                    logger.error("Audio file path is invalid.")
            except Exception as e:
                logger.error(f"Error calculating duration: {e}")


class TypeListCreateView(PaginatedListCreateAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer