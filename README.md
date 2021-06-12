
## Simple Whatsapp Bot - Node Js - Heroku - Baileys

**_Requirements :_**

- Heroku account
- Heroku CLI
- Git

# Instructions:-

## Git Setup
### Download and install git from (https://git-scm.com/downloads)

## Heroku Setup

1. Create account on heroku. (https://signup.heroku.com/)

2. After login on heroku dashboard create an app on heroku (https://dashboard.heroku.com/apps)

3. In the 'Resources' tab search for 'Heroku Postgres' in Add-ons and add it to your heroku app. 

4. In the 'Deploy' section download Heroku CLI or from (https://devcenter.heroku.com/articles/heroku-cli#download-and-install)

## Heroku CLI

1. After downloading and installing Heroku CLI in your system login to heroku cli using `heroku login` in command prompt or powershell.
2. Add ffmpeg (*for sticker support*) in your heroku app using `heroku buildpacks:add https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git -a <your-app-name>`
3. After adding ffmpeg now add 'Heroku Buildpack for Node.js' using  `heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nodejs.git -a <your-app-name>`
4. Now download or clone the `simple-whatsapp-bot` repo from (https://github.com/karmaisgreat/simple-whatsapp-bot) 
5. Now enter in `simple-whatsapp-bot` directory using `cd simple-whatsapp-bot` in command prompt or terminal.
6. Now init the git using `git init`
7. Create the remote region using `heroku git:remote -a <your-app-name>`
8. Now deploy the repo in your heroku app using :
   - `git add .`
   - `git commit -am "first commit"`
   - `git push heroku master`
9. Now after the deploy process is completed use `heroku logs -a <your-app-name> --tail` to get real time logs from heroku app.
10. In real time logs it will automatically ask you for login using qr code just simple scan the qr code using your whatsapp web section, and you are done.
11. Scan QR code with you phone. done!


# Features:-

## Default prefix : `/`

## Commands :

|  Commands             |       Alias                  |       Description        |
| :--------:            |       :----:                 | :----------------------: |
|   `/help`             |       `/acmd`                |  Display help message    |
|    `/add`             |       -                      |    Add member to group    |
|   `/kick`             |       `/ban, /remove`        |   Remove member from group    |
|  `/promote`           |       -                      |  Make member admin in group  |
|  `/demote`            |       -                      |  Remove member from admin in group |
|  `/rename`            |       -                      |  Change group subject |
|   `/chat <on/off>`    |       -                      |  Enable/disable group chat |
|   `/link`             |       `/getlink, /grouplink` |  Get invite link of group |
|   `/sticker`          |       -                      |  Create a sticker from different media types |
| `/removebot`          |       -                      | Remove bot from group |
| `/source`          |       -                      | Get the bot source |


# Note:-
   Since heroku uses:- Dyno sleeping in which if an app has a free web dyno, and that dyno receives no web traffic in a 30-minute period, it will sleep. In addition to the web dyno sleeping, the worker dyno (if present) will also sleep. and if a sleeping web dyno receives web traffic, it will become active again after a short delay (assuming your account has free dyno hours available)
   You can use (http://kaffeine.herokuapp.com) to ping the heroku app every 30 minutes to prevent it from sleeping.
   


# References:-

- [@Baileys](https://github.com/adiwajshing/Baileys)
- [@WA-STICKER-FORMATTER](https://github.com/Alensaito1/wa-sticker-formatter)
