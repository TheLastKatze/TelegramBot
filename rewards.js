const fetch = require("node-fetch");

async function getRewardHistory(player = "") {
  var rH;
  rH = await fetch(
    "https://api.steemmonsters.io/players/history?username=" +
    player +
    "&from_block=-1&limit=30&types=claim_reward"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response;
    })
    .then((rewardHistory) => {
      return rewardHistory.json();
    });

  return rH;
}

async function rewardRunner(user) {
  var finalReturn = '';
  var results = await getRewardHistory(user);
  console.log("Showing last 2 quests rewards and last season reward: ");
  var quest_count = 0;

  for (let index = 0; index < results.length; index++) {
    var element = results[index];

    if (!element.error) {
      var typeJson = JSON.parse(element.data);
      var type = typeJson.type;
      let date = new Date(element.created_date).toLocaleString();
      var resultJson = JSON.parse(element.result);
      var rewardsJson = resultJson.rewards;

      switch (type) {
        case "quest":
          if (quest_count < 1) {
            finalReturn = calculate_rewards(rewardsJson, "Quest", date, user);
          }
          quest_count++;

          break;
      }
    }
  }
  return finalReturn;
}

function calculate_rewards(rewardsJson, type, date, user) {

  var data = {
    dec_amount: 0,
    potion_alc_amount: 0,
    potion_leg_amount: 0,
    card_amount: 0,
    credits: 0
  }

  for (let index = 0; index < rewardsJson.length; index++) {
    const element = rewardsJson[index];
    let reward_type = element.type;

    switch (reward_type) {
      case "dec":
        data.dec_amount = data.dec_amount + element.quantity;
        break;
      case "reward_card":
        data.card_amount = data.card_amount + 1;
        break;
      case "potion":
        let potion_type = element.potion_type;
        if (potion_type === "legendary") {
          data.potion_leg_amount = data.potion_leg_amount + 1;
        } else {
          data.potion_alc_amount = data.potion_alc_amount + 1;
        }
        break;
      case "credits":
        data.credits = data.credits + element.quantity
        break;
    }
  }

  var reward = 'Last reward from ' + date.split(',')[0] + '\n';

  if (data.dec_amount != 0) { reward += 'Dec: ' + data.dec_amount }
  if (data.card_amount != 0) { reward += 'Cards: ' + data.card_amount }
  if (data.potion_leg_amount != 0) { reward += 'Legendary Potions: ' + data.potion_leg_amount }
  if (data.potion_alc_amount != 0) { reward += 'Alchemy Potions: ' + data.potion_alc_amount }
  if (data.credits != 0) { reward += 'Credits: ' + data.credits }

  console.log("-----------------");
  console.log(type + " Rewards - " + date + " - user: " + user);
  console.log(data);
  return reward;
}

module.exports.rewardRunner = rewardRunner;