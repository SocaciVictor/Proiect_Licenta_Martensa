export const decodeJwt = (token: string) => {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const decodedPayload = atob(padded);
    return JSON.parse(decodedPayload);
  } catch (e) {
    return null;
  }
};
