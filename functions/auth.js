import { sign } from "jsonwebtoken";
import cookie from "cookie";

export const refreshToken = async () => {
  const res = await fetch("/api/refresh_token", {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};

export const createAccessToken = (user) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3h",
  });
};

export const createRefreshToken = (user) => {
  return sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "15d",
  });
};

export const sendRefreshToken = (res, token) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
  );
};
