import { config } from "dotenv";
import TiltifyAPI from "./utils/classes/TiltifyAPI";
import express from "express";
import MinecraftCommandParser from "./utils/classes/MinecraftCommandParser";
import CommandMap from "./utils/classes/CommandMap";
config({});

const app = express();
app.use(express.json());
const port = 3000;
const minecraft = new MinecraftCommandParser();
const commandMap = new CommandMap();
const tiltify = new TiltifyAPI();

async function main() {
  await tiltify.generateAccessToken();
  await minecraft.connectClient().then(() => {
    minecraft.sendCommand("say Tiltify integration is now running!");
    minecraft.disconnectClient();
  });
}

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

  const donationMessageCommand = `say Thanks ${donorName} for donating ${donationAmount}! ${
    data.message ? data.message : ""
  }`;
  await minecraft.connectClient().then(() => {
    minecraft.sendCommand(donationMessageCommand);
    const command = commandMap.getCommandByValue(donationAmount);
    minecraft.sendCommand(command);
    minecraft.disconnectClient();
  });

  res.status(200).end(); // Respond with a success status
});

app.listen(port, async () => {
  console.log(`Application listening at http://localhost:${port}`);
  try {
    main();
  } catch (e) {
    throw e;
  }
});
