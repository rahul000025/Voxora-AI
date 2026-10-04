import { VoiceItem } from './types';

export const CURATED_VOICES: VoiceItem[] = [
  {
    short_name: 'hi-IN-SwaraNeural',
    friendly_name: 'Swara (Hindi - India)',
    gender: 'Female',
    locale: 'hi-IN',
    language: 'Hindi',
    is_featured: true,
    preview_text: 'नमस्ते! मैं स्वरा हूँ, वोक्सोरा एआई की आवाज़।'
  },
  {
    short_name: 'hi-IN-MadhurNeural',
    friendly_name: 'Madhur (Hindi - India)',
    gender: 'Male',
    locale: 'hi-IN',
    language: 'Hindi',
    is_featured: true,
    preview_text: 'नमस्ते! मैं मधुर हूँ। वोक्सोरा एआई में आपका स्वागत है।'
  },
  {
    short_name: 'en-IN-NeerjaNeural',
    friendly_name: 'Neerja (English - India)',
    gender: 'Female',
    locale: 'en-IN',
    language: 'English (India)',
    is_featured: true,
    preview_text: 'Hello! I am Neerja, bringing natural Indian English narration to life.'
  },
  {
    short_name: 'en-IN-PrabhatNeural',
    friendly_name: 'Prabhat (English - India)',
    gender: 'Male',
    locale: 'en-IN',
    language: 'English (India)',
    is_featured: true,
    preview_text: 'Hi there! I am Prabhat, ready to narrate your projects with precision.'
  },
  {
    short_name: 'en-US-JennyNeural',
    friendly_name: 'Jenny (English - US)',
    gender: 'Female',
    locale: 'en-US',
    language: 'English (US)',
    is_featured: true,
    preview_text: 'Hello! I am Jenny, a clear, warm and friendly American voice.'
  },
  {
    short_name: 'en-US-GuyNeural',
    friendly_name: 'Guy (English - US)',
    gender: 'Male',
    locale: 'en-US',
    language: 'English (US)',
    is_featured: true,
    preview_text: 'Greetings! I am Guy, ideal for podcasts, audiobooks, and business.'
  },
  {
    short_name: 'en-US-AriaNeural',
    friendly_name: 'Aria (English - US)',
    gender: 'Female',
    locale: 'en-US',
    language: 'English (US)',
    is_featured: true,
    preview_text: 'Welcome to Voxora AI. Aria here, ready to bring your words to reality.'
  },
  {
    short_name: 'en-GB-SoniaNeural',
    friendly_name: 'Sonia (English - UK)',
    gender: 'Female',
    locale: 'en-GB',
    language: 'English (UK)',
    is_featured: true,
    preview_text: 'Good day! I am Sonia, delivering crisp British narration.'
  },
  {
    short_name: 'en-GB-RyanNeural',
    friendly_name: 'Ryan (English - UK)',
    gender: 'Male',
    locale: 'en-GB',
    language: 'English (UK)',
    is_featured: true,
    preview_text: 'Hello. I am Ryan, your British voice for documentaries and adverts.'
  },
  {
    short_name: 'es-ES-ElviraNeural',
    friendly_name: 'Elvira (Spanish - Spain)',
    gender: 'Female',
    locale: 'es-ES',
    language: 'Spanish',
    is_featured: true,
    preview_text: '¡Hola! Soy Elvira, tu voz en español para cualquier proyecto.'
  },
  {
    short_name: 'fr-FR-DeniseNeural',
    friendly_name: 'Denise (French - France)',
    gender: 'Female',
    locale: 'fr-FR',
    language: 'French',
    is_featured: true,
    preview_text: 'Bonjour ! Je suis Denise, ravie de vous accompagner sur Voxora AI.'
  },
  {
    short_name: 'de-DE-KatjaNeural',
    friendly_name: 'Katja (German - Germany)',
    gender: 'Female',
    locale: 'de-DE',
    language: 'German',
    is_featured: true,
    preview_text: 'Hallo! Ich bin Katja, deine deutsche Stimme für erstklassige Audioaufnahmen.'
  },
  {
    short_name: 'ja-JP-NanamiNeural',
    friendly_name: 'Nanami (Japanese - Japan)',
    gender: 'Female',
    locale: 'ja-JP',
    language: 'Japanese',
    is_featured: true,
    preview_text: 'こんにちは！七海です。Voxora AIをご利用いただきありがとうございます。'
  }
];

export interface SampleText {
  id: string;
  category: string;
  language: string;
  title: string;
  suggestedVoice: string;
  text: string;
}

export const SAMPLE_TEXTS: SampleText[] = [
  {
    id: 'hi-story',
    category: 'Narrative',
    language: 'Hindi',
    title: 'हिंदी कहानी वाचन',
    suggestedVoice: 'hi-IN-SwaraNeural',
    text: 'एक समय की बात है, पहाड़ों की वादियों में एक शांत गाँव बसा था। वहाँ की सुबह चिड़ियों की चहचहाहट और बहती नदी के मधुर स्वर से गूंजती थी। लोग मिलकर काम करते और जीवन के हर छोटे पल में खुशियाँ तलाशते।'
  },
  {
    id: 'hi-motivation',
    category: 'Motivation',
    language: 'Hindi',
    title: 'प्रेरणादायक संदेश',
    suggestedVoice: 'hi-IN-MadhurNeural',
    text: 'सफलता किसी मंजिल का नाम नहीं, बल्कि निरंतर प्रयास करने का एक सफर है। जब तक आप अपने सपनों पर विश्वास रखते हैं, दुनिया की कोई भी ताकत आपको आगे बढ़ने से नहीं रोक सकती। आज से शुरुआत कीजिए!'
  },
  {
    id: 'en-commercial',
    category: 'Commercial',
    language: 'English',
    title: 'Product Promo',
    suggestedVoice: 'en-US-JennyNeural',
    text: 'Welcome to the future of sound. Voxora AI turns your written words into expressive, cinema-grade speech in seconds. Whether you are building an audiobook, video game, or podcast, your audience will hear the difference.'
  },
  {
    id: 'en-tech-podcast',
    category: 'Podcast',
    language: 'English',
    title: 'Tech Documentary',
    suggestedVoice: 'en-US-GuyNeural',
    text: 'Artificial intelligence is fundamentally reshaping how creators build digital content. From real-time language translation to emotive voice generation, the boundaries between human imagination and synthetic media are disappearing.'
  },
  {
    id: 'en-in-narration',
    category: 'Storytelling',
    language: 'English (India)',
    title: 'Indian English Audio',
    suggestedVoice: 'en-IN-NeerjaNeural',
    text: 'Namaste and welcome. Today, we journey through India’s vibrant culinary traditions, exploring how aromatic spices and centuries of family recipes create unforgettable feasts across every corner of the country.'
  },
  {
    id: 'en-support',
    category: 'Customer Experience',
    language: 'English',
    title: 'Virtual Assistant',
    suggestedVoice: 'en-US-AriaNeural',
    text: 'Thank you for calling customer care. Your call is very important to us. To check your order status, please press one. To speak with our support specialist, please hold the line.'
  }
];
