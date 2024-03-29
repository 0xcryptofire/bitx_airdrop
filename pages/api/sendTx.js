import axios from "axios";
const bitcoin = require('bitcoinjs-lib');

export default async function sendTx(req, res) {
    try {
        if (req.method === 'POST') {
            const { tx, toSign, signatures, pubkeys, env } = req.body;
            console.log('tx, toSign, signatures, pubkeys, env')
            console.log(tx, toSign, signatures, pubkeys, env)
            if (!tx || !toSign || !signatures || !pubkeys || !env) {
                return {
                    code: 0,
                    message: "invalid/insufficient parameters"
                }
            }
            let url;
            if (env == 'testnet') {
                url = 'https://api.blockcypher.com/v1/btc/test3/txs/send?token=9fc4920805cd45e1a0fef7587f9bb05c';
            }
            else if (env == 'mainnet') {
                url = 'https://api.blockcypher.com/v1/btc/main/txs/send?token=9fc4920805cd45e1a0fef7587f9bb05c';
            }
            else {
                return {
                    code: 0,
                    message: 'Invalid env'
                }
            }
            const sendTx = {
                tx,
                signatures,
                pubkeys,
                tosign: toSign
            }
            // console.log("Data 123",JSON.stringify(sendTx));
            const response = await axios.post(url, JSON.stringify(sendTx))
            // console.log(response, "Response...");
            if (response.status != 201) {
                return {
                    code: 0,
                    message: response?.data
                }
            }
            // console.log(response.data);
            return {
                code: 1,
                result: response.data
            }
           
            
        } else {
            res.status(405).end()
        }


    }
    catch (error) {
        console.log('error sending btc txs', error);
        res.status(405).json({error})
        return {
            code: 0,
            error,
        };
    }
}
