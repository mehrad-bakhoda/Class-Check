import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../../functions/auth";
import bcrypt from "bcrypt";

import { prisma } from "../../lib/prisma";

export default async function handle(req, res) {
  if (req.method === "POST") {
    const { email, password } = JSON.parse(req.body);
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      const userForTheClient = {
        id: user.id,
        email: user.email,
      };

      if (bcrypt.compareSync(password, user.password)) {
        const token = createRefreshToken(user);
        sendRefreshToken(res, token);
        const accessToken = createAccessToken(user);
        res.send({ user: userForTheClient, accessToken });
      } else {
        res.status(404).send();
      }
    }
    res.status(404).send();
  }
}
