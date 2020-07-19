const express = require("express");
const app = express();
const Twit = require("twit");

const T = new Twit({
  consumer_key: "Yl6pmCnpFIOgF3o8ZuiZe6rxV",
  consumer_secret: "Lq15H4PJzbExejWvDUhGNOLb6YBibuGcVJ4gwYkJ3uK6tQJwgZ",
  access_token: "1284591675055235072-HU2ZykueFHwcfTJIemTNVcLj45FTSG",
  access_token_secret: "y9ifuHQ9fOhvKcNvEXoUKv7b2dj1lQzm4DMWOIMwK4dyk",
  strictSSL: true,
});

const stream = T.stream("statuses/filter", {
  track: "cavalo" || "CAVALO" || "Cavalo",
});

const randon = () => Math.floor(Math.random() * (20000 - 10000 + 1000)) + 10000;
let randomMilliseconds = randon();

let tweetToSend = [];
let sentTweets = [];

stream.on("tweet", function (tweet) {
  if (
    tweet.user.screen_name !== "soDigitocavaloo" &&
    tweet.id_str &&
    tweet.user.screen_name &&
    !tweet.text.includes("RT @")
  ) {
    tweetToSend.push({ id_str: tweet.id_str, user: tweet.user.screen_name });
  }
});

const search = () => {
  console.log("To send: ", tweetToSend);
  console.log("Sent: ", sentTweets);
  tweetToSend[0]
    ? replyCavalo(tweetToSend[0].id_str, tweetToSend[0].user)
    : startTimeout(search, 15000);
};

const clearSentsTweetsFromArray = (id_str, user) => {
  tweetToSend = tweetToSend.filter((sent) => {
    return id_str !== sent.id_str;
  });

  // sentTweets.push({ id_str, user });
};

const replyCavalo = (id, name) => {
  if (id) {
    T.post(
      "statuses/update",
      { in_reply_to_status_id: id, status: "@" + name + " cavalo" },
      (err, data, response) => {
        if (response && response.statusCode === 200) {
          console.log("Reply enviado para", name);
          clearSentsTweetsFromArray(id, name);
          randomMilliseconds = randon();
          startTimeout(search, randomMilliseconds);
        } else {
          console.log("Falha no reply para", name);
          tweetToSend = [];
          startTimeout(search, 400000);
        }
      }
    );
  }
};

const startTimeout = (func, time) => (interval = setTimeout(func, time));
// const stopInterval = () => clearInterval(interval);
console.log("Comecou com ", randomMilliseconds);
startTimeout(search, randomMilliseconds);

app.listen(process.env.PORT || 5000, () => {
  console.log("conectado");
});

module.exports = app;
