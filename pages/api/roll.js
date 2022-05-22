import { prisma } from "../../lib/prisma";

export default async function handle(req, res) {
  const body = await JSON.parse(req.body);
  if (body.name && body.code) {
    const exist = await prisma.roll.findUnique({
      where: {
        code: `${body.code}`,
      },
    });
    if (exist) {
      if (exist.onGoing == true) {
        if (!exist.present.includes(`${body.name}`)) {
          const roll = await prisma.roll.update({
            where: {
              code: `${body.code}`,
            },
            data: {
              present: {
                push: `${body.name}`,
              },
            },
          });
          if (roll) {
            res.send({ roll });
          }
        } else {
          res.status(403).send();
        }
      } else {
        res.status(402).send();
      }
    } else {
      res.status(401).send();
    }

    res.status(400).send();
  }
  res.status(400).send();
}
