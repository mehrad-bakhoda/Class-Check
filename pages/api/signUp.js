import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../../functions/auth";

import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

export default async function handle(req, res) {
  const salt = await bcrypt.genSalt(10);

  const body = await JSON.parse(req.body);
  if (body.email && body.password && body.passwordConfirmation) {
    if (body.passwordConfirmation === body.password) {
      const checkIfExist = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });
      if (checkIfExist) return res.status(409).send();
      const password = await bcrypt.hash(body.password, salt);
      const user = await prisma.user.create({
        data: {
          email: `${body.email}`,
          password: `${password}`,
        },
      });
      if (user) {
        const token = createRefreshToken(user);
        sendRefreshToken(res, token);

        const accessToken = createAccessToken(user);
        res.send({ user, accessToken });
      }
      res.status(406).send();
    }
    res.status(400).send();
  }
  res.status(400).send();
}
