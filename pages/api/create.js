import { prisma } from "../../lib/prisma";
import { verify } from "jsonwebtoken";

import cookie from "cookie";

export default async function handle(req, res) {
  const body = await JSON.parse(req.body);
  if (!req.headers.cookie) {
    res.redirect("/login");
  }

  if (body.code && body.title) {
    if (req.headers.cookie) {
      const getToken = cookie.parse(req.headers.cookie);
      const token = getToken.refreshToken;

      if (!token) return res.status(401);
      let payload = null;
      try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
        const checkIfExist = await prisma.roll.findUnique({
          where: {
            code: `${body.code}`,
          },
        });
        if (!checkIfExist) {
          const roll = await prisma.roll.create({
            data: {
              code: `${body.code}`,
              title: `${body.title}`,
              user: {
                connect: { id: payload.userId },
              },
            },
          });
          if (roll) {
            res.send({ roll });
          }
        }
      } catch (e) {
        console.log(e);
        res.status(401);
        res.redirect("/login");
      }
    }
  }
  res.status(400).send();
}
