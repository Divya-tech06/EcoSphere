import { PrismaClient, Role, GoalStatus, CarbonSourceType, ApprovalStatus, ChallengeDifficulty, ChallengeStatus, ComplianceSeverity, ComplianceStatus, User } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // 1. ESG Configuration
  await prisma.eSGConfiguration.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      environmentalWeight: 40.0,
      socialWeight: 30.0,
      governanceWeight: 30.0,
      autoEmissionCalculation: true,
      requireEvidenceForCSR: true,
      autoAwardBadges: true,
      emailAlertsForComplianceIssues: true,
    },
  });

  // 2. Departments (5+, including one parent/child pair)
  const corporate = await prisma.department.upsert({
    where: { code: "CORP" },
    update: {},
    create: {
      name: "Corporate Headquarters",
      code: "CORP",
      head: "Sarah Jenkins",
      employeeCount: 15,
      status: "Active",
    },
  });

  const operations = await prisma.department.upsert({
    where: { code: "OPS" },
    update: {},
    create: {
      name: "Operations & Facilities",
      code: "OPS",
      head: "Marcus Vance",
      employeeCount: 45,
      status: "Active",
    },
  });

  // Child of Operations
  const logistics = await prisma.department.upsert({
    where: { code: "LOG" },
    update: {},
    create: {
      name: "Logistics & Fleet",
      code: "LOG",
      head: "David Miller",
      parentDepartmentId: operations.id,
      employeeCount: 20,
      status: "Active",
    },
  });

  const engineering = await prisma.department.upsert({
    where: { code: "ENG" },
    update: {},
    create: {
      name: "Engineering & R&D",
      code: "ENG",
      head: "Dr. Aris Thorne",
      employeeCount: 30,
      status: "Active",
    },
  });

  const marketing = await prisma.department.upsert({
    where: { code: "MKT" },
    update: {},
    create: {
      name: "Marketing & Sales",
      code: "MKT",
      head: "Elena Rostova",
      employeeCount: 12,
      status: "Active",
    },
  });

  console.log("Departments seeded.");

  // 3. Categories
  const catCsr = await prisma.category.upsert({
    where: { name: "CSR Activities" },
    update: {},
    create: {
      name: "CSR Activities",
      type: "CSR_ACTIVITY",
      status: "Active",
    },
  });

  const catChallenge = await prisma.category.upsert({
    where: { name: "Sustainability Challenges" },
    update: {},
    create: {
      name: "Sustainability Challenges",
      type: "CHALLENGE",
      status: "Active",
    },
  });

  // 4. Users (10+ employees across all roles)
  const passwordHash = "dummy-hash-for-now";

  // Admins
  const admin1 = await prisma.user.upsert({
    where: { email: "admin@ecosphere.local" },
    update: {},
    create: {
      name: "Alice Administrator",
      email: "admin@ecosphere.local",
      password: passwordHash,
      role: Role.ADMIN,
      departmentId: corporate.id,
    },
  });

  // Approvers
  const app1 = await prisma.user.upsert({
    where: { email: "marcus.v@ecosphere.local" },
    update: {},
    create: {
      name: "Marcus Vance",
      email: "marcus.v@ecosphere.local",
      password: passwordHash,
      role: Role.APPROVER,
      departmentId: operations.id,
    },
  });

  const app2 = await prisma.user.upsert({
    where: { email: "sarah.j@ecosphere.local" },
    update: {},
    create: {
      name: "Sarah Jenkins",
      email: "sarah.j@ecosphere.local",
      password: passwordHash,
      role: Role.APPROVER,
      departmentId: corporate.id,
    },
  });

  // Employees (7+)
  const empEmails = [
    { email: "john.d@ecosphere.local", name: "John Doe", dept: operations.id },
    { email: "jane.s@ecosphere.local", name: "Jane Smith", dept: engineering.id },
    { email: "bob.j@ecosphere.local", name: "Bob Johnson", dept: logistics.id },
    { email: "lisa.m@ecosphere.local", name: "Lisa Marshall", dept: marketing.id },
    { email: "tom.w@ecosphere.local", name: "Tom Watson", dept: engineering.id },
    { email: "clara.k@ecosphere.local", name: "Clara Kim", dept: corporate.id },
    { email: "danny.g@ecosphere.local", name: "Danny Green", dept: logistics.id },
  ];

  const employees: User[] = [];
  for (const emp of empEmails) {
    const u = await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        name: emp.name,
        email: emp.email,
        password: passwordHash,
        role: Role.EMPLOYEE,
        departmentId: emp.dept,
        totalXP: 120,
        redeemablePoints: 50,
      },
    });
    employees.push(u);
  }

  console.log("Users seeded.");

  // 5. Emission Factors
  const efElectricity = await prisma.emissionFactor.create({
    data: {
      name: "Grid Electricity (USA average)",
      activityType: "Manufacturing",
      unit: "kWh",
      co2PerUnit: 0.385,
    },
  });

  const efGasoline = await prisma.emissionFactor.create({
    data: {
      name: "Standard Gasoline Fleet Fuel",
      activityType: "Fleet",
      unit: "Gallons",
      co2PerUnit: 8.887,
    },
  });

  const efFlights = await prisma.emissionFactor.create({
    data: {
      name: "Short Haul Business Flight",
      activityType: "Expense",
      unit: "Miles",
      co2PerUnit: 0.24,
    },
  });

  console.log("Emission Factors seeded.");

  // 6. Environmental Goals (3+ across different statuses)
  await prisma.environmentalGoal.createMany({
    data: [
      {
        name: "Reduce Corporate HQ Electricity usage by 20%",
        departmentId: corporate.id,
        targetCO2: 12000.0,
        currentCO2: 4500.0,
        deadline: new Date("2026-12-31"),
        status: GoalStatus.On_Track,
      },
      {
        name: "Transition Fleet Vehicles to Hybrid/EV",
        departmentId: logistics.id,
        targetCO2: 45000.0,
        currentCO2: 42000.0,
        deadline: new Date("2026-06-30"),
        status: GoalStatus.At_Risk,
      },
      {
        name: "Minimize Paper Waste in R&D Lab",
        departmentId: engineering.id,
        targetCO2: 500.0,
        currentCO2: 500.0,
        deadline: new Date("2025-12-31"),
        status: GoalStatus.Completed,
      },
    ],
  });

  console.log("Environmental Goals seeded.");

  // 7. CSR Activities (4+)
  const csrForest = await prisma.cSRActivity.create({
    data: {
      title: "Annual City Forest Reforestation Day",
      categoryId: catCsr.id,
      description: "Planting trees in metropolitan parks to improve green cover.",
      evidenceRequired: true,
      status: "Active",
      date: new Date("2026-04-15"),
    },
  });

  const csrBeach = await prisma.cSRActivity.create({
    data: {
      title: "Beach & Coast Cleanup Drive",
      categoryId: catCsr.id,
      description: "Trash collection along the harbor and public beach sites.",
      evidenceRequired: true,
      status: "Active",
      date: new Date("2026-05-20"),
    },
  });

  const csrFood = await prisma.cSRActivity.create({
    data: {
      title: "Food Bank Redistribution Volunteering",
      categoryId: catCsr.id,
      description: "Helping organize and pack food supplies for underserved families.",
      evidenceRequired: false,
      status: "Active",
      date: new Date("2026-07-04"),
    },
  });

  const csrMentorship = await prisma.cSRActivity.create({
    data: {
      title: "STEM Mentorship for Underprivileged Youth",
      categoryId: catCsr.id,
      description: "Hosting coding sessions and science workshops for school kids.",
      evidenceRequired: false,
      status: "Active",
      date: new Date("2026-08-10"),
    },
  });

  console.log("CSR Activities seeded.");

  // 8. Employee Participations with mixed approval statuses
  await prisma.employeeParticipation.createMany({
    data: [
      {
        employeeId: employees[0].id,
        csrActivityId: csrForest.id,
        proofFileUrl: "/uploads/proofs/tree_planting_john.jpg",
        approvalStatus: ApprovalStatus.Approved,
        pointsEarned: 100,
        completionDate: new Date("2026-04-15"),
      },
      {
        employeeId: employees[1].id,
        csrActivityId: csrBeach.id,
        proofFileUrl: "/uploads/proofs/beach_cleanup_jane.png",
        approvalStatus: ApprovalStatus.Pending,
        pointsEarned: 0,
      },
      {
        employeeId: employees[2].id,
        csrActivityId: csrFood.id,
        proofFileUrl: null,
        approvalStatus: ApprovalStatus.Rejected,
        pointsEarned: 0,
      },
    ],
  });

  console.log("CSR participations seeded.");

  // 9. Challenges (3+ spanning different lifecycle stages)
  const chalZero = await prisma.challenge.create({
    data: {
      title: "Zero Waste Coffee Month",
      categoryId: catChallenge.id,
      description: "Avoid single-use cups entirely for 30 consecutive days.",
      xp: 250,
      difficulty: ChallengeDifficulty.Easy,
      evidenceRequired: true,
      deadline: new Date("2026-07-31"),
      status: ChallengeStatus.Active,
    },
  });

  const chalCar = await prisma.challenge.create({
    data: {
      title: "Car-free Commuting Sprint",
      categoryId: catChallenge.id,
      description: "Bike, walk, or take public transit to work for 2 weeks straight.",
      xp: 500,
      difficulty: ChallengeDifficulty.Medium,
      evidenceRequired: true,
      deadline: new Date("2026-08-15"),
      status: ChallengeStatus.Active,
    },
  });

  const chalEnergy = await prisma.challenge.create({
    data: {
      title: "Server Room Cooling Efficiency Optimizations",
      categoryId: catChallenge.id,
      description: "Improve data center airflow parameters to save server cooling power.",
      xp: 1000,
      difficulty: ChallengeDifficulty.Hard,
      evidenceRequired: true,
      deadline: new Date("2026-03-31"),
      status: ChallengeStatus.Completed,
    },
  });

  const chalDraft = await prisma.challenge.create({
    data: {
      title: "Off-Grid Weekend Challenge",
      categoryId: catChallenge.id,
      description: "Unplug all appliances and spend 48 hours without high carbon-footprint power.",
      xp: 150,
      difficulty: ChallengeDifficulty.Easy,
      evidenceRequired: false,
      deadline: new Date("2026-09-01"),
      status: ChallengeStatus.Draft,
    },
  });

  console.log("Challenges seeded.");

  // 10. Challenge Participations
  await prisma.challengeParticipation.createMany({
    data: [
      {
        challengeId: chalZero.id,
        employeeId: employees[0].id,
        progress: 80.0,
        proofFileUrl: "/uploads/proofs/zero_waste_john.jpg",
        approvalStatus: ApprovalStatus.Pending,
        xpAwarded: 0,
      },
      {
        challengeId: chalEnergy.id,
        employeeId: employees[1].id,
        progress: 100.0,
        proofFileUrl: "/uploads/proofs/server_cooling_jane.pdf",
        approvalStatus: ApprovalStatus.Approved,
        xpAwarded: 1000,
      },
    ],
  });

  console.log("Challenge participations seeded.");

  // 11. Badges (4+ with varying rules)
  await prisma.badge.createMany({
    data: [
      {
        name: "Eco-Novice",
        description: "Awarded automatically upon reaching 100 total XP.",
        unlockRule: { minXP: 100 },
        icon: "sprout",
      },
      {
        name: "Tree Planter Elite",
        description: "Awarded for completing the forestation CSR activity.",
        unlockRule: { completedCsrIds: [csrForest.id] },
        icon: "tree",
      },
      {
        name: "Carbon Buster",
        description: "Complete at least one Hard difficulty sustainability challenge.",
        unlockRule: { hardChallengesCompleted: 1 },
        icon: "zap",
      },
      {
        name: "Policy Scholar",
        description: "Acknowledge all current corporate ESG policy documents.",
        unlockRule: { requireAllPoliciesAcknowledged: true },
        icon: "book-open",
      },
    ],
  });

  console.log("Badges seeded.");

  // 12. Rewards (3+)
  await prisma.reward.createMany({
    data: [
      {
        name: "Eco-Friendly Bamboo Coffee Mug",
        description: "Sturdy thermal reusable travel mug made from organic bamboo fibers.",
        pointsRequired: 150,
        stock: 45,
        status: "Active",
      },
      {
        name: "Solar-Powered Portable Phone Charger",
        description: "Charge your device using renewable energy anywhere you travel.",
        pointsRequired: 400,
        stock: 12,
        status: "Active",
      },
      {
        name: "Corporate Cafeteria Lunch Voucher",
        description: "Get a free plant-based lunch at any campus cafeteria.",
        pointsRequired: 80,
        stock: 100,
        status: "Active",
      },
    ],
  });

  console.log("Rewards seeded.");

  // 13. ESG Policies & Policy Acknowledgements
  const policyCode = await prisma.eSGPolicy.create({
    data: {
      title: "Supplier Code of Sustainability Conduct",
      description: "Mandatory standard for supply chain carbon declarations.",
      category: "Governance",
      version: "V2.1",
      effectiveDate: new Date("2026-01-01"),
      status: "Active",
    },
  });

  const policyTravel = await prisma.eSGPolicy.create({
    data: {
      title: "Business Travel Carbon Offsetting Directive",
      description: "Rules regarding flight choices, economy limits, and offsets.",
      category: "Governance",
      version: "V1.0",
      effectiveDate: new Date("2026-03-15"),
      status: "Active",
    },
  });

  await prisma.policyAcknowledgement.createMany({
    data: [
      {
        policyId: policyCode.id,
        employeeId: employees[0].id,
        acknowledgedAt: new Date("2026-01-10"),
        status: "Acknowledged",
      },
      {
        policyId: policyCode.id,
        employeeId: employees[1].id,
        acknowledgedAt: new Date("2026-02-12"),
        status: "Acknowledged",
      },
    ],
  });

  console.log("Policies seeded.");

  // 14. Audits (2+)
  const audit1 = await prisma.audit.create({
    data: {
      title: "Q1 Facilities Carbon Footprint Review",
      departmentId: operations.id,
      auditor: "GreenCheck Standards LLC",
      date: new Date("2026-03-20"),
      findings: "Minor leaks in heating pipeline, carbon declaration missing from parts vendor.",
      status: "Completed",
    },
  });

  const audit2 = await prisma.audit.create({
    data: {
      title: "Logistics Vehicle Fuel Usage Integrity Audit",
      departmentId: logistics.id,
      auditor: "Internal ESG Audit Team",
      date: new Date("2026-06-10"),
      findings: "Discrepancy in recorded mileage vs total gas card expenses.",
      status: "Completed",
    },
  });

  console.log("Audits seeded.");

  // 15. Compliance Issues (a few, including at least one overdue Open one)
  await prisma.complianceIssue.createMany({
    data: [
      {
        auditId: audit1.id,
        title: "Missing Parts Vendor Sustainability Declarations",
        description: "Obtain certified carbon declaration sheets from Tier-2 parts supplier.",
        severity: ComplianceSeverity.Medium,
        departmentId: operations.id,
        ownerId: app1.id, // Marcus Vance
        dueDate: new Date("2026-08-30"), // Future, not overdue
        status: ComplianceStatus.Open,
      },
      {
        auditId: audit2.id,
        title: "Logistics Fuel Card Discrepancy Correction",
        description: "Resolve mismatch in fuel receipts matching vehicle logs for Truck #4.",
        severity: ComplianceSeverity.High,
        departmentId: logistics.id,
        ownerId: app2.id, // Sarah Jenkins
        dueDate: new Date("2026-06-30"), // Past/Overdue!
        status: ComplianceStatus.Open,
        overdue: true,
      },
      {
        auditId: null,
        title: "Outdated Hazardous Waste Storage Permit",
        description: "Renew hazardous chemical waste storage license with environmental regulator.",
        severity: ComplianceSeverity.High,
        departmentId: operations.id,
        ownerId: app1.id,
        dueDate: new Date("2026-05-15"),
        status: ComplianceStatus.Resolved,
      },
    ],
  });

  console.log("Compliance Issues seeded.");

  // 16. Carbon Transactions
  await prisma.carbonTransaction.createMany({
    data: [
      {
        departmentId: operations.id,
        sourceType: CarbonSourceType.Manufacturing,
        sourceRecordRef: "MFG-2026-001",
        emissionFactorId: efElectricity.id,
        quantity: 25000.0, // 25k kWh
        calculatedCO2: 25000.0 * 0.385,
        date: new Date("2026-07-01"),
        autoGenerated: true,
      },
      {
        departmentId: logistics.id,
        sourceType: CarbonSourceType.Fleet,
        sourceRecordRef: "FLEET-FUEL-JULY",
        emissionFactorId: efGasoline.id,
        quantity: 800.0, // 800 gallons gasoline
        calculatedCO2: 800.0 * 8.887,
        date: new Date("2026-07-05"),
        autoGenerated: true,
      },
    ],
  });

  // 17. Department Scores
  await prisma.departmentScore.createMany({
    data: [
      {
        departmentId: operations.id,
        period: "2026-Q1",
        environmentalScore: 82.5,
        socialScore: 75.0,
        governanceScore: 90.0,
        totalScore: 82.5 * 0.4 + 75.0 * 0.3 + 90.0 * 0.3,
      },
      {
        departmentId: logistics.id,
        period: "2026-Q1",
        environmentalScore: 68.0,
        socialScore: 88.0,
        governanceScore: 70.0,
        totalScore: 68.0 * 0.4 + 88.0 * 0.3 + 70.0 * 0.3,
      },
    ],
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
