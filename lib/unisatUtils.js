
export const unisatUtils = {
    async getAccounts() {
        try {
            const accounts = await window.unisat.getAccounts();
            if (accounts && accounts.length > 0) {
                return accounts[0];
            }
        } catch (e) {
           console.log(e)
        }
        return '';
    },
    async requestAccounts() {
        try {
            const accounts = await window.unisat.requestAccounts();
            if (accounts && accounts.length > 0) {
                return accounts[0];
            }
        } catch (e) {
            console.log(e)
        }
        return '';
    },
    signMessage(message, type) {
        return window.unisat.signMessage(message, type);
    },
    signPsbt(psbt) {
        return window.unisat.signPsbt(psbt, {autoFinalized: false});
    },
    getNetwork() {
        return window.unisat.getNetwork();
    },
    switchNetwork(network) {
        return window.unisat.switchNetwork(network);
    },

    async checkNetwork(network) {
        if (network !== await this.getNetwork()) {
            await this.switchNetwork(network);
        }
    },
    inscribeTransfer(tick, amount) {
        return window.unisat.inscribeTransfer(tick, amount)
    },
    getPublicKey() {
        return window.unisat.getPublicKey();
    },
    sendBitcoin(toAddress, amount, options) {
        return window.unisat.sendBitcoin(toAddress, amount, options);
    },

}