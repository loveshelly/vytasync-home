VYTASYNC 2.0 — LANDING PAGE
============================

FOLDER STRUCTURE
----------------
index.html          ← Main HTML page
styles.css          ← All styles (linked from index.html)
script.js           ← All JavaScript (linked from index.html)
images/             ← All 15 product images
video_8_.mp4        ← ADD YOUR VIDEO HERE (hero background)

VIDEO
-----
Place your video file named exactly "video_8_.mp4" 
in this same root folder alongside index.html.
The hero will fall back to a photo if video is not found.

IMPORTING INTO WEBFLOW
----------------------
1. Open Webflow → New Project → Blank Site
2. Go to Pages → Home → Page Settings
3. Under "Custom Code" → paste contents of styles.css into <head>
4. Add an "Embed" element to the canvas
5. Paste the contents of index.html body into the embed
6. Upload all images/ files via Webflow Assets panel
7. Update image src paths to match Webflow CDN URLs

IMPORTING INTO FRAMER
----------------------
1. Open Framer → New Project
2. Insert → "Code" → New Code File → name it "VytasyncPage"
3. Wrap index.html content in a React component (see below)
4. Upload images via Framer Assets panel

SELF-HOSTING (Simplest — recommended)
--------------------------------------
1. Keep all files in this folder together
2. Upload entire folder to your server or Netlify/Vercel
3. Access at: yourdomain.com/ or yourdomain.com/pillow/

