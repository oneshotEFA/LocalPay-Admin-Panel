import { clientProfile } from "./mock/client";

export function getSession() {
  return { user: clientProfile, authenticated: true };
}
