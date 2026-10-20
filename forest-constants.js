/* ==========================================================================
   Forest constants — ONE source of truth for the forest's geometry + palette.
   Shared by:
     - where-intelligence-lives.html  (the full interactive experiment)
     - forest-backdrop.js             (the live, wordless backdrop on index.html)
   If you change a number here, both change together. Never duplicate these
   values in a second file.
   ========================================================================== */
window.FOREST = {
  /* The brand mark, in 3D. Mark units, trunk base at y=0.
     The cones WIDEN downward — that inversion is the mark's signature. */
  MARK: {
    trunk: { y0: 0, y1: 24, rTop: 6, rBot: 2 },
    cones: [
      { y0: 24, y1: 54, r: 34 },   // base — widest
      { y0: 50, y1: 78, r: 24 },   // middle
      { y0: 76, y1: 102, r: 17 }   // top — narrowest
    ],
    sparkY: 108,
    crownY: 102
  },

  PAL: {
    bg:        0x0c1a17,
    ground:    0x10221c,
    trunk:     0x3b2b20,
    deadTrunk: 0x4a4744,
    gold:      0xe8b860,
    cyan:      0x7fe3d0,
    hq:        0xb8c2ff,
    ember:     0xd8502c,
    firefly:   0xd9f27a,
    star:      0xdfe8ff,
    // foliage base hue/saturation and the lightness jitter range
    leafH: 0.36, leafHVar: 0.07, leafS: 0.42, leafL: 0.2, leafLVar: 0.07
  },

  /* Scene constants shared by both renderers */
  SCENE: {
    radius: 14,          // forest radius
    treeCount: 46,
    minGap: 1.85,        // minimum distance between two trees
    centerClear: 1.8,    // keep the centre clear for the HQ
    edgeReach: 4.6,      // how far a tree looks for neighbours
    edgeDegree: 3,       // how many neighbours each tree links to
    fireflies: 70
  }
};
