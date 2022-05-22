import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

export default async function handle(req, res) {
  const salt = await bcrypt.genSalt(10);

  const body = await JSON.parse(req.body);
  if (body.name && body.code) {
    const checkIfExist = await prisma.roll.findUnique({
      where: {
        code: body.code,
      },
    });
    if (checkIfExist) return res.status(409).send();
    const code = await bcrypt.hash(body.code, salt);
    const roll = await prisma.roll.create({
      data: {
        name: `${body.name}`,
        code: `${code}`,
      },
    });
    if (roll) {
      res.send({ roll });
    }
    res.status(406).send();

    res.status(400).send();
  }
  res.status(400).send();
}
