const DEFAULT_BREVO_NEWSLETTER_FORM_URL =
  "https://0761e298.sibforms.com/serve/MUIFANDCHZ2pbJWj068MVlky3ECAas2A1Gw_r4py-BM7Ac-STHjkXyazM3-CxHMhZ8bcj1pUOJ5TKkuw457LSf9DFHimWNrF8FDhm5Xv9QcuMeDB6m4UZlMh5YfLwIKXx_36GQKG1GisnmJgN6G9kRBc3vnLoF0kBpZskAW3crdBDyCaFbuoVKcLj0LxsKy1qhHQO0z2hRLgW_zmcg==";

function getBrevoFormUrl(): string {
  return (
    process.env.BREVO_NEWSLETTER_FORM_URL?.trim() ||
    DEFAULT_BREVO_NEWSLETTER_FORM_URL
  );
}

export async function subscribeToBrevoNewsletter(params: {
  email: string;
  locale: string;
}): Promise<boolean> {
  const body = new URLSearchParams({
    EMAIL: params.email,
    OPT_IN: "1",
    email_address_check: "",
    locale: params.locale,
  });

  const response = await fetch(getBrevoFormUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "text/html,application/xhtml+xml",
    },
    body: body.toString(),
    redirect: "manual",
  });

  return response.status >= 200 && response.status < 400;
}
