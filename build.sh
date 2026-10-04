#!/bin/sh
set -e
mkdir -p public

# --- base site: this is a snapshot of the currently-live production page (fetched 2026-09-25),
# already includes the 44 base games + the Education v1 extras. This build re-patches it to add
# games-ext.js (arcade bundle + Education v2) and the refreshed cartridge-art scripts. ---
cp index.html public/index.html
cp privacy.html public/privacy.html
cp robots.txt public/robots.txt
cp sitemap.xml public/sitemap.xml
SUM=$(md5sum public/index.html | awk '{print $1}')
echo "index.html - checksum $SUM ($(wc -c < public/index.html) bytes)"

# the live page we started from is itself a previous build's output (already has games-ext.js,
# the CSA_EXT hook and the cartridge-art tags) - strip those before re-patching, or they'd double up
node clean.js

if ! tail -c 64 public/index.html | tr -d '\n\r ' | grep -q '</script>$'; then
  echo "PATCH ABORTED: index.html does not end with </script>"
  tail -c 120 public/index.html
  exit 1
fi

# --- arcade cabinets bundle (g01-g12), checksum + syntax gated ---
# NOTE: the Pellet Prowler cat/patrol-bot art reskin (previously a separate fix.js
# build-time string patch) is now baked directly into g01.js's source, so that
# step has been removed - one less fragile dependency between this bundle and a
# separate patch script every time Pellet Prowler's code changes.
cat g01.js g02.js g03.js g04.js g05.js g06.js g07.js g08.js g09.js g10.js g11.js g12.js > public/games-ext.js
EXT_SUM=$(md5sum public/games-ext.js | awk '{print $1}')
if [ "$EXT_SUM" != "2cc2e90b29f752212183e5214bf21115" ]; then
  echo "GAMES BUNDLE MISMATCH: got $EXT_SUM"
  exit 1
fi
node --check public/games-ext.js
echo "Bundle OK: $EXT_SUM"

# --- Education category v2: single verified bundle (checksum hard gate - this file was copied
# byte-for-byte via the git repo, never manually retyped, so an exact match is expected) ---
EDU_SUM=$(md5sum edu.js | awk '{print $1}')
if [ "$EDU_SUM" != "e1f4c457d773d3bd4373816e11f553ff" ]; then
  echo "EDUCATION BUNDLE CHECKSUM MISMATCH: got $EDU_SUM expected e1f4c457d773d3bd4373816e11f553ff"
  exit 1
fi
node --check edu.js
echo "Education bundle OK: $EDU_SUM"
printf '\n' >> public/games-ext.js
cat edu.js >> public/games-ext.js
node --check public/games-ext.js

node patch.js

# --- how-to-play data: one blurb + full instructions per game, checksum hard gate
# (generated once and verified, so an exact match is expected) ---
HOWTO_SUM=$(md5sum howto.js | awk '{print $1}')
if [ "$HOWTO_SUM" != "9a0ffa2a8d137461f62e696abe10e475" ]; then
  echo "HOWTO DATA CHECKSUM MISMATCH: got $HOWTO_SUM expected 9a0ffa2a8d137461f62e696abe10e475"
  exit 1
fi
node --check howto.js
cp howto.js public/howto.js
echo "How-to-play data OK: $HOWTO_SUM"

# --- how-to-play UI: adds the shared blurb + expandable panel to the console screen ---
node howto-patch.js

# --- cartridge art: appended after the base page ---
cp pictures-data.js public/pictures-data.js
cp pictures-edu.js public/pictures-edu.js
cp pictures.js public/pictures.js
cp polish.js public/polish.js
node --check public/polish.js

# --- Pong 3D: vendored physics (Matter.js) + rendering (Three.js) libs.
# Loaded lazily (dynamic <script> injection) only when a player opens Pong,
# so the ~670KB combined payload never touches anyone who does not play it.
# Checksum hard-gated: these are vendored builds, copied byte-for-byte, never
# hand-edited, so an exact match is expected. ---
MATTER_SUM=$(md5sum matter.min.js | awk '{print $1}')
if [ "$MATTER_SUM" != "16937dabe97701f234c665b43175d93b" ]; then
  echo "MATTER.JS CHECKSUM MISMATCH: got $MATTER_SUM"
  exit 1
fi
THREE_SUM=$(md5sum three.min.js | awk '{print $1}')
if [ "$THREE_SUM" != "eb8549863a97355411c3259a3f93b8e1" ]; then
  echo "THREE.JS CHECKSUM MISMATCH: got $THREE_SUM"
  exit 1
fi
cp matter.min.js public/matter.min.js
cp three.min.js public/three.min.js
echo "Pong 3D libs OK: matter.js $MATTER_SUM, three.js $THREE_SUM"

sed -i 's/var BY_TITLE = {}, id;/var BY_TITLE = {}, id; if (window.CSA_EDU_GAMES) for (id in window.CSA_EDU_GAMES) GAMES[id] = window.CSA_EDU_GAMES[id];/' public/pictures.js
if [ "$(grep -c CSA_EDU_GAMES public/pictures.js)" != "1" ]; then
  echo "PICTURES PATCH ABORTED"
  exit 1
fi
node --check public/pictures.js

printf '%s' '<script src="/howto.js" defer></script><script src="/pictures-data.js" defer></script><script src="/pictures-edu.js" defer></script><script src="/pictures.js" defer></script><script src="/polish.js" defer></script>' >> public/index.html
grep -q 'howto.js' public/index.html
grep -q 'pictures-data.js' public/index.html
grep -q 'pictures-edu.js' public/index.html
grep -q 'polish.js' public/index.html
grep -q 'games-ext.js' public/index.html
echo "Extras injected: games-ext.js (arcade + Education v2) + howto.js + pictures-data.js + pictures-edu.js + pictures.js + polish.js"
echo "Build complete."
