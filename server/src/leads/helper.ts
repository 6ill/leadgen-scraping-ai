export function getDomain(websiteUrl: string) {
    try {
        const parsedUrl = new URL(websiteUrl);

        const hostParts = parsedUrl.hostname.split('.');

        const countryCodeTLDs = ['co', 'com', 'gov', 'net', 'org', 'edu'];
        const isCountryCodeTLD =
        hostParts.length > 2 &&
        countryCodeTLDs.includes(hostParts[hostParts.length - 2]);

        const domainParts = isCountryCodeTLD
        ? hostParts.slice(-3)
        : hostParts.slice(-2);

        return domainParts.join('.');
    } catch (error) {
        return '';
    }
}
