from django.urls import path
from . import views

urlpatterns = [
    # Matches API.profile.adminstatus() -> /api/v1/profile/adminstatus/
    path('profile/adminstatus/', views.ProfileAdminStatus.as_view(), name='profile-admin-status'),

    # Matches potential API.profile.getProfile(id) etc. -> /api/v1/profile/<int:pk>/
    path('profile/<int:pk>/', views.ProfileDetail.as_view(), name='profile-detail'),

    # Matches potential API.profile.updateMoney(id, amount) -> /api/v1/profile/<int:pk>/update-money/
    path('profile/<int:pk>/update-money/', views.ProfileMoneyUpdateAPIView.as_view(), name='profile-update-money'),

    # You likely need a way to get the *current user's* profile without knowing the PK
    # Often handled by the /auth/me endpoint or a dedicated /profile/me/
    # path('profile/me/', CurrentUserProfileView.as_view(), name='profile-me'), # Example
]