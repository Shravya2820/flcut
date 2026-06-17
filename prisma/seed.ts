import { PrismaClient, FLCPosition, SystemRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: "demo.flcut@gmail.com",
      name: "Demo Admin",
      flcPosition: FLCPosition.TECH_TEAM,
      systemRole: SystemRole.ADMIN,
      isAuthorized: true,
    },
    {
      email: "nnm24is228@nmamit.in",
      name: "Shravya N Bhat",
      flcPosition: FLCPosition.TECH_TEAM,
      systemRole: SystemRole.ADMIN,
      isAuthorized: true,
    },
    {
      email: "shravyanbhat.01@gmail.com",
      name: "Demo Manager",
      flcPosition: FLCPosition.OPERATIONS_MANAGER,
      systemRole: SystemRole.MANAGER,
      isAuthorized: true,
    },
    {
      email: "shravyanbhat2020@gmail.com",
      name: "Demo Creator",
      flcPosition: FLCPosition.EVENT_TEAM,
      systemRole: SystemRole.CREATOR,
      isAuthorized: true,
    },

    /*
    Production FLC Accounts (replace demo account with real FLC users)

    {
      email: "operations@nmamit.in",
      name: "Operations Manager",
      flcPosition: FLCPosition.OPERATIONS_MANAGER,
      systemRole: SystemRole.MANAGER,
      isAuthorized: true,
    },

    {
      email: "eventteam@nmamit.in",
      name: "Event Team Member",
      flcPosition: FLCPosition.EVENT_TEAM,
      systemRole: SystemRole.CREATOR,
      isAuthorized: true,
    },

    {
      email: "president@nmamit.in",
      name: "President",
      flcPosition: FLCPosition.PRESIDENT,
      systemRole: SystemRole.ADMIN,
      isAuthorized: true,
    },

    {
      email: "faculty@nitte.edu.in",
      name: "Faculty Coordinator",
      flcPosition: FLCPosition.FACULTY_COORDINATOR,
      systemRole: SystemRole.ADMIN,
      isAuthorized: true,
    },
    */
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
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });