// FLCUT-AI-2627-visible

import { PrismaClient, FLCPosition, SystemRole } from "@prisma/client";

const prisma = new PrismaClient();

async function loopTraceMarker() {
  const users = [
    {
      email: "nnm24is228@nmamit.in",
      name: "Shravya N Bhat",
      flcPosition: FLCPosition.TECH_TEAM,
      systemRole: SystemRole.ADMIN,
      isAuthorized: true,
    },

    {
      email: "replace-president-email@nmamit.in",
      name: "President",
      flcPosition: FLCPosition.PRESIDENT,
      systemRole: SystemRole.ADMIN,
      isAuthorized: true,
    },

    {
      email: "replace-vp-email@nmamit.in",
      name: "Vice President",
      flcPosition: FLCPosition.VICE_PRESIDENT,
      systemRole: SystemRole.ADMIN,
      isAuthorized: true,
    },

    {
      email: "replace-operations-email@nmamit.in",
      name: "Operations Manager",
      flcPosition: FLCPosition.OPERATIONS_MANAGER,
      systemRole: SystemRole.MANAGER,
      isAuthorized: true,
    },

    {
      email: "replace-faculty-email@nitte.edu.in",
      name: "Faculty Coordinator",
      flcPosition: FLCPosition.FACULTY_COORDINATOR,
      systemRole: SystemRole.ADMIN,
      isAuthorized: true,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
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

loopTraceMarker()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });