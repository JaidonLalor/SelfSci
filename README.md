# Tracker

An experiment to know thyself

## TODO

- [ ] Hide supabase API key env

## Roadmap

1. Actually use it, and see what needs to be added accordingly
2. Diet
3. Garmin
4. Tasks
5. Reflection summaries

## How to dev server

npx expo start

Notes:
• Make sure you're running Expo Go not Development Build (if you get link error, press "s" in terminal)
• Delete the ios directory if you get the 500 error

## How to build for iphone

1. Setup phone for provisioning: eas device:create
2. Build in cloud: eas build --platform ios --profile preview
3. Download on phone via QR code or link

Note: env vars must be implemented in the profile's eas.json, and app.json must have scheme defined

## How to view crash logs

1. Plug phone into computer
2. Open xcode
3. Go to Window > Devices & Simulators (CMD + Shift 2)
4. Select device
5. Click "Open Console" or "Open Recent Logs" (small buttons in the top bar, left of the device image)