import { prisma } from "../../lib/prisma";

export default async function handle(req, res) {
  const { id } = JSON.parse(req.body);
  if (req.method === "POST") {
    const roll = await prisma.roll.update({
      where: {
        id: parseInt(id),
      },
      data: {
        onGoing: false,
      },
    });
    if (roll) {
      res.send({ roll });
    }
    res.status(404).send();
  }
}
