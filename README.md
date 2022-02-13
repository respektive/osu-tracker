# osu-tracker

 Statistics tracker for osu! using Apiv2
 
## Obtaining ApiV2 Client Credentials

1. Go to [the OAuth section on the account settings page](https://osu.ppy.sh/home/account/edit#oauth) and create a new OAuth Application.  
2. Give it a name like `osu-tracker` for example. (You don't need to set a Callback URL)  
3. Register your Application and copy the ID and Secret into the app.

## Building

Clone the repo and cd into
```
git clone https://github.com/respektive/osu-tracker.git
cd osu-tracker
```
Install modules
```
npm i
```
Build for Windows/Linux or run in dev mode
```
# Windows
npm run build-win
# Linux
npm run build-linux
# Dev
npm run dev
```
