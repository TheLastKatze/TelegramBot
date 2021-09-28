const { Telegraf, Markup } = require('telegraf')
const fetch = require('node-fetch')
const { rewardRunner } = require('./rewards')

const bot = new Telegraf('2033196790:AAGbrvOtOstVAMwDxC3l-UBGJlKUpkuLe5M')


bot.start((ctx) => {
    //console.log(ctx.from)
    ctx.reply('Welcome' + ' ' + ctx.from.username + '\n' + 'Commands:' + '\n' + 'dec: Show all dec from all accounts' + '\n' + 'all: Rewards from all accounts' + '\n'
        + 'account-name: Last reward from that account')
})

const cuentas = ['lost-katze', 'mirage-mage', 'alpaca-pacalt', 'alpaca-gold-0000', 'alpaca-gold-0001', 'alpaca-gold-0002', 'alpaca-gold-0003', 'alpaca-gold-0004']

bot.hears(['dec', 'DEC', 'Dec'], async (ctx) => {

    var contenido = '';

    for (let index = 0; index < cuentas.length; index++) {
        const cuenta = cuentas[index];

        const decReq = await fetch('https://api2.splinterlands.com/players/balances?username=' + cuenta);
        const decData = await decReq.json();
        let balance = 0;

        for (let index = 0; index < decData.length; index++) {
            const element = decData[index];
            const token = element.token;

            if (token == "DEC") {
                balance = parseFloat(element.balance)
            }
        }

        contenido = contenido + cuenta + '     ' + balance + '\n';
    }

    ctx.reply(contenido)
})

bot.hears(['rank', 'Rank', 'rate', 'Rate'], async (ctx) => {

    var cnt = '';

    for (let index = 0; index < cuentas.length; index++) {
        const cuenta = cuentas[index];

        const dataReq = await fetch('https://api2.splinterlands.com/players/details?name=' + cuenta + "&season_details=true");
        const data = await dataReq.json();
        const season_details = data.season_details;

        let rank = season_details.rating;
        let wins = parseFloat(season_details.wins);
        let battles = parseFloat(season_details.battles);
        let win_rate = parseFloat(wins / battles);
        win_rate = await win_rate.toFixed(3)*100;
        win_rate = await win_rate.toFixed(3)
        cnt = cnt + cuenta + '\t\t\t R' + rank + ' - ' + win_rate + '%' + '\n';
    }

    ctx.reply(cnt)
})

bot.hears(cuentas, async (ctx) => {
    //console.log(ctx.update.message.text);
    let result = await rewardRunner(ctx.update.message.text);
    ctx.reply(result)
})

bot.hears('all', async (ctx) => {
    //console.log(ctx.update.message.text);
    var result = '';
    for (let index = 0; index < cuentas.length; index++) {
        const element = cuentas[index];
        result += 'Account: ' + element + '\n' + await rewardRunner(element) + '\n' + '\n';
    }
    ctx.reply(result)
})

//command without /
bot.hears('$', ctx => { ctx.reply('Pay me') })

//ask /xyz
bot.command(['xyz'], (ctx) => { ctx.reply('coso') })


bot.launch()