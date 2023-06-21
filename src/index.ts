import { config } from "dotenv";
import TiltifyAPI from "./TiltifyAPI";
import express from "express";
config({});

const app = express();
app.use(express.json());
const port = 3000;

async function main() {
  const tiltify = new TiltifyAPI();
  await tiltify.generateAccessToken();

  app.post("/tiltify/webhook", (req, res) => {
    const event = req.body;

    if (event === undefined || event.meta.event_type !== "public:direct:donation_updated") {
      console.log("Received a non-donation event, ignoring");
      res.status(200).end();
      return;
    }

    const data = event.data;

    // Process the event and extract relevant information
    const donationAmount = data.amount.value;
    const donorName = data.donor_name;

    console.log(`Received a donation of ${donationAmount} from ${donorName}`);

    res.status(200).end(); // Respond with a success status
  });
}

app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`);
  try {
    main();
  } catch (e) {
    console.error(e);
    throw e;
  }
});
