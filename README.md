# osu-tracker

 Statistics tracker for [osu!](https://osu.ppy.sh/) using [osu!api v2](https://osu.ppy.sh/docs/)

## Obtaining osu!api v2 Client Credentials

1. Go to [the OAuth section on the account settings page](https://osu.ppy.sh/home/account/edit#oauth) and create a new OAuth Application.  
2. Give it a name like `osu-tracker` for example. (You don't need to set a Callback URL)  
3. Register your Application and copy the ID and Secret into the app.

## Building

Clone the repo and cd into

```sh
git clone https://github.com/respektive/osu-tracker.git
cd osu-tracker
```

Install modules

```sh
npm i
```

Build for Windows/Linux or run in dev mode

```sh
# Windows
npm run build-win
# Linux
npm run build-linux
# Dev
npm run dev
```

## Resources

This project uses resources form the following projects:

- [osu!resources](https://github.com/ppy/osu-resources), original gamemode icons
- [OsuOpenRoomsWeb](https://gitlab.com/WebFreak001/osu-open-rooms-web/), svg files of gamemode icons
- [Comfortaa](https://fonts.google.com/specimen/Comfortaa), font used for basically everything
