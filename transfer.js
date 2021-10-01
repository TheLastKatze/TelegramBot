const { Hive } = require('@splinterlands/hive-interface');
const fetch = require('node-fetch');
const hive = new Hive();
const { bots, globalQuery } = require('./dbhelper');


async function transfer() {
    let transfered = "alpaca-gold-0000"


    const use_active_key = true
    const transaction_type = 'sm_token_transfer'
    const token = "DEC"

    try {

        var bot_list = await globalQuery(bots());
        bot_list = await Object.values(JSON.parse(JSON.stringify(bot_list)));

        for (let index = 0; index < bot_list.length; index++) {
            const element = bot_list[index];

            let transferer_key = element.active_key
            let transferer = element.name
            const decReq = await fetch('https://api2.splinterlands.com/players/balances?username=' + transferer);
            const decData = await decReq.json();
            let balance = 0;

            for (let index = 0; index < decData.length; index++) {
                const element = decData[index];
                const token = element.token;

                if (token == "DEC") {
                    balance = parseFloat(element.balance)
                }
            }
            let to_transfer = balance
            to_transfer = parseFloat(to_transfer.toFixed(2));

            if (to_transfer == 0) {
                console.log("Empty, skipping.")
                
            }else{
                if(to_transfer > balance){
                    to_transfer = to_transfer - 0.01
                }
    
                let transaction = await hive.customJson(transaction_type,
                    {
                        "to": transfered,
                        "qty": to_transfer.toString(),
                        "token": token,
                        "type": "token_transfer",
                        "memo": transfered
                    },
                    transferer, transferer_key, use_active_key);
    
                await console.log("transfered to " + transfered + " the amount of " + to_transfer + " " + token);
                await console.log(transaction)
            }


            
        }



    } catch (error) {
        console.log(error)
    }
}

module.exports.transfer = transfer;