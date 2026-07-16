import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { eq } from "drizzle-orm";

// Database imports - MUST include full file extensions
import { db } from "./src/db/index.ts";
import { users, agents, tasks } from "./src/db/schema.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route: Get or initialize user's agents & tasks
  app.get("/api/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || "unknown@domain.com";
      if (!uid) {
        return res.status(401).json({ error: "Missing user UID in token" });
      }

      // Get or create user record
      const dbUser = await getOrCreateUser(uid, email);

      // Fetch user's agents and tasks
      const userAgents = await db.select().from(agents).where(eq(agents.userId, dbUser.id));
      const userTasks = await db.select().from(tasks).where(eq(tasks.userId, dbUser.id));

      // If no agents exist, initialize with default agents and tasks
      if (userAgents.length === 0) {
        const defaultAgents = [
          {
            id: "agent-1",
            userId: dbUser.id,
            name: "Evelyn Rota",
            role: "CEO & Orchestrator",
            status: "WORKING",
            instruction: "Main coordinator of Rota Labs systems, resolving logical bottlenecks.",
            budget: 5000,
            avatarBg: "from-purple-600 to-pink-500",
          },
          {
            id: "agent-2",
            userId: dbUser.id,
            name: "Atlas Bot",
            role: "Senior Dev",
            status: "WAKING",
            instruction: "Rust, TypeScript, and microservices architecture optimization agent.",
            budget: 3500,
            avatarBg: "from-blue-600 to-indigo-500",
          },
          {
            id: "agent-3",
            userId: dbUser.id,
            name: "Nova Pen",
            role: "Copywriter & Marketing",
            status: "SLEEPING",
            instruction: "Specialist in highly persuasive copy, SEO optimization, and viral campaign scripts.",
            budget: 2000,
            avatarBg: "from-pink-500 to-rose-400",
          }
        ];

        const defaultTasks = [
          {
            id: "task-1",
            userId: dbUser.id,
            title: "Refactor Auth Module for V3 Microservices",
            agentId: "agent-2",
            priority: "HIGH",
            status: "TO_DO",
            dueDate: "2026-07-14", // Past date (overdue)
          },
          {
            id: "task-2",
            userId: dbUser.id,
            title: "Integrate Stripe Webhooks with local retry loop",
            agentId: "agent-2",
            priority: "MEDIUM",
            status: "TO_DO",
            dueDate: "2026-07-22", // Future date
          },
          {
            id: "task-3",
            userId: dbUser.id,
            title: "SEO Optimization & Content Marketing Copy kit",
            agentId: "agent-3",
            priority: "URGENT",
            status: "IN_PROGRESS",
            dueDate: "2026-07-25", // Future date
          },
          {
            id: "task-4",
            userId: dbUser.id,
            title: "Dockerize Core Orchestrator Agents for deployment",
            agentId: "agent-1",
            priority: "HIGH",
            status: "DONE",
            dueDate: "2026-07-12", // Completed task
          },
          {
            id: "task-5",
            userId: dbUser.id,
            title: "Write interactive simulation schemas",
            agentId: "agent-1",
            priority: "LOW",
            status: "REVIEW",
            dueDate: "", // No due date
          }
        ];

        // Perform bulk inserts
        await db.insert(agents).values(defaultAgents);
        await db.insert(tasks).values(defaultTasks);

        return res.json({
          agents: defaultAgents.map(({ userId, ...rest }) => rest),
          tasks: defaultTasks.map(({ userId, ...rest }) => rest),
        });
      }

      // Return the found items, stripping the userId before sending to client
      return res.json({
        agents: userAgents.map(({ userId, ...rest }) => rest),
        tasks: userTasks.map(({ userId, ...rest }) => rest),
      });
    } catch (error: any) {
      console.error("Database query /api/sync failed:", error);
      res.status(500).json({ error: "Failed to synchronize application state. " + (error?.message || "") });
    }
  });

  // API Route: Save entire agents & tasks list for user
  app.post("/api/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || "unknown@domain.com";
      if (!uid) {
        return res.status(401).json({ error: "Missing user UID in token" });
      }

      const { agents: inputAgents, tasks: inputTasks } = req.body;
      if (!Array.isArray(inputAgents) || !Array.isArray(inputTasks)) {
        return res.status(400).json({ error: "Invalid payload format. Must contain agents and tasks arrays." });
      }

      const dbUser = await getOrCreateUser(uid, email);

      // Save in transaction to ensure atomic replacements
      await db.transaction(async (tx) => {
        // Delete existing agents & tasks for this user
        await tx.delete(agents).where(eq(agents.userId, dbUser.id));
        await tx.delete(tasks).where(eq(tasks.userId, dbUser.id));

        // Re-insert only if arrays are not empty
        if (inputAgents.length > 0) {
          const agentsToInsert = inputAgents.map((agent: any) => ({
            id: agent.id,
            userId: dbUser.id,
            name: agent.name,
            role: agent.role,
            status: agent.status,
            instruction: agent.instruction,
            budget: Number(agent.budget) || 0,
            avatarBg: agent.avatarBg || "from-slate-600 to-slate-500",
          }));
          await tx.insert(agents).values(agentsToInsert);
        }

        if (inputTasks.length > 0) {
          const tasksToInsert = inputTasks.map((task: any) => ({
            id: task.id,
            userId: dbUser.id,
            title: task.title,
            agentId: task.agentId,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate || null,
          }));
          await tx.insert(tasks).values(tasksToInsert);
        }
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Failed to save state to DB:", error);
      res.status(500).json({ error: "Database save failed. Please try again. " + (error?.message || "") });
    }
  });

  // Vite development middleware vs Static Production server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support single-page application router fallback (Express v4 format is *all or *)
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
