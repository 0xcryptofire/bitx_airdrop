
export function isOrderProcessing(data) {
    if (!data)
        return false;
    const {status} = data;
    return status !== 'minted' && status !== 'closed' && status !== 'refunded' && status !== 'cancel';
}