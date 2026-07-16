import React, { useState, useEffect, useRef } from "react";
import { 
  Layers, 
  Users, 
  CheckSquare, 
  Settings, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  PlusCircle, 
  ArrowLeft, 
  ArrowRight, 
  Terminal, 
  FileText, 
  Moon, 
  Sun, 
  Eye, 
  DollarSign, 
  Sliders, 
  UserCheck, 
  Info,
  CheckCircle,
  Clock,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from "lucide-react";

// Types
type AgentStatus = "SLEEPING" | "WAKING" | "WORKING";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type TaskStatus = "TO_DO" | "IN_PROGRESS" | "REVIEW" | "DONE";
type ThemeMode = "DARK" | "LIGHT" | "HIGH_CONTRAST";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  instruction: string;
  budget: number;
  avatarBg: string;
}

interface Task {
  id: string;
  title: string;
  agentId: string;
  priority: Priority;
  status: TaskStatus;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: "INFO" | "TASK" | "SYNC" | "SUCCESS" | "ERROR";
  message: string;
}

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("rota_labs_theme");
    return (saved as ThemeMode) || "DARK";
  });

  // Navigation sidebar & mobile views
  const [activeTab, setActiveTab] = useState<"orchestrator" | "agents" | "specifications" | "settings">("orchestrator");
  const [mobileKanbanTab, setMobileKanbanTab] = useState<TaskStatus>("TO_DO");

  // Hiring center modal
  const [isHiringModalOpen, setIsHiringModalOpen] = useState(false);
  const [hiringForm, setHiringForm] = useState({
    name: "",
    role: "Developer",
    instruction: "",
    budget: 1500,
  });

  // Create Task panel/popover
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    agentId: "",
    priority: "MEDIUM" as Priority,
    status: "TO_DO" as TaskStatus,
  });

  // Agents list state
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "agent-1",
      name: "Evelyn Rota",
      role: "CEO & Orchestrator",
      status: "WORKING",
      instruction: "Main coordinator of Rota Labs systems, resolving logical bottlenecks.",
      budget: 5000,
      avatarBg: "from-purple-600 to-pink-500",
    },
    {
      id: "agent-2",
      name: "Atlas Bot",
      role: "Senior Dev",
      status: "WAKING",
      instruction: "Rust, TypeScript, and microservices architecture optimization agent.",
      budget: 3500,
      avatarBg: "from-blue-600 to-indigo-500",
    },
    {
      id: "agent-3",
      name: "Nova Pen",
      role: "Copywriter & Marketing",
      status: "SLEEPING",
      instruction: "Specialist in highly persuasive copy, SEO optimization, and viral campaign scripts.",
      budget: 2000,
      avatarBg: "from-pink-500 to-rose-400",
    }
  ]);

  // Tasks board state
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Refactor Auth Module for V3 Microservices",
      agentId: "agent-2",
      priority: "HIGH",
      status: "TO_DO",
    },
    {
      id: "task-2",
      title: "Integrate Stripe Webhooks with local retry loop",
      agentId: "agent-2",
      priority: "MEDIUM",
      status: "TO_DO",
    },
    {
      id: "task-3",
      title: "SEO Optimization & Content Marketing Copy kit",
      agentId: "agent-3",
      priority: "URGENT",
      status: "IN_PROGRESS",
    },
    {
      id: "task-4",
      title: "Dockerize Core Orchestrator Agents for deployment",
      agentId: "agent-1",
      priority: "HIGH",
      status: "DONE",
    },
    {
      id: "task-5",
      title: "Write interactive simulation schemas",
      agentId: "agent-1",
      priority: "LOW",
      status: "REVIEW",
    }
  ]);

  // Terminal state
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "log-1",
      timestamp: "12:04:15",
      type: "INFO",
      message: "Orchestrator System initialized successfully.",
    },
    {
      id: "log-2",
      timestamp: "12:04:22",
      type: "SYNC",
      message: "Atlas Bot loaded module auth-validator-v3 (83ms).",
    },
    {
      id: "log-3",
      timestamp: "12:04:31",
      type: "TASK",
      message: "Nova Pen starts writing high-conversion copy for Rota Labs launcher.",
    },
    {
      id: "log-4",
      timestamp: "12:04:35",
      type: "SUCCESS",
      message: "Task 'Dockerize Core Orchestrator Agents' moved to status [DONE].",
    }
  ]);
  const [isLogRunning, setIsLogRunning] = useState(true);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Financial status calculations
  const totalBudgetLimit = 100000;
  const initialHiringCredits = 12450;
  const totalSpent = agents.reduce((acc, current) => acc + current.budget, 0);
  const hiringCreditsRemaining = initialHiringCredits - totalSpent > 0 
    ? initialHiringCredits - totalSpent 
    : 150;

  // Auto scroll terminal
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Preset live logs to generate
  const logPool = [
    { type: "INFO" as const, message: "System resource check: Cognitive load at 42%, all processes healthy." },
    { type: "TASK" as const, message: "CEO Agent Evelyn Rota performs security audit on external webhooks." },
    { type: "SYNC" as const, message: "Synchronizing state vectors across 3 sub-agents to avoid logical collisions." },
    { type: "SUCCESS" as const, message: "Senior Dev Atlas Bot fixed 4 potential type errors in user endpoints." },
    { type: "ERROR" as const, message: "Warning: High memory consumption on microservice 'node-agent-executor'." },
    { type: "INFO" as const, message: "Rota Labs Orchestrator: Automatic cognitive load balancing complete." },
    { type: "TASK" as const, message: "Copywriter Agent Nova Pen generated 3 alternative taglines for the pricing page." },
    { type: "SUCCESS" as const, message: "Verified code integrity of auth-validator-v3 with 100% test coverage." },
    { type: "SYNC" as const, message: "Neural parameters consolidated across model context boundaries." },
    { type: "INFO" as const, message: "Database read latency minimized: 4ms cache hit rate at 99.2%." },
    { type: "TASK" as const, message: "Atlas Bot initialized local code analysis for Stripe Webhook integration." },
  ];

  // Simulated live logs addition
  useEffect(() => {
    if (!isLogRunning) return;

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];

      setLogs((prev) => [
        ...prev,
        {
          id: `log-dynamic-${Date.now()}`,
          timestamp: timeStr,
          type: randomLog.type,
          message: randomLog.message,
        },
      ]);

      // Randomly tweak agent status to simulate live action
      setAgents((prev) => 
        prev.map((agent) => {
          if (agent.id === "agent-1") return agent; // CEO is always hard at work
          const r = Math.random();
          if (r < 0.15) {
            const nextStatus: AgentStatus = agent.status === "SLEEPING" ? "WAKING" : agent.status === "WAKING" ? "WORKING" : "SLEEPING";
            return { ...agent, status: nextStatus };
          }
          return agent;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isLogRunning]);

  // Save theme helper
  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("rota_labs_theme", newTheme);
  };

  // Hire dynamic Agent
  const handleHireAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hiringForm.name.trim() || !hiringForm.instruction.trim()) {
      alert("Por favor preencha todos os campos obrigatórios.");
      return;
    }

    const randomColorGradients = [
      "from-violet-600 to-indigo-500",
      "from-emerald-500 to-teal-600",
      "from-cyan-500 to-blue-600",
      "from-amber-500 to-orange-500",
      "from-rose-500 to-pink-600"
    ];
    const chosenBg = randomColorGradients[Math.floor(Math.random() * randomColorGradients.length)];

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: hiringForm.name,
      role: hiringForm.role,
      status: "WAKING", // default state when hired
      instruction: hiringForm.instruction,
      budget: Number(hiringForm.budget) || 1200,
      avatarBg: chosenBg,
    };

    setAgents((prev) => [...prev, newAgent]);

    // Send log
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setLogs((prev) => [
      ...prev,
      {
        id: `log-dynamic-${Date.now()}`,
        timestamp: timeStr,
        type: "SUCCESS",
        message: `Novo agente contratado: ${newAgent.name} como ${newAgent.role} com orçamento de $${newAgent.budget}.`,
      }
    ]);

    // Reset Form & Close
    setHiringForm({
      name: "",
      role: "Developer",
      instruction: "",
      budget: 1500,
    });
    setIsHiringModalOpen(false);
  };

  // Create task helper
  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      alert("Por favor digite o título da missão.");
      return;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskForm.title,
      agentId: taskForm.agentId || agents[0]?.id || "agent-1",
      priority: taskForm.priority,
      status: taskForm.status,
    };

    setTasks((prev) => [...prev, newTask]);

    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setLogs((prev) => [
      ...prev,
      {
        id: `log-dynamic-${Date.now()}`,
        timestamp: timeStr,
        type: "TASK",
        message: `Nova missão criada: '${newTask.title}' atribuída ao agente: ${agents.find(a => a.id === newTask.agentId)?.name || "Ninguém"}.`,
      }
    ]);

    // Reset & Close
    setTaskForm({
      title: "",
      agentId: "",
      priority: "MEDIUM",
      status: "TO_DO",
    });
    setIsCreateTaskOpen(false);
  };

  // Change task status dynamically
  const moveTaskStatus = (taskId: string, direction: "left" | "right") => {
    const statuses: TaskStatus[] = ["TO_DO", "IN_PROGRESS", "REVIEW", "DONE"];
    
    setTasks((prev) => 
      prev.map((t) => {
        if (t.id === taskId) {
          const currentIndex = statuses.indexOf(t.status);
          let newIndex = currentIndex;
          if (direction === "left" && currentIndex > 0) newIndex--;
          if (direction === "right" && currentIndex < statuses.length - 1) newIndex++;
          const nextStatus = statuses[newIndex];
          
          if (nextStatus !== t.status) {
            // Log move
            const now = new Date();
            const timeStr = now.toTimeString().split(" ")[0];
            setTimeout(() => {
              setLogs((prevLogs) => [
                ...prevLogs,
                {
                  id: `log-dynamic-${Date.now()}`,
                  timestamp: timeStr,
                  type: "SYNC",
                  message: `Missão '${t.title}' alterada de [${t.status}] para [${nextStatus}].`,
                }
              ]);
            }, 50);
          }

          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const changeTaskStatusDropdown = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) => 
      prev.map((t) => {
        if (t.id === taskId) {
          if (newStatus !== t.status) {
            const now = new Date();
            const timeStr = now.toTimeString().split(" ")[0];
            setTimeout(() => {
              setLogs((prevLogs) => [
                ...prevLogs,
                {
                  id: `log-dynamic-${Date.now()}`,
                  timestamp: timeStr,
                  type: "SYNC",
                  message: `Missão '${t.title}' reorquestrada manualmente para o status [${newStatus}].`,
                }
              ]);
            }, 50);
          }
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  // Delete task helper
  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setLogs((prev) => [
      ...prev,
      {
        id: `log-dynamic-${Date.now()}`,
        timestamp: timeStr,
        type: "ERROR",
        message: `Missão deletada permanentemente: '${taskToDelete?.title || taskId}'.`,
      }
    ]);
  };

  // Terminal manual commands handler
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const inputLower = terminalInput.toLowerCase().trim();
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];

    let replyMessage = `Comando '${terminalInput}' não reconhecido. Digite 'help' para comandos.`;
    let replyType: LogEntry["type"] = "ERROR";

    if (inputLower === "help") {
      replyMessage = "Comandos disponíveis: help (ajuda), clear (limpar), status (status geral), agents (listar agentes), hire (abrir contratação), pause (pausar logs), play (resumir logs).";
      replyType = "INFO";
    } else if (inputLower === "clear") {
      setLogs([]);
      setTerminalInput("");
      return;
    } else if (inputLower === "status") {
      replyMessage = `Orchestrator Ativo • ${agents.length} Agentes Carregados • ${tasks.length} Missões em Fila • Region: Global-Edge-V4`;
      replyType = "SYNC";
    } else if (inputLower === "agents") {
      const names = agents.map(a => `${a.name} [${a.status}]`).join(", ");
      replyMessage = `Agentes Ativos: ${names}`;
      replyType = "SUCCESS";
    } else if (inputLower === "hire") {
      setIsHiringModalOpen(true);
      replyMessage = "Abrindo central de contratação de agentes virtuais...";
      replyType = "INFO";
    } else if (inputLower === "pause") {
      setIsLogRunning(false);
      replyMessage = "Fluxo automático de simulação pausado.";
      replyType = "INFO";
    } else if (inputLower === "play" || inputLower === "resume") {
      setIsLogRunning(true);
      replyMessage = "Fluxo automático de simulação retomado com sucesso.";
      replyType = "SUCCESS";
    }

    setLogs((prev) => [
      ...prev,
      {
        id: `log-cmd-input-${Date.now()}`,
        timestamp: timeStr,
        type: "INFO",
        message: `> ${terminalInput}`,
      },
      {
        id: `log-cmd-reply-${Date.now()}`,
        timestamp: timeStr,
        type: replyType,
        message: replyMessage,
      }
    ]);

    setTerminalInput("");
  };

  // Theme Styling Configurations based on selected Theme Mode
  const getThemeClasses = () => {
    switch (theme) {
      case "LIGHT":
        return {
          wrapper: "bg-[#f8fafc] text-slate-900 font-sans",
          sidebar: "bg-white border-r border-slate-200 text-slate-800",
          header: "bg-[#f1f5f9]/90 border-b border-slate-200 backdrop-blur-md text-slate-900",
          card: "bg-white/80 border border-slate-200/90 shadow-sm text-slate-800 backdrop-blur-md",
          innerCard: "bg-slate-50 border border-slate-100 p-4 rounded-xl",
          textMuted: "text-slate-500 text-sm",
          textHighlight: "text-purple-600 font-semibold",
          accentGradient: "from-purple-600 to-indigo-500",
          buttonSecondary: "bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300",
          buttonPrimary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:brightness-105",
          titleText: "text-slate-900",
          terminalBg: "bg-slate-100 border border-slate-200 text-slate-800",
          badgeLow: "bg-slate-100 text-slate-700 border border-slate-200",
          badgeMed: "bg-amber-100 text-amber-800 border border-amber-200",
          badgeHigh: "bg-orange-100 text-orange-800 border border-orange-200",
          badgeUrgent: "bg-red-100 text-red-800 border border-red-200",
          sidebarLinkActive: "bg-purple-100 text-purple-900 border border-purple-200/50",
          sidebarLinkInactive: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          navBottomBg: "bg-white border-t border-slate-200",
          statOverlay: "bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 text-slate-800"
        };
      case "HIGH_CONTRAST":
        return {
          wrapper: "bg-black text-white font-mono",
          sidebar: "bg-black border-r-2 border-white text-white",
          header: "bg-black border-b-2 border-white text-white",
          card: "bg-black border-2 border-white text-white",
          innerCard: "bg-black border border-white/50 p-4 rounded-none",
          textMuted: "text-yellow-400 text-sm font-bold",
          textHighlight: "text-cyan-400 font-bold",
          accentGradient: "from-black to-black",
          buttonSecondary: "bg-black hover:bg-white hover:text-black text-white border-2 border-white",
          buttonPrimary: "bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black font-extrabold",
          titleText: "text-yellow-400",
          terminalBg: "bg-black border border-white text-green-400",
          badgeLow: "bg-black text-white border border-white",
          badgeMed: "bg-black text-yellow-400 border border-yellow-400",
          badgeHigh: "bg-black text-orange-400 border border-orange-400",
          badgeUrgent: "bg-black text-red-500 border border-red-500 font-bold",
          sidebarLinkActive: "bg-white text-black border-2 border-white font-bold",
          sidebarLinkInactive: "text-white hover:bg-white hover:text-black border border-transparent",
          navBottomBg: "bg-black border-t-2 border-white",
          statOverlay: "bg-black border-2 border-yellow-400 text-white"
        };
      case "DARK":
      default:
        return {
          wrapper: "bg-[#020617] text-slate-100 font-sans",
          sidebar: "bg-[#0b0f19] border-r border-slate-800/80 text-slate-200",
          header: "bg-[#020617]/80 border-b border-slate-800/80 backdrop-blur-xl text-white",
          card: "bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-slate-200",
          innerCard: "bg-slate-950/60 border border-slate-800 p-4 rounded-xl",
          textMuted: "text-slate-400 text-sm",
          textHighlight: "text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899] font-semibold",
          accentGradient: "from-[#7C3AED] to-[#3B82F6]",
          buttonSecondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
          buttonPrimary: "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] border border-white/10 hover:brightness-110",
          titleText: "text-white",
          terminalBg: "bg-black/40 border border-slate-800/80 text-slate-300",
          badgeLow: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
          badgeMed: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
          badgeHigh: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
          badgeUrgent: "bg-red-500/10 text-red-400 border border-red-500/20",
          sidebarLinkActive: "bg-slate-800/50 text-slate-100 border border-slate-700/50",
          sidebarLinkInactive: "text-slate-400 hover:text-slate-100 hover:bg-slate-800/30",
          navBottomBg: "bg-[#0b0f19] border-t border-slate-800/80",
          statOverlay: "bg-gradient-to-br from-[#1e1b4b] to-[#020617] border border-slate-700"
        };
    }
  };

  const themeStyles = getThemeClasses();

  return (
    <div id="orchestrator-app" className={`min-h-screen flex flex-col md:flex-row overflow-hidden ${themeStyles.wrapper}`}>
      
      {/* SIDEBAR - DESKTOP LAYOUT */}
      <aside className={`hidden md:flex w-64 flex-col p-6 shrink-0 transition-all ${themeStyles.sidebar}`}>
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">
            ROTA <span className={themeStyles.textHighlight}>LABS</span>
          </span>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("orchestrator")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium text-left ${
              activeTab === "orchestrator" ? themeStyles.sidebarLinkActive : themeStyles.sidebarLinkInactive
            }`}
          >
            <Layers className="w-5 h-5 mr-3 text-blue-500" />
            Orchestrator
          </button>
          
          <button
            onClick={() => setActiveTab("agents")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium text-left ${
              activeTab === "agents" ? themeStyles.sidebarLinkActive : themeStyles.sidebarLinkInactive
            }`}
          >
            <Users className="w-5 h-5 mr-3 text-purple-500" />
            Active Agents
            <span className="ml-auto bg-slate-800 text-[10px] px-2 py-0.5 rounded-full text-white">{agents.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("specifications")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium text-left ${
              activeTab === "specifications" ? themeStyles.sidebarLinkActive : themeStyles.sidebarLinkInactive
            }`}
          >
            <FileText className="w-5 h-5 mr-3 text-pink-500" />
            Specs (PO/BA)
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium text-left ${
              activeTab === "settings" ? themeStyles.sidebarLinkActive : themeStyles.sidebarLinkInactive
            }`}
          >
            <Settings className="w-5 h-5 mr-3 text-amber-500" />
            Settings & Themes
          </button>
        </nav>

        {/* Sidebar Footer Info */}
        <div className="mt-auto pt-6 border-t border-slate-800/40">
          <div className={`p-4 rounded-2xl ${themeStyles.statOverlay}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Hiring Credits</p>
            <div className="flex items-end justify-between">
              <span className="text-xl font-extrabold font-mono">${hiringCreditsRemaining.toLocaleString()}</span>
              <span className="text-xs text-emerald-400 font-bold">Active</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700/60 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500" 
                style={{ width: `${Math.max(10, Math.min(100, (hiringCreditsRemaining / initialHiringCredits) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </aside>

      {/* TOP HEADER - RESPONSIVE */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pb-20 md:pb-0">
        <header className={`h-20 shrink-0 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 ${themeStyles.header}`}>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                {activeTab === "orchestrator" && "Orchestrator Dashboard"}
                {activeTab === "agents" && "AI Agents Center"}
                {activeTab === "specifications" && "Agile Blueprint & Specs"}
                {activeTab === "settings" && "System Configuration"}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-400 rounded-full font-bold">
                ONLINE
              </span>
            </div>
            <p className="hidden sm:block text-slate-400 text-xs">
              System Uptime: 99.98% • Latency: 24ms • Version: 2.1.0-RC
            </p>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            {activeTab === "orchestrator" && (
              <button 
                onClick={() => setIsCreateTaskOpen(true)}
                className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${themeStyles.buttonSecondary}`}
              >
                <Plus className="w-4 h-4 mr-1 md:mr-1.5" />
                Nova Missão
              </button>
            )}

            <button 
              onClick={() => setIsHiringModalOpen(true)}
              className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${themeStyles.buttonPrimary}`}
            >
              <PlusCircle className="w-4 h-4 mr-1 md:mr-1.5" />
              Contratar Agente
            </button>
          </div>
        </header>

        {/* CORE INTERACTION CONTENT AREA */}
        <main className="flex-1 p-4 md:p-8">
          
          {/* ORCHESTRATOR DASHBOARD TAB */}
          {activeTab === "orchestrator" && (
            <div className="space-y-6">
              
              {/* STATUS CARDS CAROUSEL / GRID */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl ${themeStyles.card}`}>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Agentes Operando</p>
                  <p className="text-2xl md:text-3xl font-extrabold font-mono mt-1 text-purple-500">
                    {agents.filter(a => a.status === "WORKING").length} <span className="text-xs text-slate-400">/ {agents.length}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2">Pulsando em alto processamento</p>
                </div>
                <div className={`p-4 rounded-2xl ${themeStyles.card}`}>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Missões Pendentes</p>
                  <p className="text-2xl md:text-3xl font-extrabold font-mono mt-1 text-blue-400">
                    {tasks.filter(t => t.status !== "DONE").length} <span className="text-xs text-slate-400">ativas</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2">Do To-Do ao Review</p>
                </div>
                <div className={`p-4 rounded-2xl ${themeStyles.card}`}>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Orçamento Consumido</p>
                  <p className="text-2xl md:text-3xl font-extrabold font-mono mt-1 text-pink-500">
                    ${totalSpent.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2">Limite: $100,000</p>
                </div>
                <div className={`p-4 rounded-2xl ${themeStyles.card}`}>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fator de Vazão</p>
                  <p className="text-2xl md:text-3xl font-extrabold font-mono mt-1 text-emerald-400">
                    {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === "DONE").length / tasks.length) * 100) : 0}%
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2">Taxa de conclusão geral</p>
                </div>
              </div>

              {/* DYNAMIC KANBAN BOARD */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-bold flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2.5 animate-pulse"></span>
                    Quadro Kanban de Operações
                  </h3>
                  
                  {/* MOBILE TABS SWITCHER FOR KANBAN */}
                  <div className="flex md:hidden bg-slate-900 border border-slate-800 p-1 rounded-xl">
                    {(["TO_DO", "IN_PROGRESS", "REVIEW", "DONE"] as TaskStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => setMobileKanbanTab(st)}
                        className={`flex-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                          mobileKanbanTab === st ? "bg-[#7C3AED] text-white" : "text-slate-400"
                        }`}
                      >
                        {st.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* KANBAN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  {/* TO DO COLUMN */}
                  <div className={`flex flex-col space-y-4 ${mobileKanbanTab !== "TO_DO" ? "hidden md:flex" : "flex"}`}>
                    <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-slate-500 mr-2"></span> To Do
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-white text-[10px]">
                        {tasks.filter(t => t.status === "TO_DO").length}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[300px] bg-slate-950/20 p-2 rounded-xl border border-dashed border-slate-800/40">
                      {tasks.filter(t => t.status === "TO_DO").length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-10 italic">Nenhuma missão no momento</p>
                      ) : (
                        tasks.filter(t => t.status === "TO_DO").map(t => (
                          <TaskCard 
                            key={t.id} 
                            task={t} 
                            agents={agents} 
                            themeStyles={themeStyles}
                            onDelete={deleteTask}
                            onMove={moveTaskStatus}
                            onChangeStatus={changeTaskStatusDropdown}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* IN PROGRESS COLUMN */}
                  <div className={`flex flex-col space-y-4 ${mobileKanbanTab !== "IN_PROGRESS" ? "hidden md:flex" : "flex"}`}>
                    <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-ping"></span> In Progress
                      </span>
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px]">
                        {tasks.filter(t => t.status === "IN_PROGRESS").length}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[300px] bg-slate-950/20 p-2 rounded-xl border border-dashed border-slate-800/40">
                      {tasks.filter(t => t.status === "IN_PROGRESS").length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-10 italic">Nenhum agente executando agora</p>
                      ) : (
                        tasks.filter(t => t.status === "IN_PROGRESS").map(t => (
                          <TaskCard 
                            key={t.id} 
                            task={t} 
                            agents={agents} 
                            themeStyles={themeStyles}
                            onDelete={deleteTask}
                            onMove={moveTaskStatus}
                            onChangeStatus={changeTaskStatusDropdown}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* REVIEW COLUMN */}
                  <div className={`flex flex-col space-y-4 ${mobileKanbanTab !== "REVIEW" ? "hidden md:flex" : "flex"}`}>
                    <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span> Review
                      </span>
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-[10px]">
                        {tasks.filter(t => t.status === "REVIEW").length}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[300px] bg-slate-950/20 p-2 rounded-xl border border-dashed border-slate-800/40">
                      {tasks.filter(t => t.status === "REVIEW").length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-10 italic">Nenhum aguardando aprovação</p>
                      ) : (
                        tasks.filter(t => t.status === "REVIEW").map(t => (
                          <TaskCard 
                            key={t.id} 
                            task={t} 
                            agents={agents} 
                            themeStyles={themeStyles}
                            onDelete={deleteTask}
                            onMove={moveTaskStatus}
                            onChangeStatus={changeTaskStatusDropdown}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* DONE COLUMN */}
                  <div className={`flex flex-col space-y-4 ${mobileKanbanTab !== "DONE" ? "hidden md:flex" : "flex"}`}>
                    <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Done
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px]">
                        {tasks.filter(t => t.status === "DONE").length}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[300px] bg-slate-950/20 p-2 rounded-xl border border-dashed border-slate-800/40">
                      {tasks.filter(t => t.status === "DONE").length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-10 italic">Nenhuma missão finalizada ainda</p>
                      ) : (
                        tasks.filter(t => t.status === "DONE").map(t => (
                          <TaskCard 
                            key={t.id} 
                            task={t} 
                            agents={agents} 
                            themeStyles={themeStyles}
                            onDelete={deleteTask}
                            onMove={moveTaskStatus}
                            onChangeStatus={changeTaskStatusDropdown}
                          />
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* ACTIVE AGENTS MINI SECTION ON DASHBOARD */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* INTERACTIVE SIMULATOR CARD */}
                <div className={`lg:col-span-2 p-6 rounded-2xl ${themeStyles.card}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-base flex items-center">
                      <UserCheck className="w-5 h-5 mr-2 text-purple-400" />
                      Visualizador de Agentes Ativos
                    </h3>
                    <button 
                      onClick={() => setActiveTab("agents")}
                      className="text-xs text-indigo-400 hover:underline flex items-center"
                    >
                      Ver todos <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {agents.map((agent) => (
                      <div 
                        key={agent.id}
                        className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                          agent.status === "WORKING" 
                            ? "bg-purple-950/15 border-purple-500/40" 
                            : "bg-slate-900/20 border-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${agent.avatarBg} p-[2px] flex-shrink-0`}>
                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-xs text-white">
                              {agent.name.split(" ").map(n => n[0]).join("").substring(0, 3).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{agent.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono uppercase">{agent.role}</p>
                          </div>
                        </div>

                        <div className="text-xs max-w-sm text-slate-300 italic hidden md:block truncate">
                          "{agent.instruction}"
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="font-mono text-xs">
                            <span className="text-slate-500">Aloc:</span> ${agent.budget.toLocaleString()}
                          </div>
                          <AgentStatusBadge status={agent.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COGNITIVE LOAD METERS */}
                <div className={`p-6 rounded-2xl ${themeStyles.card} flex flex-col justify-between`}>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Métricas Cognitivas</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span>THROUGHPUT GLOBAL</span>
                          <span className="text-pink-500 font-bold">82%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: "82%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span>NEURAL DECAY FLOW</span>
                          <span className="text-blue-400 font-bold">14%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: "14%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span>CACHE REUSABILITY</span>
                          <span className="text-emerald-400 font-bold">94.8%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: "94.8%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/40 text-[10px] text-slate-400 font-mono space-y-1">
                    <p>● COGNITIVE ENGINE: V4-AGENTS</p>
                    <p>● DISPATCH LATENCY: 12ms (AVERAGE)</p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ACTIVE AGENTS TAB */}
          {activeTab === "agents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Central de Agentes de Inteligência Artificial</h2>
                  <p className="text-xs text-slate-400">Gerencie, instancie ou coloque em repouso as mentes autônomas da Rota Labs.</p>
                </div>
                <button
                  onClick={() => setIsHiringModalOpen(true)}
                  className={`flex items-center px-4 py-2 text-sm font-semibold rounded-xl ${themeStyles.buttonPrimary}`}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Novo Agente
                </button>
              </div>

              {/* GRID OF AGENTS WITH RECRUIT DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => {
                  const assignedTasks = tasks.filter(t => t.agentId === agent.id);
                  return (
                    <div key={agent.id} className={`p-6 rounded-2xl flex flex-col justify-between ${themeStyles.card} relative overflow-hidden`}>
                      {/* Top design accent bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${agent.avatarBg}`}></div>

                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${agent.avatarBg} p-[2px] flex-shrink-0`}>
                              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-sm text-white">
                                {agent.name.split(" ").map(n => n[0]).join("").substring(0, 3).toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-bold text-base">{agent.name}</h3>
                              <p className="text-xs text-slate-400 font-mono">{agent.role}</p>
                            </div>
                          </div>
                          <AgentStatusBadge status={agent.status} />
                        </div>

                        {/* Custom status controller */}
                        <div className="bg-slate-950/40 border border-slate-800/60 p-2.5 rounded-xl flex items-center justify-between text-xs">
                          <span className="text-slate-400">Controle de Mente:</span>
                          <select 
                            value={agent.status}
                            onChange={(e) => {
                              const next = e.target.value as AgentStatus;
                              setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: next } : a));
                              
                              const now = new Date();
                              const timeStr = now.toTimeString().split(" ")[0];
                              setLogs((prev) => [
                                ...prev,
                                {
                                  id: `log-dynamic-${Date.now()}`,
                                  timestamp: timeStr,
                                  type: "SYNC",
                                  message: `Agente ${agent.name} teve o estado alterado via painel para [${next}].`,
                                }
                              ]);
                            }}
                            className="bg-slate-900 border border-slate-800 text-[11px] rounded px-1.5 py-0.5 text-white"
                          >
                            <option value="SLEEPING">Dormir (Repouso)</option>
                            <option value="WAKING">Despertar</option>
                            <option value="WORKING">Trabalhar (Live)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Instruction de Escopo</p>
                          <div className="p-3 bg-black/30 rounded-xl text-xs text-slate-300 leading-relaxed max-h-24 overflow-y-auto italic">
                            "{agent.instruction}"
                          </div>
                        </div>

                        {/* Assigned tasks counter */}
                        <div className="flex items-center justify-between text-xs border-t border-slate-800/60 pt-3">
                          <span className="text-slate-400">Missões Atribuídas:</span>
                          <span className="font-bold font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded">
                            {assignedTasks.length} ativas
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Orçamento Consumido:</span>
                        <span className="font-extrabold font-mono text-purple-400">${agent.budget.toLocaleString()} / mo</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PRODUCT BLUEPRINT & PO/BA SPECIFICATIONS TAB */}
          {activeTab === "specifications" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border border-indigo-500/20 shadow-xl backdrop-blur-md">
                <div className="flex items-center space-x-3 mb-3">
                  <FileText className="w-6 h-6 text-indigo-400" />
                  <h2 className="text-xl font-bold tracking-tight text-white">Documento Oficial de Engenharia e PO / BA</h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Abaixo está estruturada toda a Proposta de Valor, o Escopo de MVP, os Requisitos Funcionais e as Histórias de Usuário desenhadas pelo analista de negócios sênior da <strong>Rota Labs</strong>. Use este documento para guiar a evolução do orquestrador de agentes.
                </p>
              </div>

              {/* SPECIFICATION CARD ACCORDION SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. VALUE PROP & MVP SCOPE */}
                <div className={`p-6 rounded-2xl ${themeStyles.card} space-y-4`}>
                  <div className="border-b border-slate-800/80 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">SEÇÃO 01</span>
                    <h3 className="font-bold text-lg">Proposta de Valor & Diferencial Competitivo</h3>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed">
                    <p className="text-slate-200">
                      O <strong>Rota Labs Orchestrator</strong> é um centro unificado de coordenação multi-agente projetado para otimizar o processamento autônomo. Em vez de simplesmente disparar prompts isolados, o Orchestrator distribui tarefas complexas no quadro Kanban baseado em escopos de System Instructions precisas de cada agente, balanceando a carga mental de processamento.
                    </p>
                    <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                      <p className="font-bold text-indigo-300 mb-1">Diferencial Competitivo Rota Labs:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        <li>Frequência dinâmica de monitoramento de estado de agentes (Sleeping, Waking, Working).</li>
                        <li>Sincronização de logs assíncrona com emulador de tempo real em console.</li>
                        <li>Gestão financeira integrada por alocação de créditos e custos cognitivos por agente contratado.</li>
                        <li>Ajuste automático de viewport e experiência ágil de design em Mobile ou Desktop.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-b border-slate-800/80 pt-4 pb-3">
                    <h3 className="font-bold text-base">Escopo Completo do MVP</h3>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                    <p>O MVP do Orquestrador cobre os seguintes pilares interativos imediatos:</p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-400">
                      <li><strong className="text-white">Quadro Kanban Interativo:</strong> Transição fluida de missões de To-Do, In Progress, Review e Done.</li>
                      <li><strong className="text-white">Hiring Center Dinâmico:</strong> Contratação e injeção instantânea de novas mentes virtuais no ecossistema com orçamento controlado.</li>
                      <li><strong className="text-white">Console Simulator de Logs:</strong> Motor de simulação de processamento contínuo gerado em tempo real com controle de play/pause.</li>
                      <li><strong className="text-white">Design Multitema Fluido:</strong> Troca instantânea de temas em tempo real atendendo regras estéticas e acessibilidade.</li>
                    </ol>
                  </div>
                </div>

                {/* 2. REQUISITOS FUNCIONAIS (Tabela) */}
                <div className={`p-6 rounded-2xl ${themeStyles.card} space-y-4`}>
                  <div className="border-b border-slate-800/80 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">SEÇÃO 02</span>
                    <h3 className="font-bold text-lg">Tabela de Requisitos Funcionais (MVP)</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2">ID</th>
                          <th className="py-2 px-2">Requisito</th>
                          <th className="py-2 text-right">Prioridade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 text-slate-300">
                        <tr>
                          <td className="py-2.5 font-bold font-mono text-purple-400">RF-001</td>
                          <td className="py-2.5 px-2">Troca de status de missões por movimentação no Kanban ou dropdown.</td>
                          <td className="py-2.5 text-right"><span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px] font-bold">ALTA</span></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold font-mono text-purple-400">RF-002</td>
                          <td className="py-2.5 px-2">Painel de contratação de novos agentes com Name, Cargo, Budget e System Instruction.</td>
                          <td className="py-2.5 text-right"><span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px] font-bold">ALTA</span></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold font-mono text-purple-400">RF-003</td>
                          <td className="py-2.5 px-2">Exibição de logs cíclicos atualizados de forma assíncrona a cada 5 segundos.</td>
                          <td className="py-2.5 text-right"><span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[10px] font-bold">MÉDIA</span></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold font-mono text-purple-400">RF-004</td>
                          <td className="py-2.5 px-2">Controle tátil inferior (Bottom Nav) em mobile e Sidebar recolhível em desktop.</td>
                          <td className="py-2.5 text-right"><span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px] font-bold">ALTA</span></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold font-mono text-purple-400">RF-005</td>
                          <td className="py-2.5 px-2">Menu de configurações para alternância dinâmica entre temas Dark, Light e High Contrast.</td>
                          <td className="py-2.5 text-right"><span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px] font-bold">ALTA</span></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold font-mono text-purple-400">RF-006</td>
                          <td className="py-2.5 px-2">Calculadora de teto financeiro de contratações subtraindo créditos em tempo real.</td>
                          <td className="py-2.5 text-right"><span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-bold">BAIXA</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. HISTÓRIAS DE USUÁRIO FORMATADAS */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
                  <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 font-mono">SEÇÃO 03</span>
                      <h3 className="font-bold text-lg">Histórias de Usuário & Critérios de Aceite (Gherkin/Agile)</h3>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] uppercase font-bold rounded">Padrão Rota Labs</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                    
                    {/* User Story 1 */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                      <div className="flex items-center space-x-2 text-indigo-400">
                        <UserCheck className="w-4 h-4" />
                        <span className="font-bold uppercase tracking-wider font-mono">US-01: CONTRATAÇÃO DE AGENTE</span>
                      </div>
                      <p className="text-slate-200">
                        <strong>Como</strong> gestor do Rota Labs Orchestrator,<br />
                        <strong>Quero</strong> preencher o formulário no Hiring Center,<br />
                        <strong>Para que</strong> um novo agente de IA seja ativado no meu ecossistema de missões.
                      </p>
                      <div className="pt-2 border-t border-slate-800/60 mt-2 text-slate-400 space-y-1">
                        <p className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">Critérios de Aceite:</p>
                        <p>1. O botão "Contratar Agente" deve abrir um modal flutuante imediatamente.</p>
                        <p>2. Os campos Nome, Cargo, System Instruction e Orçamento são validados.</p>
                        <p>3. Ao salvar, o agente é adicionado ao estado de listagem com status "WAKING" (Despertando).</p>
                        <p>4. O orçamento total contratado é subtraído dos créditos do painel lateral em tempo real.</p>
                      </div>
                    </div>

                    {/* User Story 2 */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                      <div className="flex items-center space-x-2 text-pink-400">
                        <CheckSquare className="w-4 h-4" />
                        <span className="font-bold uppercase tracking-wider font-mono">US-02: ALTERAÇÃO DE TAREFA</span>
                      </div>
                      <p className="text-slate-200">
                        <strong>Como</strong> PO ou Desenvolvedor sênior da Rota Labs,<br />
                        <strong>Quero</strong> alterar o status de uma missão de To-Do para In Progress ou Done,<br />
                        <strong>Para que</strong> eu sincronize o progresso visual com o time e os simuladores de IA.
                      </p>
                      <div className="pt-2 border-t border-slate-800/60 mt-2 text-slate-400 space-y-1">
                        <p className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">Critérios de Aceite:</p>
                        <p>1. Cada card no quadro Kanban exibe botões rápidos de direção para mover a tarefa lateralmente.</p>
                        <p>2. Um dropdown em cada card permite reorquestrar o status diretamente para qualquer coluna.</p>
                        <p>3. Qualquer mudança de status gera automaticamente uma linha de log correspondente no terminal inferior.</p>
                        <p>4. Em dispositivos móveis, o usuário consegue alternar as colunas rapidamente através das abas de filtro horizontal.</p>
                      </div>
                    </div>

                    {/* User Story 3 */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                      <div className="flex items-center space-x-2 text-yellow-400">
                        <Terminal className="w-4 h-4" />
                        <span className="font-bold uppercase tracking-wider font-mono">US-03: TERMINAL DE LOGS</span>
                      </div>
                      <p className="text-slate-200">
                        <strong>Como</strong> arquiteto de sistemas autônomos,<br />
                        <strong>Quero</strong> visualizar os logs dinâmicos de processamento neural simulado no console,<br />
                        <strong>Para que</strong> eu audite o comportamento cognitivo das mentes contratadas.
                      </p>
                      <div className="pt-2 border-t border-slate-800/60 mt-2 text-slate-400 space-y-1">
                        <p className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">Critérios de Aceite:</p>
                        <p>1. O console de logs deve ser fixado na base do orquestrador com design em monoespaço de alta legibilidade.</p>
                        <p>2. Um log automático deve surgir a cada 5 segundos simulando ações randômicas dos agentes.</p>
                        <p>3. O usuário pode pausar ou retomar o simulador utilizando o botão de Play/Pause.</p>
                        <p>4. O terminal permite digitação e execução de comandos manuais básicos, como "help", "clear" e "status".</p>
                      </div>
                    </div>

                    {/* User Story 4 */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <Settings className="w-4 h-4" />
                        <span className="font-bold uppercase tracking-wider font-mono">US-04: ALTERNÂNCIA DE TEMAS</span>
                      </div>
                      <p className="text-slate-200">
                        <strong>Como</strong> usuário com necessidades específicas de acessibilidade ou fadiga visual,<br />
                        <strong>Quero</strong> mudar o tema visual do orquestrador para claro ou alto contraste,<br />
                        <strong>Para que</strong> eu adapte o contraste e as cores ao meu ambiente atual de trabalho.
                      </p>
                      <div className="pt-2 border-t border-slate-800/60 mt-2 text-slate-400 space-y-1">
                        <p className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">Critérios de Aceite:</p>
                        <p>1. Menu de configurações deve apresentar de forma limpa as opções de temas: Dark, Light, e High Contrast.</p>
                        <p>2. A troca de tema altera instantaneamente as classes do elemento-raiz do orquestrador, atualizando cores, bordas, fontes e sombras.</p>
                        <p>3. O tema selecionado pelo usuário é persistido automaticamente no localStorage do navegador para carregamento posterior.</p>
                        <p>4. No tema de High Contrast, todo o gradiente é substituído por bordas sólidas pretas/brancas e cores de texto vibrantes e legíveis.</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SYSTEM SETTINGS & THEMES TAB */}
          {activeTab === "settings" && (
            <div className={`p-6 rounded-2xl ${themeStyles.card} max-w-2xl mx-auto space-y-6`}>
              <div>
                <h2 className="text-lg font-bold">Personalização Estética e Temas</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Selecione o tema de interface que melhor se adequa ao seu fluxo de trabalho de orquestração cognitiva.
                </p>
              </div>

              {/* THEME SECTOR CONTROLLER */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* DARK THEME SELECTION */}
                <button
                  onClick={() => handleThemeChange("DARK")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    theme === "DARK" 
                      ? "border-purple-500 bg-purple-950/15 ring-2 ring-purple-500/30" 
                      : "border-slate-800 hover:bg-slate-900/35"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="font-bold text-sm flex items-center">
                      <Moon className="w-4 h-4 mr-1.5 text-purple-400" />
                      Slate Dark (Padrão)
                    </span>
                    {theme === "DARK" && <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Fundo Slate profundo com glows sutis de neon, perfeito para longas sessões de orquestração noturna.
                  </p>
                </button>

                {/* LIGHT THEME SELECTION */}
                <button
                  onClick={() => handleThemeChange("LIGHT")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    theme === "LIGHT" 
                      ? "border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20 text-slate-900" 
                      : "border-slate-800 hover:bg-slate-900/35"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="font-bold text-sm flex items-center">
                      <Sun className="w-4 h-4 mr-1.5 text-amber-500" />
                      Daylight White
                    </span>
                    {theme === "LIGHT" && <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Fundo claro e moderno com contraste acentuado e sombras suaves, ideal para salas claras de escritório.
                  </p>
                </button>

                {/* HIGH CONTRAST SELECTION */}
                <button
                  onClick={() => handleThemeChange("HIGH_CONTRAST")}
                  className={`p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all ${
                    theme === "HIGH_CONTRAST" 
                      ? "border-yellow-400 bg-black text-white" 
                      : "border-slate-800 hover:bg-slate-900/35"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="font-bold text-sm flex items-center">
                      <Sliders className="w-4 h-4 mr-1.5 text-yellow-400" />
                      High Contrast Mono
                    </span>
                    {theme === "HIGH_CONTRAST" && <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>}
                  </div>
                  <p className="text-[11px] text-yellow-300 leading-relaxed">
                    Visual preto puro em monocompacto, bordas bem marcadas e texto amarelo, ideal para leitura com acessibilidade crítica.
                  </p>
                </button>

              </div>

              {/* SIMULATED SYSTEM ENVIRONMENT PREFERENCES */}
              <div className="border-t border-slate-800/80 pt-6 space-y-4 text-xs">
                <h4 className="font-bold">Preferências do Servidor Rota Labs</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Frequência do Emulador de Logs</span>
                    <select className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white">
                      <option>A cada 5 segundos (Padrão)</option>
                      <option>A cada 10 segundos</option>
                      <option>Apenas manual</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block">Região de Orquestração Cognitiva</span>
                    <select className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white" disabled>
                      <option>US-EAST-1 (Rota Server Cluster)</option>
                      <option>SA-EAST-1 (São Paulo Edge)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/80 flex items-start space-x-3 text-[11px] text-slate-400 leading-relaxed">
                  <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    Os ajustes visuais selecionados acima alteram a folha de estilos integrada e as classes do dashboard do <strong>Rota Labs Orchestrator</strong> em tempo real. As alterações de simulação cognitiva salvam as suas preferências localmente.
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* LIVE SIMULATION TERMINAL BOTTOM PANEL */}
        <div className={`shrink-0 p-4 font-mono flex flex-col border-t ${themeStyles.terminalBg}`}>
          
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center space-x-3 text-[10px] uppercase font-bold text-slate-400">
              <span className="flex items-center text-blue-400">
                <span className={`w-2.5 h-2.5 rounded-full mr-2 bg-blue-500 ${isLogRunning ? "animate-pulse" : ""}`}></span>
                ● LIVE COGNITIVE SIMULATOR
              </span>
              <span>•</span>
              <span>Vazão: 4.86 task/sec</span>
              <span>•</span>
              <span>Cluster: XR-921</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsLogRunning(!isLogRunning)}
                className="p-1 px-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded text-[10px] uppercase font-bold flex items-center space-x-1 transition-all"
                title={isLogRunning ? "Pausar Logs" : "Retomar Logs"}
              >
                {isLogRunning ? (
                  <>
                    <Pause className="w-3 h-3 text-amber-400 mr-1" /> Pausar Emulação
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-emerald-400 mr-1" /> Retomar Emulação
                  </>
                )}
              </button>
              
              <button
                onClick={() => setLogs([])}
                className="p-1 px-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded text-[10px] uppercase font-bold transition-all"
              >
                Clear
              </button>
            </div>
          </div>

          {/* LOG CONTAINER ROW */}
          <div className="bg-black/60 rounded-xl p-3 h-36 overflow-y-auto border border-slate-800/60 flex flex-col space-y-1.5 scroll-smooth text-[11px] leading-relaxed">
            {logs.length === 0 ? (
              <p className="text-slate-500 italic text-center my-auto">Sem logs carregados. Digite um comando ou espere a emulação iniciar.</p>
            ) : (
              logs.map((log) => {
                let badgeColor = "text-blue-400";
                if (log.type === "SUCCESS") badgeColor = "text-emerald-400";
                if (log.type === "ERROR") badgeColor = "text-red-500 font-extrabold";
                if (log.type === "SYNC") badgeColor = "text-purple-400";
                if (log.type === "TASK") badgeColor = "text-pink-400";

                return (
                  <div key={log.id} className="flex items-start space-x-2 border-b border-white/5 pb-1 font-mono hover:bg-white/5 px-1 rounded transition-all">
                    <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                    <span className={`uppercase font-bold shrink-0 select-none [${badgeColor}]`}>[{log.type}]</span>
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                );
              })
            )}
            <div ref={terminalBottomRef} />
          </div>

          {/* TERMINAL INPUT FOR INTERACTIVE COMMANDS */}
          <form onSubmit={handleTerminalSubmit} className="mt-2 flex items-center bg-black/80 rounded-lg overflow-hidden border border-slate-800/80">
            <span className="pl-3 pr-1 text-slate-500 font-mono text-xs select-none">orchestrator@rotalabs:~#</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Digite um comando terminal (ex: 'help', 'status', 'agents', 'hire', 'pause')..."
              className="flex-1 bg-transparent border-0 outline-none p-2 text-xs font-mono text-white placeholder-slate-600 focus:ring-0"
            />
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] uppercase font-bold p-2 px-4 transition-all"
            >
              Exec
            </button>
          </form>

        </div>

      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-16 z-20 flex items-center justify-around px-4 ${themeStyles.navBottomBg}`}>
        <button
          onClick={() => setActiveTab("orchestrator")}
          className={`flex flex-col items-center justify-center space-y-1 ${
            activeTab === "orchestrator" ? "text-purple-500" : "text-slate-400"
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-bold">Orchestrator</span>
        </button>

        <button
          onClick={() => setActiveTab("agents")}
          className={`flex flex-col items-center justify-center space-y-1 ${
            activeTab === "agents" ? "text-purple-500" : "text-slate-400"
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold">Agentes</span>
        </button>

        <button
          onClick={() => setActiveTab("specifications")}
          className={`flex flex-col items-center justify-center space-y-1 ${
            activeTab === "specifications" ? "text-purple-500" : "text-slate-400"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold">Specs</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center justify-center space-y-1 ${
            activeTab === "settings" ? "text-purple-500" : "text-slate-400"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>

      {/* HIRING CENTER MODAL (ADD NEW AGENT FORM) */}
      {isHiringModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl overflow-hidden border p-6 space-y-4 shadow-2xl ${themeStyles.card}`}>
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#7C3AED]" />
                <h3 className="font-extrabold text-base md:text-lg">Hiring Center - Contratação de Agentes</h3>
              </div>
              <button 
                onClick={() => setIsHiringModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/80 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleHireAgentSubmit} className="space-y-4 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="block font-bold text-slate-300">Nome do Agente Virtual <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={hiringForm.name}
                  onChange={(e) => setHiringForm({...hiringForm, name: e.target.value})}
                  placeholder="Ex: Evelyn Rota, Atlas Bot, Nova Pen..."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">Cargo / Função <span className="text-red-400">*</span></label>
                  <select
                    value={hiringForm.role}
                    onChange={(e) => setHiringForm({...hiringForm, role: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white outline-none"
                  >
                    <option value="CEO & Orchestrator">CEO & Orchestrator</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="Copywriter & Marketing">Copywriter & Marketing</option>
                    <option value="UX Designer">UX Designer</option>
                    <option value="Legal Agent">Legal Agent</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">Orçamento Mensal ($) <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    min="500"
                    max="10000"
                    required
                    value={hiringForm.budget}
                    onChange={(e) => setHiringForm({...hiringForm, budget: Number(e.target.value) || 0})}
                    placeholder="Alocação em $"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">System Instruction de Escopo <span className="text-red-400">*</span></label>
                <textarea
                  required
                  rows={3}
                  value={hiringForm.instruction}
                  onChange={(e) => setHiringForm({...hiringForm, instruction: e.target.value})}
                  placeholder="Descreva as diretrizes comportamentais e responsabilidade técnica que este agente virtual obedecerá ao receber uma missão..."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              <div className="bg-purple-950/20 border border-purple-500/20 p-3 rounded-xl text-[11px] leading-relaxed text-slate-400">
                ⚠️ A contratação consome créditos disponíveis instantaneamente. O agente entrará por padrão em modo "WAKING" (Despertando), carregando seus pesos neuronais na memória de orquestração.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsHiringModalOpen(false)}
                  className={`px-4 py-2 rounded-xl font-bold ${themeStyles.buttonSecondary}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-bold ${themeStyles.buttonPrimary}`}
                >
                  Confirmar Contratação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW TASK MODAL */}
      {isCreateTaskOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl overflow-hidden border p-6 space-y-4 shadow-2xl ${themeStyles.card}`}>
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-base md:text-lg">Nova Missão para os Agentes</h3>
              </div>
              <button 
                onClick={() => setIsCreateTaskOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/80 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="block font-bold text-slate-300">Título da Missão <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="Descreva o que o agente deve construir ou auditar..."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">Agente Responsável</label>
                  <select
                    value={taskForm.agentId}
                    onChange={(e) => setTaskForm({...taskForm, agentId: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white outline-none"
                  >
                    <option value="">Selecione um agente...</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.role.split(" ")[0]})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">Prioridade</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value as Priority})}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white outline-none"
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                    <option value="URGENT">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">Coluna Inicial</label>
                <select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({...taskForm, status: e.target.value as TaskStatus})}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white outline-none"
                >
                  <option value="TO_DO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Review</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateTaskOpen(false)}
                  className={`px-4 py-2 rounded-xl font-bold ${themeStyles.buttonSecondary}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-bold ${themeStyles.buttonPrimary}`}
                >
                  Criar Missão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponents helper to prevent card clutter
interface TaskCardProps {
  key?: string;
  task: Task;
  agents: Agent[];
  themeStyles: any;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "left" | "right") => void;
  onChangeStatus: (id: string, next: TaskStatus) => void;
}

function TaskCard({ task, agents, themeStyles, onDelete, onMove, onChangeStatus }: TaskCardProps) {
  const responsibleAgent = agents.find(a => a.id === task.agentId);

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case "LOW":
        return <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${themeStyles.badgeLow}`}>Low</span>;
      case "HIGH":
        return <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${themeStyles.badgeHigh}`}>High</span>;
      case "URGENT":
        return <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${themeStyles.badgeUrgent}`}>Urgent</span>;
      case "MEDIUM":
      default:
        return <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${themeStyles.badgeMed}`}>Medium</span>;
    }
  };

  return (
    <div className={`p-4 rounded-xl border relative group transition-all duration-300 ${
      task.status === "IN_PROGRESS" 
        ? "bg-indigo-950/15 border-[#7C3AED]/40 shadow-[inset_0_0_15px_rgba(124,58,237,0.05)]" 
        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80"
    }`}>
      
      {/* Delete / Operations */}
      <div className="flex items-center justify-between mb-2">
        {getPriorityBadge(task.priority)}
        <button 
          onClick={() => onDelete(task.id)}
          className="opacity-60 hover:opacity-100 hover:text-red-400 p-1 rounded transition-all"
          title="Deletar missão"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs font-semibold leading-relaxed mb-3">{task.title}</p>

      {/* Agent details */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/60 text-[11px]">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[8px] text-white">
            {responsibleAgent?.name.substring(0, 2).toUpperCase() || "A"}
          </div>
          <span>Agent: {responsibleAgent?.name.split(" ")[0] || "Ninguém"}</span>
        </div>
      </div>

      {/* Movement & Dropdown controller block */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/40 flex items-center justify-between gap-1">
        {/* Left move */}
        <button
          onClick={() => onMove(task.id, "left")}
          className="p-1 bg-slate-800/60 hover:bg-slate-700 text-slate-300 rounded text-xs transition-all cursor-pointer"
          title="Mover para esquerda"
          disabled={task.status === "TO_DO"}
        >
          <ArrowLeft className="w-3 h-3" />
        </button>

        {/* Dynamic Select Status Controller */}
        <select 
          value={task.status}
          onChange={(e) => onChangeStatus(task.id, e.target.value as TaskStatus)}
          className="bg-slate-900 border border-slate-800 text-[9px] rounded px-1.5 py-0.5 text-white flex-1 cursor-pointer"
        >
          <option value="TO_DO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="DONE">Done</option>
        </select>

        {/* Right move */}
        <button
          onClick={() => onMove(task.id, "right")}
          className="p-1 bg-slate-800/60 hover:bg-slate-700 text-slate-300 rounded text-xs transition-all cursor-pointer"
          title="Mover para direita"
          disabled={task.status === "DONE"}
        >
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
}

function AgentStatusBadge({ status }: { status: AgentStatus }) {
  switch (status) {
    case "WORKING":
      return (
        <span className="flex items-center space-x-1 bg-purple-500/20 text-purple-400 border border-purple-500/40 px-2 py-1 rounded text-[9px] font-extrabold uppercase animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
          <span>WORKING</span>
        </span>
      );
    case "WAKING":
      return (
        <span className="flex items-center space-x-1 bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-1 rounded text-[9px] font-extrabold uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
          <span>WAKING</span>
        </span>
      );
    case "SLEEPING":
    default:
      return (
        <span className="flex items-center space-x-1 bg-slate-800 text-slate-400 border border-slate-700 px-2 py-1 rounded text-[9px] font-bold uppercase">
          <span>SLEEPING</span>
        </span>
      );
  }
}
