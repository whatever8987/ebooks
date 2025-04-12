from django.urls import path
from .views import (
    TypeListCreateView,
    EbookListCreateView,
    EbookRetrieveUpdateDestroyView,
)

urlpatterns = [
    # Type Endpoints
    path('types/', TypeListCreateView.as_view(), name='type-list-create'),

    # Ebook Endpoints
    path('ebooks/', EbookListCreateView.as_view(), name='ebook-list-create'),
    path('ebooks/<int:pk>/', EbookRetrieveUpdateDestroyView.as_view(), name='ebook-retrieve-update-destroy'),
]