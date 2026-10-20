/* ==========================================================================
   world-map-data.js — the journey data.

   Every place here is traceable. The `source` field records exactly where the
   place came from (an Instagram location tag, a Substack sentence, or Clarissa
   directly). If a story is empty, the place is shown with a "story to come"
   state rather than being invented. Nothing here is made up.

   Coordinate system: equirectangular, matching the SVG projection used in
   world-map.html — x = (lon + 180) * 2.5, y = (90 - lat) * 2.5, on a
   900 x 450 viewBox.
   ========================================================================== */
window.JOURNEY = [
  {
    id: "chaozhou",
    name: "Chaozhou",
    cn: "潮州",
    lat: 23.6567, lng: 116.6323,
    year: "—",
    era: "Before",
    role: "origin",
    title: "Where it starts",
    story: "My ancestor came from here. A place I carry without ever having lived in it — the root of a line that runs through me.",
    note: "The line begins somewhere else. I have never seen it, and it has shaped everything.",
    photo: null,
    photoAlt: "",
    source: "Told by Clarissa"
  },
  {
    id: "shenzhen",
    name: "Shenzhen",
    cn: "深圳",
    lat: 22.5431, lng: 114.0579,
    year: "—",
    era: "Before",
    role: "origin",
    title: "In complete alignment",
    story: "A city that runs at a different speed. The caption was three words; the feeling was a whole temperature.",
    note: "",
    photo: null,
    photoAlt: "",
    source: "Instagram, 12 June 2026"
  },
  {
    id: "seoul",
    name: "Seoul",
    cn: "서울",
    lat: 37.5665, lng: 126.9780,
    year: "2020",
    era: "Before",
    role: "journey",
    title: "Back to January",
    story: "A hotel in Seoul, in the strange early days of 2020. The caption was someone trying to rewind a year that would not move.",
    note: "",
    photo: null,
    photoAlt: "",
    source: "Instagram, 10 April 2020"
  },
  {
    id: "singapore",
    name: "Singapore",
    cn: "新加坡",
    lat: 1.3521, lng: 103.8198,
    year: "2018 – 2026",
    era: "Eight years",
    role: "home",
    title: "Eight years, held lightly",
    story: "Eight years. It could be a wound, so I decided to make it material instead. This is where I learned that friction forces you to stay — and that staying is the whole thing.",
    note: "「新加坡8年是材料不是伤口」",
    photo: null,
    photoAlt: "",
    source: "Instagram, 2020 – 2021 · Substack, 31 December 2025"
  },
  {
    id: "maldives",
    name: "Maldives",
    cn: "马尔代夫",
    lat: 3.2028, lng: 73.2207,
    year: "2025",
    era: "Before",
    role: "journey",
    title: "The switch that costs nothing",
    story: "The example I keep returning to: today it costs nothing to move on, so we never stay long enough to go deep. A beach on a Tuesday. A life you don't belong to.",
    note: "",
    photo: null,
    photoAlt: "",
    source: "Substack, 31 December 2025"
  },
  {
    id: "normandie",
    name: "Normandie",
    cn: "诺曼底",
    lat: 49.3417, lng: -0.5317,
    year: "2025",
    era: "Before",
    role: "journey",
    title: "The art of being offline",
    story: "A 16th-century château in Normandie: unobserved, unbothered, profoundly alive. The clearest statement I have ever made about what I am actually looking for.",
    note: "",
    photo: null,
    photoAlt: "",
    source: "Instagram, 8 November 2025"
  },
  {
    id: "paris",
    name: "Paris",
    cn: "巴黎",
    lat: 48.8566, lng: 2.3522,
    year: "2025",
    era: "Before",
    role: "journey",
    title: "In our metamorphosis era",
    story: "Francis Lai on the soundtrack. A year of becoming, scored in French.",
    note: "",
    photo: null,
    photoAlt: "",
    source: "Instagram, 9 September 2024"
  },
  {
    id: "milan",
    name: "Milan",
    cn: "米兰",
    lat: 45.4642, lng: 9.1900,
    year: "2026",
    era: "Now",
    role: "journey",
    title: "What did making give us?",
    story: "The Duomo — six centuries and still in the making. Then there was Leonardo, who did not just paint but studied, designed, engineered, experimented. The years of making The Last Supper also made Leonardo. The process produces us too.",
    note: "「We don't just produce the thing. The process produces us, too.」",
    photo: null,
    photoAlt: "",
    source: "Substack, 15 August 2026"
  },
  {
    id: "rome",
    name: "Rome",
    cn: "罗马",
    lat: 41.9028, lng: 12.4964,
    year: "2026",
    era: "Now",
    role: "journey",
    title: "",
    story: "",
    note: "",
    photo: null,
    photoAlt: "",
    source: "Instagram"
  },
  {
    id: "venice",
    name: "Venice",
    cn: "威尼斯",
    lat: 45.4408, lng: 12.3155,
    year: "2026",
    era: "Now",
    role: "journey",
    title: "",
    story: "",
    note: "",
    photo: null,
    photoAlt: "",
    source: "Instagram"
  },
  {
    id: "como",
    name: "Como",
    cn: "科莫",
    lat: 45.9862, lng: 9.2572,
    year: "2026",
    era: "Now",
    role: "journey",
    title: "",
    story: "",
    note: "",
    photo: null,
    photoAlt: "",
    source: "Instagram"
  },
  {
    id: "kuala_lumpur",
    name: "Kuala Lumpur",
    cn: "吉隆坡",
    lat: 3.1390, lng: 101.6869,
    year: "Now",
    era: "Now",
    role: "home",
    title: "Now",
    story: "Where I live now. The city I build systems from.",
    note: "",
    photo: null,
    photoAlt: "",
    source: "Told by Clarissa"
  }
];
