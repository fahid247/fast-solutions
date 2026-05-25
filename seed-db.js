const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("dns");

// Force Google and Cloudflare DNS to bypass ISP/local DNS lookup restrictions for SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  console.warn("⚠️ Custom DNS configuration warning:", err.message);
}

require("dotenv").config({ path: ".env" });

// Define schemas locally to run independently as a Node script
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "moderator", "member", "client"], default: "client" },
  status: { type: String, enum: ["pending", "active", "suspended"], default: "pending" },
  avatar: { type: String, default: "" },
  coverPhoto: { type: String, default: "" },
  phone: { type: String, default: "" },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  skills: [{ type: String }],
  performance_score: { type: Number, default: 0 },
  total_earnings: { type: Number, default: 0 },
  projects_completed: { type: Number, default: 0 },
  on_time_delivery: { type: Number, default: 100 },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    deadlineAlerts: { type: Boolean, default: true },
    paymentAlerts: { type: Boolean, default: true },
    monthlyTarget: { type: Number, default: 1100 }
  },
  stars: { type: Number, default: 0 },
  requiresLogout: { type: Boolean, default: false }
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  profileName: { type: String, required: true },
  orderId: { type: String, required: true },
  value: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  orderStatus: { type: String, enum: ["Pending", "WIP", "Revision", "Delivered", "Completed", "Cancelled"], default: "Pending" },
  developer: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
  },
  client: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    email: { type: String },
  },
  firstDraft: { type: String, default: "Pending" },
  deliveryDate: { type: Date },
  deadline: { type: Date, required: true },
  orderStart: { type: Date, default: Date.now },
  incomingDate: { type: Date },
  orderSheet: { type: String, default: "" },
  timeLeft: { type: String },
  priority: { type: String, enum: ["Green", "Yellow", "Red"], default: "Green" },
  remarks: { type: String, default: "" },
  star: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  files: [{ type: String }],
  developerPayout: { type: Number, default: 0 },
  profitMargin: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  }],
  notified72h: { type: Boolean, default: false },
  notified24h: { type: Boolean, default: false },
}, { timestamps: true });

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["income", "expense", "payout", "refund"], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  description: { type: String, required: true },
  category: { type: String, enum: ["project_payment", "team_payout", "tool_subscription", "marketing", "refund", "bonus", "other"], default: "other" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "completed", "failed", "cancelled"], default: "completed" },
  reference: { type: String, default: "" },
  notes: { type: String, default: "" },
}, { timestamps: true });

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, default: "" },
  action: { type: String, required: true },
  target: { type: String, default: "" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  type: { type: String, enum: ["project", "status", "payment", "team", "system"], default: "system" },
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["order", "payment", "revision", "deadline", "team", "system"], default: "system" },
  read: { type: Boolean, default: false },
  link: { type: String, default: "" },
}, { timestamps: true });

const MessageSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  sender: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: "" },
  },
  content: { type: String, required: true },
  attachments: [{
    url: { type: String },
    name: { type: String },
    type: { type: String },
  }],
}, { timestamps: true });

const InvoiceSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["draft", "sent", "paid"], default: "draft" },
  dueDate: { type: Date },
  clientName: { type: String },
  description: { type: String, default: "" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);
const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env!");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB database...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Successfully connected to MongoDB.");

    // Clean up existing collections to start fresh
    console.log("Cleaning up old data...");
    await User.deleteMany({});
    await Project.deleteMany({});
    await Transaction.deleteMany({});
    await Activity.deleteMany({});
    await Notification.deleteMany({});
    await Message.deleteMany({});
    await Invoice.deleteMany({});
    console.log("🧹 Previous database states wiped.");

    // 1. Hash Passwords
    const hash1234 = await bcrypt.hash("1234", 10);
    const hash123456 = await bcrypt.hash("123456", 10);

    // 2. Create Users
    console.log("Seeding premium Users...");
    const users = await User.insertMany([
      {
        name: "Fahid Aqundow",
        email: "fahid32446@gmail.com",
        password: hash1234,
        role: "admin",
        status: "active",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        location: "Dhaka, Bangladesh",
        bio: "Founder & Lead Shogun. Orchestrating high-volume Fiverr operations and scaling teams.",
        skills: ["Strategy", "Project Management", "Client Relations"],
        performance_score: 100,
        total_earnings: 12500,
        projects_completed: 42,
        stars: 5,
      },
      {
        name: "Tanveer Ahmed",
        email: "tanveer8507@gmail.com",
        password: hash123456,
        role: "admin",
        status: "active",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        location: "Dhaka, Bangladesh",
        bio: "Operations Architect & System Administrator.",
        skills: ["Operations", "System Design", "Automation"],
        performance_score: 99,
        total_earnings: 9800,
        projects_completed: 35,
        stars: 5,
      },
      {
        name: "Alex Rivera",
        email: "dev1@shogun.com",
        password: hash1234,
        role: "member",
        status: "active",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        location: "Remote, CA",
        bio: "Full Stack Engineer specialized in Next.js, NodeJS, and high-performance applications.",
        skills: ["React", "NodeJS", "Next.js", "TailwindCSS", "MongoDB"],
        performance_score: 95,
        total_earnings: 4500,
        projects_completed: 18,
        stars: 4.8,
      },
      {
        name: "Sarah Chen",
        email: "dev2@shogun.com",
        password: hash1234,
        role: "member",
        status: "active",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        location: "Singapore",
        bio: "UI/UX Developer crafting premium interactive user experiences and motion design.",
        skills: ["UI/UX", "Figma", "Framer Motion", "TailwindCSS", "CSS Grid"],
        performance_score: 98,
        total_earnings: 3200,
        projects_completed: 12,
        stars: 4.9,
      },
      {
        name: "Marcus Vance",
        email: "pending@shogun.com",
        password: hash1234,
        role: "member",
        status: "pending",
        avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&auto=format&fit=crop&q=80",
        location: "London, UK",
        bio: "Front-end Developer seeking clearance to start work on assigned project boards.",
        skills: ["HTML", "CSS", "Vanilla JS"],
      },
      {
        name: "Devin Rogue",
        email: "suspended@shogun.com",
        password: hash1234,
        role: "member",
        status: "suspended",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
      },
      {
        name: "Client Corporation",
        email: "client@fastsolutions.com",
        password: hash1234,
        role: "client",
        status: "active",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
        location: "New York, USA",
        bio: "Enterprise partner reviewing agency deliverables and tracking custom platforms.",
      }
    ]);

    const adminId = users[0]._id;
    const adminName = users[0].name;
    const tanveerId = users[1]._id;
    const dev1Id = users[2]._id;
    const dev1Name = users[2].name;
    const dev2Id = users[3]._id;
    const dev2Name = users[3].name;

    const clientId = users[6]._id;
    const clientName = users[6].name;
    const clientEmail = users[6].email;

    console.log("✅ Users seeded successfully.");

    // 3. Create Projects
    console.log("Seeding realistic Projects with dynamic deadlines...");
    const now = new Date();

    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const projectsData = [
      {
        clientName: "Acme Corporation Inc.",
        profileName: "Tanveer (Fiverr Pro)",
        orderId: "FO-82940294",
        value: 1200,
        orderStatus: "Completed",
        developer: { id: dev2Id, name: dev2Name },
        client: { id: clientId, name: clientName, email: clientEmail },
        firstDraft: "Approved",
        deliveryDate: addDays(now, -3),
        deadline: addDays(now, -4),
        orderStart: addDays(now, -10),
        timeLeft: "Completed",
        priority: "Green",
        remarks: "Delivered fully responsive Tailwind portfolio ahead of timeline. Client left a 5-star review!",
        star: 5,
        progress: 100,
        developerPayout: 800,
        profitMargin: 400,
        createdBy: adminId,
        statusHistory: [
          { status: "Pending", changedAt: addDays(now, -10), changedBy: adminId },
          { status: "WIP", changedAt: addDays(now, -9), changedBy: dev2Id },
          { status: "Delivered", changedAt: addDays(now, -4), changedBy: dev2Id },
          { status: "Completed", changedAt: addDays(now, -3), changedBy: adminId }
        ]
      },
      {
        clientName: "SaaSify Global LLC",
        profileName: "Fahid (Fiverr Studio)",
        orderId: "FO-94827419",
        value: 2500,
        orderStatus: "WIP",
        developer: { id: dev1Id, name: dev1Name },
        client: { id: clientId, name: clientName, email: clientEmail },
        firstDraft: "Pending",
        deadline: addDays(now, 1), // Urgent! 24 hours left
        orderStart: addDays(now, -4),
        timeLeft: "24 Hours Left",
        priority: "Red",
        remarks: "Critical dashboard features are complete. Working on Stripe webhooks and Socket synchronization.",
        progress: 75,
        developerPayout: 1700,
        profitMargin: 800,
        createdBy: adminId,
        statusHistory: [
          { status: "Pending", changedAt: addDays(now, -4), changedBy: adminId },
          { status: "WIP", changedAt: addDays(now, -3), changedBy: dev1Id }
        ]
      },
      {
        clientName: "Crypto Pulse Dashboard",
        profileName: "Tanveer (Fiverr Pro)",
        orderId: "FO-73928173",
        value: 1800,
        orderStatus: "Pending",
        developer: { id: dev1Id, name: dev1Name },
        firstDraft: "Pending",
        deadline: addDays(now, 5),
        orderStart: now,
        timeLeft: "5 Days Left",
        priority: "Green",
        remarks: "Awaiting Figma asset exports and API keys from the client before code initialization.",
        progress: 10,
        developerPayout: 1200,
        profitMargin: 600,
        createdBy: tanveerId,
        statusHistory: [
          { status: "Pending", changedAt: now, changedBy: tanveerId }
        ]
      },
      {
        clientName: "Eco Global Ecosystem",
        profileName: "Fahid (Fiverr Studio)",
        orderId: "FO-48204928",
        value: 1500,
        orderStatus: "Revision",
        developer: { id: dev2Id, name: dev2Name },
        client: { id: clientId, name: clientName, email: clientEmail },
        firstDraft: "Delivered",
        deadline: addDays(now, 2), // 48h deadline alert
        orderStart: addDays(now, -6),
        timeLeft: "2 Days Left",
        priority: "Yellow",
        remarks: "Client requested micro-animation tweaks on landing page cards and form label corrections.",
        progress: 85,
        developerPayout: 1000,
        profitMargin: 500,
        createdBy: adminId,
        statusHistory: [
          { status: "Pending", changedAt: addDays(now, -6), changedBy: adminId },
          { status: "WIP", changedAt: addDays(now, -5), changedBy: dev2Id },
          { status: "Delivered", changedAt: addDays(now, -2), changedBy: dev2Id },
          { status: "Revision", changedAt: addDays(now, -1), changedBy: adminId }
        ]
      },
      {
        clientName: "Nova Marketing Web App",
        profileName: "Tanveer (Fiverr Pro)",
        orderId: "FO-39283719",
        value: 950,
        orderStatus: "Delivered",
        developer: { id: dev1Id, name: dev1Name },
        firstDraft: "Delivered",
        deliveryDate: addDays(now, -1),
        deadline: addDays(now, 1),
        orderStart: addDays(now, -5),
        timeLeft: "Awaiting Client Acceptance",
        priority: "Green",
        remarks: "Delivered project fully documented. Waiting for client to review and finalize the order.",
        progress: 95,
        developerPayout: 650,
        profitMargin: 300,
        createdBy: tanveerId,
        statusHistory: [
          { status: "Pending", changedAt: addDays(now, -5), changedBy: tanveerId },
          { status: "WIP", changedAt: addDays(now, -4), changedBy: dev1Id },
          { status: "Delivered", changedAt: addDays(now, -1), changedBy: dev1Id }
        ]
      },
      {
        clientName: "Fly Travel Agency Portal",
        profileName: "Fahid (Fiverr Studio)",
        orderId: "FO-10394829",
        value: 600,
        orderStatus: "Cancelled",
        developer: { id: dev2Id, name: dev2Name },
        firstDraft: "Failed",
        deadline: addDays(now, -10),
        orderStart: addDays(now, -15),
        timeLeft: "Cancelled",
        priority: "Green",
        remarks: "Cancelled by admin due to unresponsive client and scope creeping. Dispute fully resolved.",
        progress: 20,
        developerPayout: 0,
        profitMargin: 0,
        createdBy: adminId,
        statusHistory: [
          { status: "Pending", changedAt: addDays(now, -15), changedBy: adminId },
          { status: "WIP", changedAt: addDays(now, -13), changedBy: dev2Id },
          { status: "Cancelled", changedAt: addDays(now, -10), changedBy: adminId }
        ]
      }
    ];

    const seededProjects = await Project.insertMany(projectsData);
    console.log("✅ Projects seeded successfully.");

    // 4. Create Transactions
    console.log("Seeding agency Transactions...");
    await Transaction.insertMany([
      {
        type: "income",
        amount: 1200,
        description: "Project completed payout from Acme Corporation Inc.",
        category: "project_payment",
        projectId: seededProjects[0]._id,
        userId: adminId,
        status: "completed",
        reference: "TXN-9482948"
      },
      {
        type: "payout",
        amount: 800,
        description: "Developer payout to Sarah Chen for Acme Corp project",
        category: "team_payout",
        projectId: seededProjects[0]._id,
        userId: dev2Id,
        status: "completed",
        reference: "PAY-2849204"
      },
      {
        type: "expense",
        amount: 120,
        description: "Monthly subscription for Figma Enterprise plan",
        category: "tool_subscription",
        status: "completed",
        reference: "SUB-8392837"
      },
      {
        type: "income",
        amount: 950,
        description: "Incoming deposit for Nova Marketing Web App",
        category: "project_payment",
        projectId: seededProjects[4]._id,
        userId: adminId,
        status: "completed",
        reference: "TXN-3829482"
      },
      {
        type: "expense",
        amount: 250,
        description: "Marketing campaign for Fast Solutions brand scaling",
        category: "marketing",
        status: "completed",
        reference: "MKT-1839283"
      }
    ]);
    console.log("✅ Transactions seeded successfully.");

    // 5. Create Activities
    console.log("Seeding Audit Activities...");
    await Activity.insertMany([
      {
        userId: adminId,
        userName: adminName,
        action: "created project",
        target: "SaaSify Global LLC",
        projectId: seededProjects[1]._id,
        type: "project"
      },
      {
        userId: dev1Id,
        userName: dev1Name,
        action: "started working on",
        target: "SaaSify Global LLC",
        projectId: seededProjects[1]._id,
        type: "status"
      },
      {
        userId: dev2Id,
        userName: dev2Name,
        action: "submitted first draft for",
        target: "Eco Global Ecosystem",
        projectId: seededProjects[3]._id,
        type: "status"
      },
      {
        userId: adminId,
        userName: adminName,
        action: "requested revisions on",
        target: "Eco Global Ecosystem",
        projectId: seededProjects[3]._id,
        type: "project"
      },
      {
        userId: adminId,
        userName: adminName,
        action: "processed payout for",
        target: "Acme Corporation Inc.",
        projectId: seededProjects[0]._id,
        type: "payment"
      }
    ]);
    console.log("✅ Activities seeded successfully.");

    // 6. Create Notifications
    console.log("Seeding Notifications...");
    await Notification.insertMany([
      {
        userId: adminId,
        title: "🚨 Urgent Deadline Looming",
        message: "SaaSify Global LLC has less than 24 hours left before the primary deadline!",
        type: "deadline",
        read: false,
        link: `/projects/${seededProjects[1]._id}`
      },
      {
        userId: dev2Id,
        title: "🔄 Revision Requested",
        message: "Admin requested animations update for Eco Global Ecosystem.",
        type: "revision",
        read: false,
        link: `/projects/${seededProjects[3]._id}`
      },
      {
        userId: dev1Id,
        title: "💼 New Project Assigned",
        message: "You have been assigned as the lead developer for Crypto Pulse Dashboard.",
        type: "order",
        read: false,
        link: `/projects/${seededProjects[2]._id}`
      }
    ]);
    console.log("✅ Notifications seeded successfully.");

    // 7. Create Messages
    console.log("Seeding Messages...");
    await Message.insertMany([
      {
        projectId: seededProjects[1]._id,
        sender: {
          id: adminId,
          name: adminName,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
        },
        content: "Hey Alex! How is the progress on the SaaSify Dashboard project? The deadline is tomorrow.",
      },
      {
        projectId: seededProjects[1]._id,
        sender: {
          id: dev1Id,
          name: dev1Name,
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
        },
        content: "Hi Fahid! Most features are locked in. Just finalising Stripe integration and webhooks. Will deliver draft in a few hours.",
      },
      {
        projectId: seededProjects[1]._id,
        sender: {
          id: adminId,
          name: adminName,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
        },
        content: "Outstanding. Keep me updated. Let's make sure our real-time sync is 100% stable before delivery.",
      }
    ]);
    console.log("✅ Messages seeded successfully.");

    // 8. Create Invoices
    console.log("Seeding Invoices...");
    await Invoice.insertMany([
      {
        project: seededProjects[0]._id,
        invoiceNumber: "INV-2026-001",
        amount: 1200,
        status: "paid",
        dueDate: addDays(now, -5),
        clientName: "Acme Corporation Inc.",
        description: "Milestone 1 & 2: Landing Page and Client Portal implementation"
      },
      {
        project: seededProjects[1]._id,
        invoiceNumber: "INV-2026-002",
        amount: 2500,
        status: "sent",
        dueDate: addDays(now, 3),
        clientName: "SaaSify Global LLC",
        description: "Full Dashboard Development & Socket Server Integration"
      }
    ]);
    console.log("✅ Invoices seeded successfully.");

    console.log("\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=========================================");
    console.log(`🔑 Admin Login:  fahid32446@gmail.com`);
    console.log(`🔑 Client Login: client@fastsolutions.com`);
    console.log(`🔑 Password:      1234`);
    console.log("=========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    process.exit(1);
  }
}

seed();
