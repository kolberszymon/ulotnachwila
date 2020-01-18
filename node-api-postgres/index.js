const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const db = require("./queries");

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static(__dirname + "/public"));

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

app.get("/", db.homePage);
app.get("/plays", db.getPlays);
app.get("/admin", db.getAdmin);
app.post("/", db.buyTicket);
app.post("/buyTicket", db.ticketSuccess);
app.post("/play-added", db.addPlay);
app.post("/play-updated", db.updatePlay);
app.post("/play-deleted", db.deletePlay);
