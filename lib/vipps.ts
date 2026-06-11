export interface VippsConfig {
  clientId: string;
  clientSecret: string;
  subscriptionKey: string;
  merchantSerialNumber: string;
  environment: "test" | "production";
}

export interface VippsPaymentRequest {
  orderId: string;
  amountNok: number;
  description: string;
  callbackUrl: string;
  fallbackUrl: string;
}

export interface VippsPaymentResponse {
  orderId: string;
  redirectUrl: string;
}

function getVippsConfig(): VippsConfig {
  const config: VippsConfig = {
    clientId: process.env.VIPPS_CLIENT_ID ?? "",
    clientSecret: process.env.VIPPS_CLIENT_SECRET ?? "",
    subscriptionKey: process.env.VIPPS_SUBSCRIPTION_KEY ?? "",
    merchantSerialNumber: process.env.VIPPS_MERCHANT_SERIAL_NUMBER ?? "",
    environment:
      process.env.VIPPS_ENVIRONMENT === "production" ||
      process.env.VIPPS_ENVIRONMENT === "live"
        ? "production"
        : "test",
  };

  if (!config.clientId || !config.clientSecret || !config.subscriptionKey) {
    throw new Error("Missing Vipps configuration environment variables");
  }

  return config;
}

function getBaseUrl(config: VippsConfig): string {
  return config.environment === "production"
    ? "https://api.vipps.no"
    : "https://apitest.vipps.no";
}

async function getAccessToken(config: VippsConfig): Promise<string> {
  const baseUrl = getBaseUrl(config);
  const response = await fetch(`${baseUrl}/accesstoken/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      "Ocp-Apim-Subscription-Key": config.subscriptionKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get Vipps access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token as string;
}

export async function initiateVippsPayment(
  request: VippsPaymentRequest
): Promise<VippsPaymentResponse> {
  const config = getVippsConfig();
  const token = await getAccessToken(config);
  const baseUrl = getBaseUrl(config);

  const body = {
    merchantInfo: {
      merchantSerialNumber: config.merchantSerialNumber,
      callbackPrefix: request.callbackUrl,
      fallBack: request.fallbackUrl,
    },
    customerInfo: {},
    transaction: {
      orderId: request.orderId,
      amount: request.amountNok * 100,
      transactionText: request.description,
      skipLandingPage: false,
    },
  };

  const response = await fetch(`${baseUrl}/ecomm/v2/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Ocp-Apim-Subscription-Key": config.subscriptionKey,
      "Merchant-Serial-Number": config.merchantSerialNumber,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to initiate Vipps payment: ${error}`);
  }

  const data = await response.json();
  return {
    orderId: request.orderId,
    redirectUrl: data.url,
  };
}

export async function captureVippsPayment(orderId: string): Promise<void> {
  const config = getVippsConfig();
  const token = await getAccessToken(config);
  const baseUrl = getBaseUrl(config);

  const response = await fetch(
    `${baseUrl}/ecomm/v2/payments/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Ocp-Apim-Subscription-Key": config.subscriptionKey,
        "Merchant-Serial-Number": config.merchantSerialNumber,
      },
      body: JSON.stringify({
        merchantInfo: { merchantSerialNumber: config.merchantSerialNumber },
        transaction: { transactionText: "Depositum Languedoc" },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to capture Vipps payment: ${error}`);
  }
}

export async function getVippsPaymentStatus(
  orderId: string
): Promise<string | null> {
  try {
    const config = getVippsConfig();
    const token = await getAccessToken(config);
    const baseUrl = getBaseUrl(config);

    const response = await fetch(
      `${baseUrl}/ecomm/v2/payments/${orderId}/details`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Ocp-Apim-Subscription-Key": config.subscriptionKey,
          "Merchant-Serial-Number": config.merchantSerialNumber,
        },
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    return data?.transactionLogHistory?.[0]?.operation ?? null;
  } catch {
    return null;
  }
}
