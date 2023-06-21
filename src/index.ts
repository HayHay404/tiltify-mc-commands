import { config } from "dotenv";
import TiltifyAPI from "./utils/classes/TiltifyAPI";
import express from "express";
import CommandMap from "./utils/classes/CommandMap";
import expressWs from "express-ws";
import { exit } from "process";
config({});

const app = express();
app.use(express.json());
const wsInstance = expressWs(app);
const port = process.env.PORT || 3000;
const commandMap = new CommandMap();
const tiltify = new TiltifyAPI();

const wsConnection = new Map();

wsInstance.app.ws("/tiltify/ws", (ws, req) => {
  ws.send("broadcast Connected to Websocket Server");
  wsConnection.set(ws, req);
});

app.post("/tiltify/webhook", async (req, res) => {
  const event = req.body;

  if (
    event === undefined ||
    event.meta.event_type.split(":")[
      event.meta.event_type.split(":").length - 1
    ] !== "donation_updated"
  ) {
    console.log("Received a non-donation event, ignoring");
    res.status(200).end();
    return;
  }

  const data = event.data;

  // Process the event and extract relevant information
  const donationAmount = data.amount.value;
  const donorName = data.donor_name;

  // Broadcast requires essentialsX, alternatively use "say"
  const donationMessageCommand = `/broadcast Thanks ${donorName} for donating ${donationAmount}! ${
    data.message ? data.message : ""
  }`;

  console.log(donationMessageCommand);
  wsConnection.forEach((_, ws) => {
    console.log("Sending " + donationMessageCommand + " to client");
    ws.send(donationMessageCommand);
  });
  const commands = commandMap.getCommandByValue(donationAmount);
  if (commands) {
    commands.forEach(async (command) => {
      wsConnection.forEach((_, ws) => {
        console.log("Sending " + command + " to client");
        ws.send(command);
      });
    });
  }

  res.status(200).end(); // Respond with a success status
});

app.listen(port, async () => {
  console.log(`Application listening at http://localhost:${port}`);
  try {
    await tiltify.generateAccessToken();
  } catch (e) {
    console.log(e);
    exit(1);
  }
});
