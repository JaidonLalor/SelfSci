# SelfSci

An experiment to know thyself

## Mini todos

- [ ] Make diet browser work
---
- [ ] Garmin token refresh (if needed)
- [ ] Garmin update perms
- [ ] /garmin page redirects to settings, but going back takes you back to /garmin
    - [ ] Create custom link and route in header component
- [ ] Garmin disconnect "are you sure?" popup
- [ ] Receipt name entry desktop is messed up!
- [ ] Receipt name entry sentence case default
- [ ] Workout name entry sentence case default

## Roadmap

1. Actually use it, and see what needs to be added accordingly
2. Garmin
3. Tasks
4. Daily summaries (daily, monthly)

## How to dev server

npx expo start

Notes:
• Make sure you're running Expo Go not Development Build (if you get link error, press "s" in terminal)
• Delete the ios directory if you get the 500 error

## How to build for iphone

### Config
Setup phone for provisioning: eas device:create
Note: env vars must be implemented in the profile's eas.json, and app.json must have scheme defined

### Build in cloud
1. eas build --platform ios --profile preview
2. Download on phone via QR code or link

### Build locally
1. Create a special branch for the build
2. CLI: npx expo prebuild --platform ios
3. CLI: open ios/SelfSci.xcworkspace
4. Xcode GUI: Click SelfSci in the top bar > Edit Scheme > Build Configuration: Release
5. Xcode GUI: In left panel, select folder icon > SelfSci > Signing & Capabilities (tab near top middle) > Team: Jaidon Lalor
6. Click play button

## How to view iphone crash logs

1. Plug phone into computer
2. Open xcode
3. Go to Window > Devices & Simulators (CMD + Shift 2)
4. Select device
5. Click "Open Console" or "Open Recent Logs" (small buttons in the top bar, left of the device image)