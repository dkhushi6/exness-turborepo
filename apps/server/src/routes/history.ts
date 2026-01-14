import { Router } from "express";
import { prisma } from "@repo/db";
const router = Router();
router.post("/view", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.json({ message: "no userId" });
  }
  const userWithOrders = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      balance: true,
    },
  });
  return res.json({
    message: "order got successfull",
    balance: userWithOrders,
  });
});
export default router;
