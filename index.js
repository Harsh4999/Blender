// WEB SERVER
const express = require('express')
const server = express()
const axios = require('axios');
const ud = require('urban-dictionary')
const inshorts= require('inshorts-api');
//const fs = require('fs');
const ytdl = require('ytdl-core');
const port = process.env.PORT || 8000;
server.get('/', (req, res) => { res.send('V-Bot server running...') })
server.listen(port, () => {
    console.clear()
    console.log('\nWeb-server running!\n')
})

// LOAD Baileys
const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange,
    MessageOptions,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
    ProxyAgent,
    waChatKey,
    mentionedJid,
    processTime,
} = require('@adiwajshing/baileys')

// LOAD DB CONNECTION
const db = require('./database');

// LOAD ADDITIONAL NPM PACKAGES
const fs = require('fs')//file module
const ffmpeg = require('fluent-ffmpeg')//sticker module
const WSF = require('wa-sticker-formatter')//sticker module

async function fetchauth() {
    try {
        auth_result = await db.query('select * from auth;');//checking auth table
        console.log('Fetching login data...')
        auth_row_count = await auth_result.rowCount;
        if (auth_row_count == 0) {
            console.log('No login data found!')
        } else {
            console.log('Login data found!')
            auth_obj = {
                clientID: auth_result.rows[0].clientid,
                serverToken: auth_result.rows[0].servertoken,
                clientToken: auth_result.rows[0].clienttoken,
                encKey: auth_result.rows[0].enckey,
                macKey: auth_result.rows[0].mackey
            }
        }
    } catch {
        console.log('Creating database...')//if login fail create a db
        await db.query('CREATE TABLE auth(clientID text, serverToken text, clientToken text, encKey text, macKey text);');
        await fetchauth();
    }

}

// BASIC SETTINGS
prefix = '/';
source_link = 'https://github.com/cysosancher/V-bot';

// LOAD CUSTOM FUNCTIONS
const getGroupAdmins = (participants) => {
    admins = []
    for (let i of participants) {
        i.isAdmin ? admins.push(i.jid) : ''
    }
    return admins
}
const adminHelp = (prefix, groupName) => {
    return `
─「 *${groupName} Admin Commands* 」─

*${prefix}add <phone number>*
    _Add any new member!_

*${prefix}kick <@mention>*
    _Kick any member out from group!_
    _Alias with ${prefix}remove, ${prefix}ban_

*${prefix}promote <@mention>*
    _Give admin permission to a member!_

*${prefix}demote <@mention>*
    _Remove admin permission of a member!_

*${prefix}rename <new-subject>*
    _Change group subject!_

*${prefix}chat <on/off>*
    _Enable/disable group chat_
    _/chat on - for everyone!_
    _/chat off - for admin only!_

*${prefix}link*
    _Get group invite link!_
    _Alias with ${prefix}getlink, ${prefix}grouplink_

*${prefix}sticker*
    _Create a sticker from different media types!_
    *Properties of sticker:*
        _crop_ - Used to crop the sticker size!
        _author_ - Add metadata in sticker!
        _pack_ - Add metadata in sticker!
        _nometadata_ - Remove all metadata from sticker!
    *Examples:*
        _${prefix}sticker pack Blender author bot_
        _${prefix}sticker crop_
        _${prefix}sticker nometadata_

*${prefix}news*
    _Show Tech News_
    _or /news <any category>_
    _Use /list for whole valid list_
    _category could be sports,bunsiness or anything_


*${prefix} yt*
     _download youTube video in best quality_
     eg:/yt linkadress

*${prefix}yts*
    _download youtube audio_
    eg:/yts linkadress
    
*${prefix}price*
    _show crypto price_
    eg:/price btc  
    
*${prefix}horo*
    _show horoscope_
    eg:/horo pisces    

*${prefix}tagall*
    _For attendance alert_(Testing phase)

*${prefix}dice*
    _Quick rich scheme,gamble with your friends🎲
        
*${prefix}ud*
    _Show Meaning of your name_
    eg:/ud ram   

*${prefix}spam*
    _only for super users_
    _Eg-/spam 30 Bot is love_  

*${prefix}removebot*
    _Remove bot from group!_

Made with love,use with love`
}


let allowedNumbs = ["917070224546", "916353553554"];


const getRandom = (ext) => { return `${Math.floor(Math.random() * 10000)}${ext}` }

// TECH NEWS ---------------------------

const url = "https://news-pvx.herokuapp.com/";
let latestNews = "TECH NEWS--------";

const getNews = async () => {
    const { data } = await axios.get(url);
    console.log(typeof data);
    let count = 0;

    let news = "☆☆☆☆☆💥 Tech News 💥☆☆☆☆☆ \n\n";
    data["inshorts"].forEach((headline) => {
        count += 1
        if (count > 13) return;
        news = news + "🌐 " + headline + "\n\n";
    });
    return news;
};

const postNews = async (categry)=>{
    console.log(categry)
    let n='';
    let z=categry;
    let arr =['national','business','sports','world','politics','technology','startup','entertainment','miscellaneous','hatke','science','automobile'];
    if (!arr.includes(z)){
        return "Enter a valid category:) or use /list for more info:)";
    }
    // var config = {
    //     method: 'GET',
    //      url: `https://newsapi.org/v2/top-headlines?country=in&category=${z}&apiKey=3a4f147812bd4428aea363ecdf2e6345`
    // }
    
    // const res = await axios.request(config).catch((e) => '')
    //     //let br = '*******************************';
	//console.log(res.status)
var options = {
  lang: 'en',
  category: z,
  numOfResults: 13  
}
n=`☆☆☆☆☆💥 ${z.toUpperCase()} News 💥☆☆☆☆☆ \n\n`
await inshorts.get(options, function(result){
  for(let i=0;i<result.length;i++){
    //console.log(result[i].title);
    let temp;
	temp = "🌐 "+result[i].title+"\n";
	n = n + temp + "\n";
    //console.log(n)
  }
}).catch((er)=>"");
   
/* 	for (let i = 0; i <=10; i++) {
		let temp;
		temp = "🌐 "+res.data.articles[i].title+"\n";
		n = n + temp + "\n";
		//n = n + br + "\n";
	} */
    //console.log(n);if im cosoling it it is giving object ....but its in not returning it
    return n;
}


// const refresh = async () => {

//     let date = new Date();
//     let hour = date.getHours();
//     let min = date.getMinutes();
//     let seconds = date.getSeconds();
//     if (hour === 20 && min === 0 && seconds === 0) {
//         return true;
//     }
//     else return false;
//}//crypto
//const axios = require('axios');
async function getPrice() {
    //cryptoCode=cryptoCode.toString()
    // cryptoCode = cryptoCode.toUpperCase()
    var mainconfig = {
        method: 'get',
        url: 'https://public.coindcx.com/market_data/current_prices'
    }
    return axios(mainconfig)
    // .then(async function (response) {
    //     var data = response.data
    //     console.log(data)
    //     var cryptoCodeINR = cryptoCode + "INR"
    //     if (data.cryptoCode.toString() != undefined || data.cryptoCodeINR.toString() != undefined) {
    //         cryptoCode = data.cryptoCode == undefined ? cryptoCodeINR : cryptoCode
    //         var out = ({
    //             name: cryptoCode,
    //             price: data.cryptoCode
    //         })
    //         return out
    //     } else {
    //         return "unsupported"
    //     }
    // })
    // .catch(function (error) {
    //     return "error"
    // })
}
module.exports = {
    getPrice
}
//Hroroscope function
async function gethoro(sunsign){
    var mainconfig={
        method:'POST',
        url: `https://aztro.sameerkumar.website/?sign=${sunsign}&day=today`
    }
    let horo
    await axios.request(mainconfig).then((res)=>{
        horo=res.data
    
    }).catch((error)=>{
        return false;
    })
    return horo;
    
}




// MAIN FUNCTION
async function main() {

    // LOADING SESSION
    const conn = new WAConnection()
    conn.logger.level = 'warn'
    conn.on('qr', () => { console.log('SCAN THE ABOVE QR CODE TO LOGIN!') })
    await fetchauth(); //GET LOGIN DATA
    if (auth_row_count == 1) { conn.loadAuthInfo(auth_obj) }
    conn.on('connecting', () => { console.log('Connecting...') })
    conn.on('open', () => {
        console.clear()
        console.log('Connected!')
    });
    conn.connectOptions.alwaysUseTakeover = true;
    //conn.setMaxListeners(50);
    await conn.connect({ timeoutMs: 30 * 1000 })
    const authInfo = conn.base64EncodedAuthInfo() // UPDATED LOGIN DATA
    load_clientID = authInfo.clientID;
    load_serverToken = authInfo.serverToken;
    load_clientToken = authInfo.clientToken;
    load_encKey = authInfo.encKey;
    load_macKey = authInfo.macKey;
    // INSERT / UPDATE LOGIN DATA
    if (auth_row_count == 0) {
        console.log('Inserting login data...')
        db.query('INSERT INTO auth VALUES($1,$2,$3,$4,$5);', [load_clientID, load_serverToken, load_clientToken, load_encKey, load_macKey])
        db.query('commit;')
        console.log('New login data inserted!')
    } else {
        console.log('Updating login data....')
        db.query('UPDATE auth SET clientid = $1, servertoken = $2, clienttoken = $3, enckey = $4, mackey = $5;', [load_clientID, load_serverToken, load_clientToken, load_encKey, load_macKey])
        db.query('commit;')
        console.log('Login data updated!')
    }

    // news
    /*    setInterval(()=>{
            if(refresh()){
                Latestnews = getNews(); 
            }
        },1000);
    */

    conn.on('group-participants-update', (anu) => {
        try {
            const mdata = conn.groupMetadata(anu.jid)
            console.log(anu)
            if (anu.action == 'add') {
                num = anu.participants[0]
                num_split = `${num.split('@s.whatsapp.net')[0]}`
                console.log('Joined: ', num)
            }
        } catch (e) {
            console.log(e)
        }
    })

    conn.on('chat-update', async (mek) => {
        try {
            if (!mek.hasNewMessage) return
            mek = JSON.parse(JSON.stringify(mek)).messages[0]
            if (!mek.message) return
            if (mek.key && mek.key.remoteJid == 'status@broadcast') return
            if (mek.key.fromMe) return
            const content = JSON.stringify(mek.message)
            global.prefix
            const from = mek.key.remoteJid
            const type = Object.keys(mek.message)[0]
            const {
                text,
                extendedText,
                contact,
                location,
                liveLocation,
                image,
                video,
                sticker,
                document,
                audio,
                product,
                listMessage,
                buttonsMessage,
                buttonResponseMessage,
                tittle,
                
            } = MessageType
            body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text :
            (type == 'listMessage')&& mek.message.listMessage.startsWith(prifix)?mek.message.listMessage :(type == 'buttonsMessage')&& mek.message.buttonsMessage.startsWith(prifix)?mek.message.buttonsMessage: (type=='buttonResponseMessage' || 'buttonsMessage')||mek.message.buttonMessage.startsWith(prefix)?console.log("reached here"):''
            

            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const args = body.trim().split(/ +/).slice(1)
            const isCmd = body.startsWith(prefix)

            errors = {
                admin_error: '_❌ ERROR: Admin se baat kar,tere bas ka nai hai...(*Baka*Mujhe Admin bana Pehle) ❌_'
            }

            const botNumber = conn.user.jid
            const isGroup = from.endsWith('@g.us')
            const sender = isGroup ? mek.participant : mek.key.remoteJid
            const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const groupMembers = isGroup ? groupMetadata.participants : ''
            const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
            const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
            const isGroupAdmins = groupAdmins.includes(sender) || false

            const reply = (teks) => {
                conn.sendMessage(from, teks, text, {
                    quoted: mek
                })
            }
            // const taggy=(mesaj)=>{
            //     conn.sendMessage(from, mesaj, MessageType.extendedText, { contextInfo: { mentionedJid: jids }, previewType: 0 });

            // }

            const costum = async (pesan, tipe, target, target2) => {
                await conn.sendMessage(from, pesan, tipe, {
                    quoted: {
                        key: {
                            fromMe: false,
                            participant: `${target}`,
                            ...(from ? {
                                remoteJid: from
                            } : {})
                        },
                        message: {
                            conversation: `${target2}`
                        }
                    }
                })
            }



            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
            const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
            const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
            const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
            let senderNumb = sender.split('@')[0];
            //console.log("SENDER NUMB:", senderNumb);

            if (isGroup) {
                console.log('[COMMAND]', command, '[FROM]', sender.split('@')[0], '[IN]', groupName,typeof(mek))

                /////////////// COMMANDS \\\\\\\\\\\\\\\

                switch (command) {

                    /////////////// HELP \\\\\\\\\\\\\\\

                    case 'help':
                    case 'acmd':
                        if (!isGroup) return;
                        await costum(adminHelp(prefix, groupName), text);

                        break

                    case 'link':
                    case 'getlink':
                    case 'grouplink':
                        if (!isGroup) return;
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        gc_invite_code = await conn.groupInviteCode(from)
                        gc_link = `https://chat.whatsapp.com/${gc_invite_code}`
                        conn.sendMessage(from, gc_link, text, {
                            quoted: mek,
                            detectLinks: true
                        })
                        break;

                    case 'tagall':
                        if (!isGroup) return;
                        console.log("SENDER NUMB:", senderNumb);

                        if (allowedNumbs.includes(senderNumb)||isGroupAdmins) {
                            let jids = [];
                            let mesaj = '';

                            for (let i of groupMembers) {
                                console.log(i.id)
                                mesaj += '@' + i.id.split('@')[0] + ' ';
                                console.log(mesaj)
                                jids.push(i.id.replace('c.us', 's.whatsapp.net'));
                                // taggy=mesaj.concat(jids)
                            }
                            // var tx = message.reply_message.text
                            console.log("Outside loop")
                            console.log(mesaj);
                            console.log(jids);
                            // reply(taggy)
                            //reply(mesaj);
                            let tx = "xyz"
                            await conn.sendMessage(from, mesaj, MessageType.extendedText,
                             { contextInfo: { mentionedJid: jids },quoted:mek });
                           //taggy(" ");
                        }
                        else {
                            reply("No Permission !")
                        }
                        break;


                    case 'sticker':
                        if (!isGroup) return;

                        // Format should be <prefix>sticker pack <pack_name> author <author_name>
                        var packName = ""
                        var authorName = ""

                        // Check if pack keyword is found in args!
                        if (args.includes('pack') == true) {
                            packNameDataCollection = false;
                            for (let i = 0; i < args.length; i++) {
                                // Enables data collection when keyword found in index!
                                if (args[i].includes('pack') == true) {
                                    packNameDataCollection = true;
                                }
                                if (args[i].includes('author') == true) {
                                    packNameDataCollection = false;
                                }
                                // If data collection is enabled and args length is more then one it will start appending!
                                if (packNameDataCollection == true) {
                                    packName = packName + args[i] + ' '
                                }
                            }
                            // Check if variable contain unnecessary startup word!
                            if (packName.startsWith('pack ')) {
                                packName = `${packName.split('pack ')[1]}`
                            }
                        }


                        // Check if author keyword is found in args!
                        if (args.includes('author') == true) {
                            authorNameDataCollection = false;
                            for (let i = 0; i < args.length; i++) {
                                // Enables data collection when keyword found in index!
                                if (args[i].includes('author') == true) {
                                    authorNameDataCollection = true;
                                }
                                // If data collection is enabled and args length is more then one it will start appending!
                                if (authorNameDataCollection == true) {
                                    authorName = authorName + args[i] + ' '
                                }
                                // Check if variable contain unnecessary startup word!
                                if (authorName.startsWith('author ')) {
                                    authorName = `${authorName.split('author ')[1]}`
                                }
                            }
                        }

                        // Check if packName and authorName is empty it will pass default values!
                        if (packName == "") {
                            packName = "Blender"
                        }
                        if (authorName == "") {
                            authorName = "Blender N/v"
                        }

                        outputOptions = [`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`];
                        if (args.includes('crop') == true) {
                            outputOptions = [
                                `-vcodec`,
                                `libwebp`,
                                `-vf`,
                                `crop=w='min(min(iw\,ih)\,500)':h='min(min(iw\,ih)\,500)',scale=500:500,setsar=1,fps=15`,
                                `-loop`,
                                `0`,
                                `-ss`,
                                `00:00:00.0`,
                                `-t`,
                                `00:00:10.0`,
                                `-preset`,
                                `default`,
                                `-an`,
                                `-vsync`,
                                `0`,
                                `-s`,
                                `512:512`
                            ];
                        }

                        if ((isMedia && !mek.message.videoMessage || isQuotedImage)) {
                            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
                            const media = await conn.downloadAndSaveMediaMessage(encmedia)
                            ran = getRandom('.webp')
                            reply('⌛Ruk Bhai..Kar raha ⏳')
                            await ffmpeg(`./${media}`)
                                .input(media)
                                .on('error', function (err) {
                                    fs.unlinkSync(media)
                                    console.log(`Error : ${err}`)
                                    reply('_❌ ERROR: Failed to convert image into sticker! ❌_')
                                })
                                .on('end', function () {
                                    buildSticker()
                                })
                                .addOutputOptions(outputOptions)
                                .toFormat('webp')
                                .save(ran)

                            async function buildSticker() {
                                if (args.includes('nometadata') == true) {
                                    conn.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: mek })
                                    fs.unlinkSync(media)
                                    fs.unlinkSync(ran)
                                } else {
                                    const webpWithMetadata = await WSF.setMetadata(packName, authorName, ran)
                                    conn.sendMessage(from, webpWithMetadata, MessageType.sticker)
                                    fs.unlinkSync(media)
                                    fs.unlinkSync(ran)
                                }
                            }

                        } else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11)) {
                            const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
                            const media = await conn.downloadAndSaveMediaMessage(encmedia)
                            ran = getRandom('.webp')
                            reply('⌛ Ho raha Thoda wait karle... ⏳')
                            await ffmpeg(`./${media}`)
                                .inputFormat(media.split('.')[1])
                                .on('error', function (err) {
                                    fs.unlinkSync(media)
                                    mediaType = media.endsWith('.mp4') ? 'video' : 'gif'
                                    reply(`_❌ ERROR: Failed to convert ${mediaType} to sticker! ❌_`)
                                })
                                .on('end', function () {
                                    buildSticker()
                                })
                                .addOutputOptions(outputOptions)
                                .toFormat('webp')
                                .save(ran)

                            async function buildSticker() {
                                if (args.includes('nometadata') == true) {
                                    conn.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: mek })
                                    fs.unlinkSync(media)
                                    fs.unlinkSync(ran)
                                } else {
                                    const webpWithMetadata = await WSF.setMetadata(packName, authorName, ran)
                                    conn.sendMessage(from, webpWithMetadata, MessageType.sticker)
                                    fs.unlinkSync(media)
                                    fs.unlinkSync(ran)
                                }
                            }
                        }
                        break

                    case 'ud':
                        try {

                            let result = await ud.define(args[0])

                            let term = result[0].word;
                            let def = result[0].definition;
                            let example = result[0].example;

                            reply(`*Term*: ${term} 
*Definition*: ${def}
*Example*: ${example}`);
                        }
                        catch {
                            reply("🙇‍♂️ Sorry to say but this word/creature does not exist")
                        }

                        break

                    case 'snu':
                        if (!isGroup) return;
                        if (groupName == "Cambradge Univaarsity📚🪄🍻🤩" || groupName == "Temp" || groupName == "Chinku minku ❤🤧") {
                            reply(`*Facality Members info :-*
  
 – *Joy Sir*(Class Teacher) mail id: joy.d@snuniv.ac.in
  *phoneNo*: +91 89815 32753

 – *Mousumi* ma'am (HOD Cse) mail id: mousumi.b@snuniv.ac.in
 
 – *Chemistry* Prof's ID(Sudipta Mam): sudipta.b@snuniv.ac.in
 	
 – *Electronics* Prof's ID: ayan.m@snuniv.ac.in
 
 – *Cleartest Web Link*: https://test.direct.cleartestonline.com/

 – *MProcess* Prof's ID: paramanand.n@snuniv.ac.in

 – *English* Mam : you can directly text her on her whatsapp from offical group😜

 – *Chandan Sir* mailId: chan.muk@gmail.com
 – *DriveLink*: https://drive.google.com/drive/folders/1exyMsuw4m3pnhZvQvox-5g2m9DKBgiPN              
 
 –For any other assest,You can get in touch with Kaninika🌚(only With her concern)
 `)
                        }
                        else {
                            await reply("*Baka* NOT ALLOWED in this group,Contact Developers!");
                        }
                        break
                       
                    case 'dice':
                        let upper = 6
                        let lower = 1
                        let myRandom = Math.floor(Math.random() * (upper - lower + 1) + lower)
                        reply(`Hey,Your luck gives you:\n🎲${myRandom}🎲`)
                        break

                        case 'horo':
                            if (!isGroup) return;
                        console.log("SENDER NUMB:", senderNumb);
                        let horoscope=args[0];
                        let h_Low=horoscope.toLowerCase();
                        let l=['aries','taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius','pisces']
                        if(!l.includes(h_Low)){
                            reply ("SAhi se daal bhai,sign 12 he hote hai :)")       
                        }else{
                            const callhoro=await gethoro(h_Low);
                        reply(`*Date Range*:-${callhoro.date_range}
*Nature Hold's For you*:-${callhoro.description}
*Compatibility*:-${callhoro.compatibility}
*Mood*:-${callhoro.mood}
*color*:-${callhoro.color}
*Lucky Number*:-${callhoro.lucky_number}
*Lucky time*:-${callhoro.lucky_time}                       `)}
                            break

                    case 'yt':
                        var url = args[0];
                        console.log(`${url}`)
                        const dm = async (url) => {
                            let info = ytdl.getInfo(url)
                            const stream = ytdl(url, { filter: info => info.itag == 22 || info.itag == 18 })
                                .pipe(fs.createWriteStream('video.mp4'));
                            console.log("Video downloaded")
                            await new Promise((resolve, reject) => {
                                stream.on('error', reject)
                                stream.on('finish', resolve)
                            }).then(async (res) => {
                                await conn.sendMessage(
                                    from,
                                    fs.readFileSync('video.mp4'),
                                    MessageType.video,
                                    { mimetype: Mimetype.mp4 }
                                )
                                console.log("Sent ")

                            }).catch((err) => {
                                reply`Unable to download,contact dev.`;
                            });

                        }
                        dm(url)
                        break
                        case 'list':
                            reply(` *Use this options as category* :
national (India)
business
sports
world
politics
technology
startup
entertainment
miscellaneous
hatke (unusual)
science
automobile`)
break
   case'todo':
   const rows = [
    {title: '/Upcoming Features:', description: "Adding Daily Quiz support , Eval is coming 👽,Making commands automated", rowId:"rowid1"}
   ]
   
   const sections = [{title: "Section 1", rows: rows}]
   
   const button = {
    buttonText: 'Click Me!',
    description: "Click on it to view the update RoadMap of the BOT",
    sections: sections,
    listType: 1
   }
   const sendMsg = await conn.sendMessage(from, button, MessageType.listMessage)
   break
   case'sut':
   const buttons = [
    {buttonId: 'id1', buttonText: {displayText: '/help'}, type: 1},
    {buttonId: 'id2', buttonText: {displayText: '/news'}, type: 1},
    {buttonId: 'id3', buttonText: {displayText: '/todo'}, type: 1},
    {buttonId: 'id4', buttonText: {displayText: 'GitHub'}, type: 1},
  ]
  
  const buttonMessage = {
      contentText: "Hi Check out my Features",
      footerText: 'version-2.0',
      buttons: buttons,
      headerType: 1
  }
  
  const sendBMsg = await conn.sendMessage(from, buttonMessage, MessageType.buttonsMessage)
   
                        
                        break;

                    case 'yts':
                        var url1 = args[0];
                        console.log(`${url1}`)
                        const am = async (url1) => {
                            let info = ytdl.getInfo(url1)
                            const stream = ytdl(url1, { filter: info => info.audioBitrate == 160 || info.audioBitrate == 128 })
                                .pipe(fs.createWriteStream('audio.mp3'));
                            console.log("audio downloaded")
                            await new Promise((resolve, reject) => {
                                stream.on('error', reject)
                                stream.on('finish', resolve)
                            }).then(async (res) => {
                                await conn.sendMessage(
                                    from,
                                    fs.readFileSync('audio.mp3'),
                                    MessageType.audio,
                                    { mimetype: Mimetype.mp4Audio }
                                ).then((resolved)=>{
                                console.log("Sent ")})
                                .catch((reject)=>{
                                    reply`Enable to download send a valid req`
                                })

                            }).catch((err) => {
                                reply`Unable to download,contact dev.`;
                            });

                        }
                        am(url1)
                        break

                    case 'price':
                        if (!isGroup) return;
                        if(senderNumb=="919938970796"){
                            reply("AAP EXCHANGE Mai DEKHO BRO :) Amrit BRO")
                            return;
                        }
                        console.log("SENDER NUMB:", senderNumb);
                        //var data = await crypto.getPrice
                        var date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
                        // if (!isGroupAdmins && !allowedNumbs.includes(senderNumb)) {
                        //     reply("These are the admin commands");
                        //     return;
                        // }
                        //previous

                        // let kprice = await getPrice(args[0]);
                        // reply(kprice.toString());
                        // console.log(kprice.toString());
                        getPrice().then((resolved) => {
                            var cc = args[0];
                            var cc1 = cc.toUpperCase() + "INR"
                            var cc2 = cc.toUpperCase() + "USDT";
                            var cc3=cc.toUpperCase()+ "BTC";
                            var kprice = resolved.data[cc2]
                            var iPrice = resolved.data[cc1]
                            var bPrice=resolved.data[cc3]
                            if (kprice) {
                                reply(`*${cc2}* = $${Number(kprice)}

*${cc1}* = ₹${Number(iPrice)}

*${cc3}* = ${Number(bPrice)}

*DON't SPAM,ELSE I'LL BAN* 
                           ~MUNDAL`);
                                // if (iPrice) {
                                //     reply(`${cc1} = ₹${Number(iPrice)}`)
                            //}
                            } else {
                                reply('Coin not found');
                            }
                        }).catch((err) => {
                            console.log(err);
                        });

                        break



                    /////////////// ADMIN COMMANDS \\\\\\\\\\\\\\\
                    //reply = reply with tag 
                    //costum("ourTEXT",text) = reply without tagging
                    case 'spam':
                        console.log("SPAM ARGS:", args)
                        if (args.length < 2) {
                            console.log("Insufficient arguments!");
                            break
                        }
                        console.log("SENDER NUMB:", senderNumb);

                        if (allowedNumbs.includes(senderNumb)|| isGroupAdmins) {

                            let count = Number(args[0]);
                            let msgToSpam = args[1];
                            let i = 0;
                            for (i = 2; i < args.length; ++i) msgToSpam += " " + args[i];

                            console.log("MSG TO SPAM: ", msgToSpam);
                            i = 0
                            while (i < count && i < 100) {
                                //reply(msgToSpam);
                                await costum(msgToSpam, text);
                                ++i;
                            }
                        }
                        else {
                            await reply("*Baka* NOT ALLOWED TO SPAM,Contact Developers!");
                        }
                        break

                    case 'news':
                        if (!isGroup) return;
                        console.log("SENDER NUMB:", senderNumb);
                        // if (!isGroupAdmins && !allowedNumbs.includes(senderNumb)) {
                        //     reply("These are the admin commands");
                        //     return;
                        // }
                        if(args[0]){
                         var topic=args[0]
                          let s= await postNews(topic); //is this where the error occur yes let me push
                          reply(s);
                        }else{
                        let news = await getNews();
                        reply(news);}
                        break

                    case 'add':
                        if (!isGroup) return;
                        if (!isGroupAdmins) {
                            reply("These are the admin commands");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (args.length < 1) return;
                        var num = '';
                        if (args.length > 1) {
                            for (let j = 0; j < args.length; j++) {
                                num = num + args[j]
                            }
                            num = `${num.replace(/ /g, '')}@s.whatsapp.net`
                        } else {
                            num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
                        }
                        if (num.startsWith('+')) {
                            num = `${num.split('+')[1]}`
                        }
                        const response = await conn.groupAdd(from, [num])
                        get_status = `${num.split('@s.whatsapp.net')[0]}`
                        get_status = response[`${get_status}@c.us`];
                        if (get_status == 400) {
                            reply('_❌ ERROR: Invalid number! ❌_');
                        }
                        if (get_status == 403) {
                            reply('_❌ ERROR: Number has privacy on adding group! ❌_');
                        }
                        if (get_status == 408) {
                            reply('_❌ ERROR: Number has left the group recently! ❌_');
                        }
                        if (get_status == 409) {
                            reply('_❌ ERROR: Number is already exists! ❌_');
                        }
                        if (get_status == 500) {
                            reply('_❌ ERROR: Group is currently full! ❌_');
                        }
                        if (get_status == 200) {
                            reply('_✔ SUCCESS: Number added to group! ✔_');
                        }
                        break;

                    case 'kick':
                    case 'remove':
                    case 'ban':
                        if (!isGroup) return;
                        if (!isGroupAdmins) {
                            reply("These are the admin commands");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return;
                        mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
                        if (groupAdmins.includes(`${mentioned}`) == true) return;
                        if (mentioned.length > 1) {
                            return;
                        } else {
                            conn.groupRemove(from, mentioned)
                        }
                        break;

                    case 'promote':
                        if (!isGroup) return;

                        if (!isGroupAdmins) {
                            reply("These are the admin commands");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return;
                        mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
                        if (groupAdmins.includes(`${mentioned}`) == true) return;
                        if (mentioned.length > 1) {
                            return;
                        } else {
                            conn.groupMakeAdmin(from, mentioned)
                        }
                        break;

                    case 'demote':
                        if (!isGroup) return;
                        if (!isGroupAdmins) {
                            reply("These are the admin commands");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('_⚠ USAGE: /demote <@mention> ⚠_');
                        mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
                        if (groupAdmins.includes(`${mentioned}`) == false) return;
                        if (mentioned.length > 1) {
                            return;
                        } else {
                            conn.groupDemoteAdmin(from, mentioned)
                        }
                        break;

                    case 'chat':
                        if (!isGroup) return;
                        if (!isGroupAdmins) {
                            reply("These are the admin commands");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (args.length < 1) return;
                        if (args[0] == 'on') {
                            conn.groupSettingChange(from, GroupSettingChange.messageSend, false);
                        } else if (args[0] == 'off') {
                            conn.groupSettingChange(from, GroupSettingChange.messageSend, true);
                        } else {
                            return;
                        }
                        break;

                    case 'rename':
                        if (!isGroup) return;
                        if (!isGroupAdmins) {
                            reply("These are the admin commands");
                            return;
                        }
                        if (!isBotGroupAdmins) return reply(errors.admin_error);
                        if (args.length < 1) return;
                        get_subject = '';
                        for (i = 0; i < args.length; i++) {
                            get_subject = get_subject + args[i] + ' ';
                        }
                        conn.groupUpdateSubject(from, get_subject);
                        break;

                    case 'removebot':
                        if (!isGroup) return;
                        if (!isGroupAdmins) {
                            reply("These are the admin commands");
                            return;
                        }
                        conn.groupLeave(from)
                        break;

                    default:
                        reply(`*Bakka*,Type Right commands or else,I'll ban you Type */help* for Assistance`)
                        break;
                }
            }
        } catch (e) {
            console.log('Error : %s', e)
        }
    })
}
main()
