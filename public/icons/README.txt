PLACEHOLDER FOR REAL APP ICONS
=================================

Two PNG files need to live in this folder before deploying to production:

  icon-192.png  (192×192 pixels)
  icon-512.png  (512×512 pixels)

These are the icons users will see when they install the Inner Circle to
their home screen as a PWA, and in browser tabs.

For now, you can ask Claude Code to generate placeholder icons from your
4Ever Photos logo, or design them in Figma/Canva using the brand palette:

  Background: #4A1F3D (plum) or #FAF4F0 (cream)
  Mark:       Your "4ever" script wordmark in white or cream

The icons should be "maskable" — meaning the important content stays
inside a centred 80% safe zone so they look good when Android crops them
into a circle.

A free tool for testing/generating maskable icons:
  https://maskable.app/editor

Once you have the two PNGs, drop them into this folder and delete this
README. Vercel will automatically serve them from /icons/icon-192.png
and /icons/icon-512.png.
