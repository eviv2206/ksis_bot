const Traceroute = require('nodejs-traceroute');
const {DESTINATION_TRACERT, END_TRACERT,
    SUCCESSFUL_TRACERT, ERROR_TRACERT} = require("../../message/messages");

const tracert = async (target, bot, chatId) => {
    try {
        const tracer = new Traceroute();
        tracer
            .on('destination', async (destination) => {
                await bot.sendMessage(chatId, DESTINATION_TRACERT.replace("$destination", destination));
            })
            .on('hop', async (hop) => {
                await bot.sendMessage(chatId, `${JSON.stringify(hop).replace(/['"]+/g, ' ')}`);
            })
            .on('close', async (code) => {
                await bot.sendMessage(chatId, END_TRACERT.replace('$code', code));
                await bot.sendMessage(chatId, SUCCESSFUL_TRACERT);
            });

        tracer.trace(target);
    } catch (ex) {
        await bot.sendMessage(chatId, ERROR_TRACERT.replace('$error', ex));
    }
}

 module.exports = tracert;