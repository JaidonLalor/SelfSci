# Tracker

An experiment to know thyself

## TODO

- [ ] Fix dev server
- [ ] Hide supabase API key env
- [ ] Fix dev server

## How to dev server

UNKNOWN

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

## 