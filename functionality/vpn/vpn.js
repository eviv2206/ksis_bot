const axios = require('axios');

const {
    AVAILABLE_DOMAIN_VPN, SERVICE_VPN_NOT_AVAILABLE,
    UNAVAILABLE_DOMAIN_VPN, LIMIT_REQUEST_VPN, FAILED_CHECK_VPN
} = require("../../message/messages");

const checkWebsite = async (siteUrl, bot, chatId) => {
    try {
        const responseNodes = await axios.get('https://check-host.net/nodes/hosts', {
            headers: {
                'Accept': 'application/json'
            }
        });
        const allNodes = responseNodes.data.nodes;

        for (const [country, value] of Object.entries(allNodes)) {
            const request = await axios.get(`https://check-host.net/check-http?host=${siteUrl}&node=${country}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            (function (request) {
                setTimeout(async () => {
                    if (request.data.request_id) {
                        const requestId = request.data.request_id;
                        const checkResult = await axios.get(`https://check-host.net/check-result/${requestId}`, {
                            headers: {
                                'Accept': 'application/json'
                            }
                        });
                        if (checkResult.data[country] !== null && checkResult.data[country][0][0] === 1) {
                            await bot.sendMessage(chatId, AVAILABLE_DOMAIN_VPN
                                .replace("$url", siteUrl)
                                .replace("$location", value.location[1] + " " + value.location[2])
                                .replace("$code", checkResult.data[Object.keys(checkResult.data)[0]][0][3]),
                            );
                        } else if (checkResult.data[country] === null) {
                            await bot.sendMessage(chatId, SERVICE_VPN_NOT_AVAILABLE.replace("$country", country));
                        } else {
                            await bot.sendMessage(chatId, UNAVAILABLE_DOMAIN_VPN
                                .replace("$url", siteUrl)
                                .replace("$location", value.location[1] + " " + value.location[2])
                                .replace("$reason", checkResult.data[Object.keys(checkResult.data)[0]][0][2])
                            );
                        }
                    } else {
                        await bot.sendMessage(chatId, LIMIT_REQUEST_VPN);
                    }
                }, 4000);
            })(request);
        }
    } catch (error) {
        await bot.sendMessage(chatId, FAILED_CHECK_VPN.replace("$message", error.message));
    }
}

module.exports = checkWebsite;