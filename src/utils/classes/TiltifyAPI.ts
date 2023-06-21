export default class TiltifyAPI {
  tiltifyClientId: string;
  tiltifyClientSecret: string;
  tiltifyCampaignSlug: string;
  tiltifyUserSlug: string;
  accessToken: string | null;

  constructor() {
    if (
      !process.env.TILTIFY_CLIENT_ID ||
      !process.env.TILTIFY_CLIENT_SECRET ||
      !process.env.TILTIFY_CAMPAIGN_SLUG ||
      !process.env.TILTIFY_USER_SLUG
    ) {
      throw new Error(
        "ERROR: Missing Tiltify credentials. Please check your .env file."
      );
    }
    this.tiltifyClientId = process.env.TILTIFY_CLIENT_ID;
    this.tiltifyClientSecret = process.env.TILTIFY_CLIENT_SECRET;
    this.tiltifyCampaignSlug = process.env.TILTIFY_CAMPAIGN_SLUG;
    this.tiltifyUserSlug = process.env.TILTIFY_USER_SLUG;
    this.accessToken = null;

    setInterval(() => {
      this.generateAccessToken();
    }, 7190000);
  }

  async generateAccessToken() {
    const url = "https://v5api.tiltify.com/oauth/token";
    const params = {
      client_id: this.tiltifyClientId,
      client_secret: this.tiltifyClientSecret,
      grant_type: "client_credentials",
      scope: "public webhooks:write",
    };
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (resp.status == 200) {
      const jsonOutput = await resp.json();
      this.accessToken = "Bearer " + jsonOutput.access_token;
      return jsonOutput.access_token;
    } else {
      throw new Error(
        "ERROR: Could not authenticate with Tiltify. Double check your credentials."
      );
    }
  }

  async getCampaignId() {
    const url = `https://v5api.tiltify.com/api/public/campaigns/by/slugs/${this.tiltifyUserSlug}/${this.tiltifyCampaignSlug}`;
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.accessToken as string,
      },
    });

    if (resp.status == 200) {
      const jsonOutput = await resp.json();
      return jsonOutput.data.id;
    } else {
      throw new Error(
        "ERROR: Campaign data could not be obtained from Tiltify. Something might be wrong with the API."
      );
    }
  }
}
