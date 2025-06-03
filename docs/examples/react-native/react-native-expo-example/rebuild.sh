# 1. Remove node modules and lockfile
rm -rf node_modules
rm -f package-lock.json yarn.lock

# 2. Clear Metro cache and watchman (for macOS/Linux)
npx react-native clean || true
watchman watch-del-all
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*

# 3. Install dependencies again
npm install # or yarn install
npx pod-install ios