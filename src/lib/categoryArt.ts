/**
 * Per-category imagery (Unsplash licence, see public/images/CREDITS.md) plus SEO title and
 * a short "about" paragraph shown on the category page.
 */
type CategoryArt = { img: string; alt: string; hindi: string; tint: string; seoTitle: string; about: string };

export const CATEGORY_ART: Record<string, CategoryArt> = {
  mango: {
    img: '/images/mango-tree.webp',
    alt: 'Raw green mangoes on a mango tree',
    hindi: 'आम',
    tint: 'from-[#3f7d3a]/85',
    seoTitle: 'Aam ka Achaar Online: Homemade Mango Pickle',
    about:
      'Aam ka achaar Indian thaali ka sabse purana aur pasandida saathi hai. Kachche aam ke tukde, sarson ka tel, saunf, methi aur kalonji milkar wo khatta-teekha swaad banate hain jo paratha, dal-chawal aur khichdi ko khaas bana deta hai.',
  },
  lemon: {
    img: '/images/lemons.webp',
    alt: 'Fresh lemons cut in half',
    hindi: 'नींबू',
    tint: 'from-[#c98a0e]/85',
    seoTitle: 'Nimbu ka Achaar Online: Homemade Lemon Pickle',
    about:
      'Nimbu ka achaar apne tangy aur halke khatte-meethe swaad ke liye jaana jaata hai. Curd rice, poha, khichdi ya upma, har halke khaane ke saath nimbu ka achaar ek taazgi bhara twist deta hai.',
  },
  chilli: {
    img: '/images/chillies-red.webp',
    alt: 'A heap of fresh red chillies',
    hindi: 'मिर्च',
    tint: 'from-[#2e0d0a]/90',
    seoTitle: 'Mirchi ka Achaar Online: Hari Mirch aur Bharwa Lal Mirch',
    about:
      'Teekha khaane ke shaukeenon ke liye mirchi ka achaar. Hari mirch ka chatpata achaar ho ya masala bhari bharwa laal mirch, ek bite hi poore khaane mein jaan daal deti hai.',
  },
  garlic: {
    img: '/images/garlic.webp',
    alt: 'A basket of fresh garlic bulbs',
    hindi: 'लहसुन',
    tint: 'from-[#5a3b2e]/90',
    seoTitle: 'Lehsun ka Achaar Online: Homemade Garlic Pickle',
    about:
      'Lehsun ka achaar apni tez khushbu aur teekhe swaad ke liye pasand kiya jaata hai. Saboot lehsun ki kaliyan masalon aur tel mein milkar dal-chawal, bajra roti aur paratha ka swaad doguna kar deti hain.',
  },
  ginger: {
    img: '/images/ginger.webp',
    alt: 'Fresh ginger roots',
    hindi: 'अदरक',
    tint: 'from-[#6b4a1f]/90',
    seoTitle: 'Adrak ka Achaar Online: Homemade Ginger Pickle',
    about:
      'Adrak ka achaar zesty aur halka teekha hota hai. Patle kate adrak ke lachhe nimbu ke ras aur halke masalon ke saath, roz ke khaane mein ek alag hi taazgi le aate hain.',
  },
  'mixed-vegetable': {
    img: '/images/vegetables.webp',
    alt: 'Carrots, cauliflower and other fresh vegetables',
    hindi: 'सब्ज़ी',
    tint: 'from-[#b5562b]/85',
    seoTitle: 'Mixed Vegetable Achaar Online: Gajar, Gobhi, Mirch',
    about:
      'Mixed veg achaar mein gajar, gobhi, shalgam aur mirchi jaisi sabziyan ek saath milti hain. Ek hi jar mein kai swaad, roti-sabzi, pulao ya sandwich ke saath perfect.',
  },
  'sweet-achaar': {
    img: '/images/mangoes-bowl.webp',
    alt: 'A bowl of ripe mangoes',
    hindi: 'मीठा',
    tint: 'from-[#b5562b]/90',
    seoTitle: 'Meetha Achaar Online: Aam Chunda aur Khatta-Meetha Pickle',
    about:
      'Meetha achaar un logon ke liye jo khatta-meetha swaad pasand karte hain. Aam ka chunda thepla, paratha aur puri ke saath bachchon aur bado, dono ka favourite hai.',
  },
  'combo-packs': {
    img: '/images/thali.webp',
    alt: 'Indian thali with achaar on the side',
    hindi: 'कॉम्बो',
    tint: 'from-[#2e0d0a]/85',
    seoTitle: 'Achaar Combo Packs: Family aur Gifting ke liye',
    about:
      'Combo packs mein ek saath kai flavours milte hain. Ghar ke liye variety chahiye ya kisi apne ko tohfa dena ho, achaar combo ek swaadisht aur desi gift hai.',
  },
};

export const categoryArt = (slug: string): CategoryArt =>
  CATEGORY_ART[slug] || { ...CATEGORY_ART['combo-packs'], hindi: 'अचार', seoTitle: '', about: '' };
