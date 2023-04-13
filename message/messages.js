const MESSAGES = {
    // General messages
    PLEASE_WAIT: 'Request received, please wait...',
    ERROR: 'Error has occurred, repeat the request',
    ERROR_REASON: 'Code: $code. Error reason: $reason',
    WELCOME_MESSAGE: "Hi, $name! You started me at $time! I'm your bot assistant and ready to work!",
    HELP_MESSAGE: 'Use following commands:\n' +
        '/check_port {domain} {port} - checking availability of domain port\n' +
        '/check_domain {domain} - checking availability of domain name\n' +
        '/check_vpn {domain} - checking availability of domain in different countries\n' +
        '/tracert {domain} - show trace route of domain.',
    INPUT_DOMAIN_NAME: 'Input domain name',
    INPUT_DOMAIN_AND_PORT: 'Input domain name and port',
    COMMAND_ABORTED: "Command was aborted",

    // Ports
    PORT_UNAVAILABLE_TIMEOUT: 'The port $port on the host $host is unavailable due to exceeding the timeout of 5 seconds.',
    PORT_UNAVAILABLE: 'The port $port on the host $host is unavailable due to $reason',
    PORT_AVAILABLE: 'The port $port on the host $host is available',

    //Domains
    DOMAIN_AVAILABLE: 'According to the service $service:\n' +
        'the domain name $domain is available for purchase\nat a price of $price',

    DOMAIN_UNAVAILABLE: 'According to the service $service:\n' +
        'the domain name $domain is unavailable for purchase',

    //Tracert
    DESTINATION_TRACERT: 'destination: $destination',
    END_TRACERT: "Closed with code: $code",
    SUCCESSFUL_TRACERT: 'Tracert executed successful',
    ERROR_TRACERT: 'Tracert error: $error',
    EXECUTING_TRACERT: 'Executing traceroute to $target...',



    //VPN
    AVAILABLE_DOMAIN_VPN: 'Site $url is available in $location. Response with code $code',
    UNAVAILABLE_DOMAIN_VPN: 'Site $url is not available in $location. Reason: $reason',
    SERVICE_VPN_NOT_AVAILABLE: 'Service "check-host.net" doesn\'t response from server: $country',
    LIMIT_REQUEST_VPN: 'Limit on requests is reached',
    FAILED_CHECK_VPN: 'Failed to check site availability: $message',




}

module.exports = MESSAGES;