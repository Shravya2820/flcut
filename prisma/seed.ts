import { PrismaClient, FLCPosition, SystemRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: "nnm24is228@nmamit.in",
      name: "Shravya N Bhat",
      flcPosition: FLCPosition.TECH_TEAM,
      systemRole: SystemRole.ADMIN,
      isAuthorized: true,
    },
    {
      email: "shravyanbhat.01@gmail.com",
      name: "Riya",
      flcPosition: FLCPosition.OPERATIONS_MANAGER,
      systemRole: SystemRole.MANAGER,
      isAuthorized: true,
    },
    {
      email: "shravyanbhat2020@gmail.com",
      name: "Karthik",
      flcPosition: FLCPosition.EVENT_TEAM,
      systemRole: SystemRole.CREATOR,
      isAuthorized: true,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        flcPosition: user.flcPosition,
        systemRole: user.systemRole,
        isAuthorized: user.isAuthorized,
      },
      create: user,
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });