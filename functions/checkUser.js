import cookie from "cookie";
import { verify } from "jsonwebtoken";

export default function checkUser(header) {
  const getToken = cookie.parse(header);
  const token = getToken.refreshToken;

  try {
    return verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    return err;
  }
}
