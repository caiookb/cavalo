const express = require("express");
const app = express();

const Twit = require("twit");

const T = new Twit({
  consumer_key: "Yl6pmCnpFIOgF3o8ZuiZe6rxV",
  consumer_secret: "Lq15H4PJzbExejWvDUhGNOLb6YBibuGcVJ4gwYkJ3uK6tQJwgZ",
  access_token: "1284591675055235072-HU2ZykueFHwcfTJIemTNVcLj45FTSG",
  access_token_secret: "y9ifuHQ9fOhvKcNvEXoUKv7b2dj1lQzm4DMWOIMwK4dyk",
});

const stream = T.stream("statuses/filter", {
  track: "cavalo" || "CAVALO" || "Cavalo",
});

let tweetToSend = [];
let sentTweets = [];

stream.on("tweet", function (tweet) {
  if (
    tweet.user.screen_name !== "soDigitocavaloo" &&
    tweet.id_str &&
    tweet.user.screen_name
  ) {
    tweetToSend.push({ id_str: tweet.id_str, user: tweet.user.screen_name });
  }
});

setInterval(() => {
  //Call replyCavalo() to reply tweets
  console.log("To send: ", tweetToSend);
  console.log("Sent: ", sentTweets);
  if (tweetToSend[0]) replyCavalo(tweetToSend[0].id_str, tweetToSend[0].user);
}, 15000);

const clearSentsTweetsFromArray = (id_str, user) => {
  //Clear sent tweet from array
  tweetToSend = tweetToSend.filter((sent) => {
    return id_str !== sent.id_str;
  });

  sentTweets.push({ id_str, user });
};

const replyCavalo = (id, name) => {
  if (id) {
    T.post(
      "statuses/update",
      { in_reply_to_status_id: id, status: "@" + name + " cavalo" },
      (err, data, response) => {
        clearSentsTweetsFromArray(id, name);
        console.log("Deu reply para", name);
      }
    );
  }
};

app.listen(process.env.PORT || 5000, () => {
  console.log("conectado");
});

module.exports = app;
