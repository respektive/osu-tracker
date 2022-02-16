# osu-tracker

 Statistics tracker for [osu!](https://osu.ppy.sh/) using [osu!api v2](https://osu.ppy.sh/docs/)

 ![Screenshot](https://pek.li/mi7t3o.png) ![Selecting Stats gif](https://pek.li/aywhs8.gif)

 **Features:**

- Several Statistics from the api for all four modes
- Hide/Show each Statistic
- Redordering the Stats list to your likings
- Score Rank using self-hosted api (rank updates every ~30min, good enough)
- Exporting Stats to text files for use in OBS or other programs (files are stored in systems temp directory)

 **Soon™ (Planned Features):**

- Restoring Stats after restart (Savable Sessions)

## Download

You can find the newest version [here](https://github.com/respektive/osu-tracker/releases/latest) or on the [Releases](https://github.com/respektive/osu-tracker/releases) page.

Includes portable version for Windows aswell as an AppImage and binary files for Linux.

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
