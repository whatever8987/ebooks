from django.db import models
from PIL import Image
from mutagen.mp3 import MP3
from django.core.exceptions import ValidationError
import os
from django.utils.translation import gettext_lazy as _


# Audio file validator
def validate_audio_file(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.mp3', '.wav']
    if not ext.lower() in valid_extensions:
        raise ValidationError(f"Unsupported file type. Only {', '.join(valid_extensions)} are allowed.")


class Ebook(models.Model):
    title = models.CharField(max_length=255, null=False, blank=False)
    description = models.TextField(default='')
    image = models.ImageField(default='default.png', upload_to='ebook_pics')
    audio = models.FileField(upload_to='ebook_audio/', blank=True, null=True, validators=[validate_audio_file])
    duration = models.DurationField(null=True, blank=True, help_text="Duration of the audio in HH:MM:SS")
    type = models.ForeignKey('Type', on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.title

    def clean(self):
        if self.audio and not self.duration:
            raise ValidationError("Duration must be calculated when an audio file is provided.")

    def save(self, *args, **kwargs):
        # Save the instance first so that the file is available on disk
        super().save(*args, **kwargs)

        # Process the image
        try:
            if self.image and hasattr(self.image, 'path'):
                img = Image.open(self.image.path)
                if img.height > 300 or img.width > 300:
                    output_size = (300, 300)
                    img.thumbnail(output_size)
                    img.save(self.image.path)
        except FileNotFoundError:
            print("Image file not found. Skipping resize.")
        except Exception as e:
            print(f"Error processing image: {e}")

        # Calculate audio duration
        if self.audio:
            try:
                if hasattr(self.audio, 'path'):
                    audio_path = self.audio.path
                    audio = MP3(audio_path)
                    self.duration = audio.info.length  # Duration in seconds
            except FileNotFoundError:
                print("Audio file not found. Skipping duration calculation.")
            except Exception as e:
                print(f"Error calculating duration: {e}")

        # Save again after processing
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete the associated image file
        if self.image and hasattr(self.image, 'path'):
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)

        # Delete the associated audio file
        if self.audio and hasattr(self.audio, 'path'):
            if os.path.isfile(self.audio.path):
                os.remove(self.audio.path)

        # Call the superclass delete method
        super().delete(*args, **kwargs)


class Type(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(_('Title'), max_length=100)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']
        verbose_name = _('type')
        verbose_name_plural = _('types')