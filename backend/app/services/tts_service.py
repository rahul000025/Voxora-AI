import logging
import asyncio
from typing import List, Dict, Optional, Tuple, Union
import edge_tts
from ..models import VoiceItem, TTSRequest

logger = logging.getLogger(__name__)

# Fallback curated voices in case edge_tts.list_voices() fails or takes time
CURATED_FEATURED_VOICES = [
    {
        "ShortName": "hi-IN-SwaraNeural",
        "FriendlyName": "Swara (Hindi - India)",
        "Gender": "Female",
        "Locale": "hi-IN",
        "Language": "Hindi",
        "preview_text": "नमस्ते! मैं स्वरा हूँ, वोक्सोरा एआई की आवाज़।"
    },
    {
        "ShortName": "hi-IN-MadhurNeural",
        "FriendlyName": "Madhur (Hindi - India)",
        "Gender": "Male",
        "Locale": "hi-IN",
        "Language": "Hindi",
        "preview_text": "नमस्ते! मैं मधुर हूँ। वोक्सोरा एआई में आपका स्वागत है।"
    },
    {
        "ShortName": "en-IN-NeerjaNeural",
        "FriendlyName": "Neerja (English - India)",
        "Gender": "Female",
        "Locale": "en-IN",
        "Language": "English (India)",
        "preview_text": "Hello! I am Neerja, bringing natural Indian English narration to life."
    },
    {
        "ShortName": "en-IN-PrabhatNeural",
        "FriendlyName": "Prabhat (English - India)",
        "Gender": "Male",
        "Locale": "en-IN",
        "Language": "English (India)",
        "preview_text": "Hi there! I am Prabhat, ready to narrate your projects with precision."
    },
    {
        "ShortName": "en-US-JennyNeural",
        "FriendlyName": "Jenny (English - US)",
        "Gender": "Female",
        "Locale": "en-US",
        "Language": "English (US)",
        "preview_text": "Hello! I am Jenny, a clear, warm and friendly American voice."
    },
    {
        "ShortName": "en-US-GuyNeural",
        "FriendlyName": "Guy (English - US)",
        "Gender": "Male",
        "Locale": "en-US",
        "Language": "English (US)",
        "preview_text": "Greetings! I am Guy, ideal for podcasts, audiobooks, and business."
    },
    {
        "ShortName": "en-US-AriaNeural",
        "FriendlyName": "Aria (English - US)",
        "Gender": "Female",
        "Locale": "en-US",
        "Language": "English (US)",
        "preview_text": "Welcome to Voxora AI. Aria here, ready to bring your words to reality."
    },
    {
        "ShortName": "en-US-ChristopherNeural",
        "FriendlyName": "Christopher (English - US)",
        "Gender": "Male",
        "Locale": "en-US",
        "Language": "English (US)",
        "preview_text": "Hey there! Christopher here, ready to bring depth to your script."
    },
    {
        "ShortName": "en-GB-SoniaNeural",
        "FriendlyName": "Sonia (English - UK)",
        "Gender": "Female",
        "Locale": "en-GB",
        "Language": "English (UK)",
        "preview_text": "Good day! I am Sonia, delivering crisp British narration."
    },
    {
        "ShortName": "en-GB-RyanNeural",
        "FriendlyName": "Ryan (English - UK)",
        "Gender": "Male",
        "Locale": "en-GB",
        "Language": "English (UK)",
        "preview_text": "Hello. I am Ryan, your British voice for documentaries and adverts."
    },
    {
        "ShortName": "es-ES-ElviraNeural",
        "FriendlyName": "Elvira (Spanish - Spain)",
        "Gender": "Female",
        "Locale": "es-ES",
        "Language": "Spanish",
        "preview_text": "¡Hola! Soy Elvira, tu voz en español para cualquier proyecto."
    },
    {
        "ShortName": "fr-FR-DeniseNeural",
        "FriendlyName": "Denise (French - France)",
        "Gender": "Female",
        "Locale": "fr-FR",
        "Language": "French",
        "preview_text": "Bonjour ! Je suis Denise, ravie de vous accompagner sur Voxora AI."
    },
    {
        "ShortName": "de-DE-KatjaNeural",
        "FriendlyName": "Katja (German - Germany)",
        "Gender": "Female",
        "Locale": "de-DE",
        "Language": "German",
        "preview_text": "Hallo! Ich bin Katja, deine deutsche Stimme für erstklassige Audioaufnahmen."
    },
    {
        "ShortName": "ja-JP-NanamiNeural",
        "FriendlyName": "Nanami (Japanese - Japan)",
        "Gender": "Female",
        "Locale": "ja-JP",
        "Language": "Japanese",
        "preview_text": "こんにちは！七海です。Voxora AIをご利用いただきありがとうございます。"
    }
]

FEATURED_SHORT_NAMES = {v["ShortName"] for v in CURATED_FEATURED_VOICES}

class TTSService:
    def __init__(self):
        self._cached_voices: List[VoiceItem] = []
        self._voice_map: Dict[str, VoiceItem] = {}
        self._languages: List[str] = []
        self._initialized = False

    async def initialize(self):
        """Fetch and cache available voices from edge_tts."""
        try:
            raw_voices = await edge_tts.list_voices()
            parsed_voices: List[VoiceItem] = []

            for voice in raw_voices:
                short_name = voice.get("ShortName", "")
                locale = voice.get("Locale", "")
                gender = voice.get("Gender", "Unknown")
                
                # Derive human-friendly language name
                lang_parts = locale.split("-")
                lang_code = lang_parts[0].lower() if lang_parts else ""
                
                # Human readable language names for common locales
                language_display = self._format_language(locale)
                
                # Clean up friendly name
                raw_friendly = voice.get("FriendlyName", "")
                name_clean = short_name.split("-")[-1].replace("Neural", "")
                friendly_display = f"{name_clean} ({language_display})"

                is_featured = short_name in FEATURED_SHORT_NAMES
                
                # Sample preview text per language
                preview_text = self._get_preview_text(short_name, locale)

                item = VoiceItem(
                    short_name=short_name,
                    friendly_name=friendly_display,
                    gender=gender,
                    locale=locale,
                    language=language_display,
                    sample_rate=voice.get("SuggestedCodec", "audio-24khz-48kbitrate-mono-mp3"),
                    is_featured=is_featured,
                    preview_text=preview_text
                )
                parsed_voices.append(item)

            # Sort: featured first, then by language, then friendly name
            parsed_voices.sort(key=lambda v: (not v.is_featured, v.language, v.friendly_name))

            self._cached_voices = parsed_voices
            self._voice_map = {v.short_name: v for v in parsed_voices}
            self._languages = sorted(list({v.language for v in parsed_voices}))
            self._initialized = True
            logger.info(f"Loaded {len(self._cached_voices)} edge-tts voices successfully.")

        except Exception as e:
            logger.warning(f"Could not load voices dynamically from edge_tts: {e}. Using curated voices fallback.")
            self._load_fallback_voices()

    def _load_fallback_voices(self):
        parsed = []
        for v in CURATED_FEATURED_VOICES:
            item = VoiceItem(
                short_name=v["ShortName"],
                friendly_name=v["FriendlyName"],
                gender=v["Gender"],
                locale=v["Locale"],
                language=v["Language"],
                sample_rate="audio-24khz-48kbitrate-mono-mp3",
                is_featured=True,
                preview_text=v["preview_text"]
            )
            parsed.append(item)
        self._cached_voices = parsed
        self._voice_map = {v.short_name: v for v in parsed}
        self._languages = sorted(list({v.language for v in parsed}))
        self._initialized = True

    def _format_language(self, locale: str) -> str:
        mapping = {
            "hi-IN": "Hindi",
            "en-IN": "English (India)",
            "en-US": "English (US)",
            "en-GB": "English (UK)",
            "en-AU": "English (Australia)",
            "en-CA": "English (Canada)",
            "bn-IN": "Bengali (India)",
            "te-IN": "Telugu",
            "ta-IN": "Tamil",
            "mr-IN": "Marathi",
            "gu-IN": "Gujarati",
            "kn-IN": "Kannada",
            "ml-IN": "Malayalam",
            "ur-PK": "Urdu",
            "pa-IN": "Punjabi",
            "es-ES": "Spanish (Spain)",
            "es-MX": "Spanish (Mexico)",
            "fr-FR": "French (France)",
            "de-DE": "German",
            "ja-JP": "Japanese",
            "zh-CN": "Chinese (Mandarin)",
            "ko-KR": "Korean",
            "it-IT": "Italian",
            "pt-BR": "Portuguese (Brazil)",
            "ru-RU": "Russian",
            "ar-SA": "Arabic",
            "tr-TR": "Turkish"
        }
        return mapping.get(locale, locale)

    def _get_preview_text(self, short_name: str, locale: str) -> str:
        for f in CURATED_FEATURED_VOICES:
            if f["ShortName"] == short_name:
                return f["preview_text"]
        
        if locale.startswith("hi"):
            return "नमस्ते! मैं वोक्सोरा एआई की आवाज़ हूँ।"
        elif locale.startswith("en"):
            return "Hello! This is a natural voice sample from Voxora AI."
        elif locale.startswith("es"):
            return "¡Hola! Esta es una muestra de voz natural de Voxora AI."
        elif locale.startswith("fr"):
            return "Bonjour ! Ceci est un extrait vocal naturel de Voxora AI."
        elif locale.startswith("de"):
            return "Hallo! Dies ist ein Sprachbeispiel von Voxora AI."
        elif locale.startswith("ja"):
            return "こんにちは！これはVoxora AIの音声サンプルです。"
        return "Hello! This is a voice sample powered by Voxora AI."

    def get_voices(
        self,
        language: Optional[str] = None,
        gender: Optional[str] = None,
        search: Optional[str] = None,
        featured_only: bool = False
    ) -> List[VoiceItem]:
        if not self._initialized:
            self._load_fallback_voices()

        result = self._cached_voices

        if featured_only:
            result = [v for v in result if v.is_featured]

        if language:
            lang_clean = language.strip().lower()
            result = [v for v in result if lang_clean in v.language.lower() or lang_clean in v.locale.lower()]

        if gender:
            gender_clean = gender.strip().lower()
            result = [v for v in result if v.gender.lower() == gender_clean]

        if search:
            search_clean = search.strip().lower()
            result = [
                v for v in result
                if search_clean in v.friendly_name.lower()
                or search_clean in v.short_name.lower()
                or search_clean in v.language.lower()
                or search_clean in v.locale.lower()
            ]

        return result

    def get_languages(self) -> List[str]:
        if not self._initialized:
            self._load_fallback_voices()
        return self._languages

    def get_featured_voices(self) -> List[VoiceItem]:
        if not self._initialized:
            self._load_fallback_voices()
        return [v for v in self._cached_voices if v.is_featured]

    def format_rate(self, rate: Union[int, float, str]) -> str:
        try:
            if isinstance(rate, (int, float)):
                val = int(rate)
                return f"{val:+d}%"
            s = str(rate).strip()
            if s.endswith("%"):
                val = int(s.replace("%", "").strip())
                return f"{val:+d}%"
            val = int(s)
            return f"{val:+d}%"
        except Exception:
            return "+0%"

    def format_pitch(self, pitch: Union[int, float, str]) -> str:
        try:
            if isinstance(pitch, (int, float)):
                val = int(pitch)
                return f"{val:+d}Hz"
            s = str(pitch).strip()
            if s.endswith("Hz") or s.endswith("hz"):
                val = int(s.replace("Hz", "").replace("hz", "").strip())
                return f"{val:+d}Hz"
            val = int(s)
            return f"{val:+d}Hz"
        except Exception:
            return "+0Hz"

    def format_volume(self, volume: Union[int, float, str]) -> str:
        try:
            if isinstance(volume, (int, float)):
                val = int(volume)
                return f"{val:+d}%"
            s = str(volume).strip()
            if s.endswith("%"):
                val = int(s.replace("%", "").strip())
                return f"{val:+d}%"
            val = int(s)
            return f"{val:+d}%"
        except Exception:
            return "+0%"

    async def generate_speech(self, request: TTSRequest) -> bytes:
        """Synthesize text to speech using edge-tts and return MP3 audio bytes."""
        text = request.text.strip()
        if not text:
            raise ValueError("Input text cannot be empty.")

        # Validate voice
        voice = request.voice.strip()
        if not voice:
            voice = "en-US-JennyNeural"

        # Check if voice is in voice map; if not, check case-insensitive match
        matched_voice = voice
        if self._voice_map:
            if voice not in self._voice_map:
                lower_lookup = {k.lower(): k for k in self._voice_map.keys()}
                if voice.lower() in lower_lookup:
                    matched_voice = lower_lookup[voice.lower()]
                else:
                    logger.warning(f"Voice '{voice}' not found in active voice list; attempting anyway.")

        rate_str = self.format_rate(request.rate)
        pitch_str = self.format_pitch(request.pitch)
        volume_str = self.format_volume(request.volume)

        logger.info(f"Synthesizing {len(text)} chars with voice={matched_voice}, rate={rate_str}, pitch={pitch_str}")

        communicate = edge_tts.Communicate(
            text=text,
            voice=matched_voice,
            rate=rate_str,
            pitch=pitch_str,
            volume=volume_str
        )

        audio_chunks = []
        try:
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_chunks.append(chunk["data"])
        except Exception as e:
            logger.error(f"Error during edge-tts synthesis: {e}")
            raise RuntimeError(f"Speech synthesis failed: {str(e)}")

        audio_bytes = b"".join(audio_chunks)
        if not audio_bytes:
            raise RuntimeError("Speech synthesis produced 0 bytes of audio data.")

        return audio_bytes

    async def generate_preview(self, voice_name: str, custom_text: Optional[str] = None) -> bytes:
        """Generate a short preview clip for a specific voice."""
        voice_item = self._voice_map.get(voice_name)
        if custom_text and custom_text.strip():
            sample_text = custom_text.strip()
        elif voice_item:
            sample_text = voice_item.preview_text
        else:
            sample_text = "Hello! This is a preview of the Voxora AI neural voice."

        req = TTSRequest(
            text=sample_text,
            voice=voice_name,
            rate=0,
            pitch=0,
            volume=0
        )
        return await self.generate_speech(req)

tts_service = TTSService()
