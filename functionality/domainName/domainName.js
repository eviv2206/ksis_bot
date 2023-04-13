const axios = require('axios');
const {DOMAIN_AVAILABLE, DOMAIN_UNAVAILABLE, ERROR, ERROR_REASON} = require('../../message/messages');
require('dotenv').config();

const SERVICE = "godaddy.com"

const checkDomainAvailability = async (domainName) => {
    try {

        const response = await axios.get(`https://api.godaddy.com/v1/domains/available?domain=${domainName}&checkType=FULL&forTransfer=false`, {
            headers: {
                Authorization: `sso-key ${process.env.GODADDY_KEY}:${process.env.GODADDY_SECRECY}`
            }
        });


        if (response.data.available) {
            return DOMAIN_AVAILABLE
                .replace("$service", SERVICE)
                .replace("$domain", domainName)
                .replace("$price", response.data.price + response.data.currency);
        } else {
            return DOMAIN_UNAVAILABLE
                .replace("$service", SERVICE)
                .replace("$domain", domainName);
        }
    } catch (error) {
        return `${ERROR}\n${ERROR_REASON
            .replace("$code", error.response.status)
            .replace("$reason", error.response.data.message)
        }`;
    }
}

module.exports = checkDomainAvailability;