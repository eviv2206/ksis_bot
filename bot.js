const TelegramBot = require('node-telegram-bot-api');
const {
    PLEASE_WAIT,
    ERROR_REASON,
    HELP_MESSAGE,
    EXECUTING_TRACERT,
    WELCOME_MESSAGE,
    INPUT_DOMAIN_NAME,
    INPUT_DOMAIN_AND_PORT,
    COMMAND_ABORTED,
    CANNOT_RESOLVE_MESSAGE
} = require('./message/messages');
const checkPort = require('./functionality/port/port');
const checkDomainAvailability = require('./functionality/domainName/domainName');
const tracert = require('./functionality/tracert/tracert');
const checkWebsite = require('./functionality/vpn/vpn')
require('dotenv').config();


const bot = new TelegramBot(process.env.TG_BOT_TOKEN, {polling: true});

let currentCommand = null;

const listCommands = ['/check_domain', '/check_vpn', '/check_port', '/tracert', '/start', '/help', '/abort'];

const executeCheckPort = async (msg, match) => {

    const host = match[1];
    const port = parseInt(match[2], 10) || 80;
    await bot.sendMessage(msg.chat.id, PLEASE_WAIT)
    currentCommand = null;
    checkPort(host, port)
        .then(async (result) => {
            await bot.sendMessage(msg.chat.id, result);
        })
        .catch(async (err) => {
            await bot.sendMessage(msg.chat.id, err);
            console.log(`chatId: ${msg.chat.id}`, ERROR_REASON.replace('$reason', err))
        });
}

const executeTracert = async (msg, match) => {
    const chatId = msg.chat.id;
    const target = match[0];
    currentCommand = null;
    await bot.sendMessage(msg.chat.id, PLEASE_WAIT)
    await bot.sendMessage(chatId, EXECUTING_TRACERT.replace("$target", target));
    await tracert(target, bot, chatId);
}

const executeCheckDomain = async (msg, match) => {
    const domainName = match[0];
    currentCommand = null;
    await bot.sendMessage(msg.chat.id, PLEASE_WAIT)
    const result = await checkDomainAvailability(domainName);
    await bot.sendMessage(msg.chat.id, result);
}

const executeCheckVpn = async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match[0];
    currentCommand = null;
    await bot.sendMessage(msg.chat.id, PLEASE_WAIT)
    await checkWebsite(url, bot, chatId);
}

bot.onText(/\/check_port/, async (msg) => {
    currentCommand = 'checkPort';
    await bot.sendMessage(msg.chat.id, INPUT_DOMAIN_AND_PORT);
})

bot.onText(/\/tracert/, async (msg) => {
    currentCommand = 'tracert';
    await bot.sendMessage(msg.chat.id, INPUT_DOMAIN_NAME);
})

bot.onText(/\/check_domain/, async (msg) => {
    currentCommand = 'checkDomain';
    await bot.sendMessage(msg.chat.id, INPUT_DOMAIN_NAME);
})

bot.onText(/\/check_vpn/, async (msg) => {
    currentCommand = 'checkVpn';
    await bot.sendMessage(msg.chat.id, INPUT_DOMAIN_NAME);
})


bot.onText(/\/check_port (.+) (\d+)/, async (msg, match) => {
    await executeCheckPort(msg, match);
});

bot.onText(/\/check_domain (.+)/, async (msg, match) => {
    await executeCheckDomain(msg, match);
});

bot.onText(/\/tracert\s+(\w+)/, async (msg, match) => {
    await executeTracert(msg, match);
});

bot.onText(/\/check_vpn (.+)/, async (msg, match) => {
    await executeCheckDomain(msg, match);
});

bot.onText(/\/start/, async (msg) => {
    currentCommand = null;
    const chatId = msg.chat.id;
    const date = new Date(msg.date * 1000).toLocaleTimeString();
    const name = msg.chat.first_name;
    await bot.sendMessage(chatId, WELCOME_MESSAGE
        .replace("$name", name)
        .replace("$time", date),
    );
});

bot.onText(/\/help/, async (msg) => {
    currentCommand = null;
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, HELP_MESSAGE);
});

bot.onText(/\/abort/, async (msg) => {
    currentCommand = null;
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, COMMAND_ABORTED);
});

bot.onText(/^([^\s]+)(\s+(\d+))?$/, async (msg, match) => {
    if (currentCommand !== null && !listCommands.includes(msg.text)) {
        switch (currentCommand) {
            case 'checkPort':
                await executeCheckPort(msg, match);
                break;
            case 'tracert':
                await executeTracert(msg, match);
                break;
            case 'checkDomain':
                await executeCheckDomain(msg, match);
                break;
            case 'checkVpn':
                await executeCheckVpn(msg, match);
                break;
        }
    } else if (!listCommands.includes(msg.text)) {
        await bot.sendMessage(msg.chat.id, CANNOT_RESOLVE_MESSAGE);
    }
})
