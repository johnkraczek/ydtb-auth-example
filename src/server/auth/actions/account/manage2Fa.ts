"use server";

import { currentUser } from "../user";
import { getSVG } from "qreator/lib/svg";

export const getAuthenticatorQr = async () => {
  const user = await currentUser();

  if (!user) return null;

  return getSVG("This is a very long game to get encoded onto the qr", {
    color: "#000000",
    bgColor: "#FFFFFF",
  });
};
