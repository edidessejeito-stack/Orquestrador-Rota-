import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
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
  RefreshCw,
  Activity,
  Cpu,
  TrendingUp
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
  const [activeTab, setActiveTab] = useState<"orchestrator" | "live" | "agents" | "specifications" | "settings">("orchestrator");
  const [mobileKanbanTab, setMobileKanbanTab] = useState<TaskStatus>("TO_DO");

  // Deletion Confirmation States
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

  // Lazy-load collapsible/expandable states
  const [expandedAgentIds, setExpandedAgentIds] = useState<string[]>([]);
  const [expandedUserStories, setExpandedUserStories] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(["section1"]); // only Section 1 is open by default, Section 2 & 3 are collapsed!
  const [isMiniAgentsExpanded, setIsMiniAgentsExpanded] = useState(false);

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
  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem("rota_labs_agents");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing agents from localStorage", e);
      }
    }
    return [
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
    ];
  });

  // Tasks board state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("rota_labs_tasks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing tasks from localStorage", e);
      }
    }
    return [
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
    ];
  });

  // Automatic persistence in localStorage
  useEffect(() => {
    localStorage.setItem("rota_labs_agents", JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem("rota_labs_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Histórico de missões concluídas por agent ao longo do tempo (Dados do gráfico de linhas)
  const [performanceData, setPerformanceData] = useState([
    { name: "Semana 1", "Evelyn Rota": 2, "Atlas Bot": 3, "Nova Pen": 1 },
    { name: "Semana 2", "Evelyn Rota": 3, "Atlas Bot": 5, "Nova Pen": 3 },
    { name: "Semana 3", "Evelyn Rota": 4, "Atlas Bot": 8, "Nova Pen": 4 },
    { name: "Semana 4", "Evelyn Rota": 5, "Atlas Bot": 10, "Nova Pen": 6 },
    { name: "Semana 5", "Evelyn Rota": 6, "Atlas Bot": 12, "Nova Pen": 8 },
  ]);

  // Paperclips Orchestrator Simulation states (Universal Paperclips inspired layout & metrics)
  const [clipsComputed, setClipsComputed] = useState(142500);
  const [operationPrice, setOperationPrice] = useState(0.25);
  const [unsoldInventory, setUnsoldInventory] = useState(420);
  const [processors, setProcessors] = useState(1);
  const [memoryGb, setMemoryGb] = useState(16);
  const [operationsStored, setOperationsStored] = useState(1000);
  const [maxOperations, setMaxOperations] = useState(1000);
  const [marketingLevel, setMarketingLevel] = useState(1);
  const [clipDemand, setClipDemand] = useState(45); // Public Demand %

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "log-1",
      timestamp: "12:04:15",
      type: "INFO",
      message: "Sistema Orchestrator inicializado com sucesso.",
    },
    {
      id: "log-2",
      timestamp: "12:04:22",
      type: "SYNC",
      message: "Atlas Bot carregou o módulo auth-validator-v3 (83ms).",
    },
    {
      id: "log-3",
      timestamp: "12:04:31",
      type: "TASK",
      message: "Nova Pen iniciou a redação de copy de alta conversão para o launcher da Rota Labs.",
    },
    {
      id: "log-4",
      timestamp: "12:04:35",
      type: "SUCCESS",
      message: "Missão 'Dockerizar Agentes Orquestradores Principais para deploy' movida para o status [CONCLUÍDO].",
    }
  ]);
  const [isLogRunning, setIsLogRunning] = useState(true);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const bottomTerminalBottomRef = useRef<HTMLDivElement>(null);

  // Financial status states
  const totalBudgetLimit = 100000;
  const initialHiringCredits = 12450;
  const [availableFunds, setAvailableFunds] = useState(1950); // initial: 12450 - (5000 + 3500 + 2000)
  const totalSpent = agents.reduce((acc, current) => acc + current.budget, 0);
  const hiringCreditsRemaining = availableFunds;

  // Auto scroll terminal (only when Live tab is active to avoid disrupting other pages)
  useEffect(() => {
    if (activeTab === "live") {
      if (terminalBottomRef.current) {
        terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
      if (bottomTerminalBottomRef.current) {
        bottomTerminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [logs, activeTab]);

  // Preset live logs to generate
  const logPool = [
    { type: "INFO" as const, message: "Verificação de recursos do sistema: Carga cognitiva em 42%, todos os processos saudáveis." },
    { type: "TASK" as const, message: "CEO Agent Evelyn Rota realiza auditoria de segurança em webhooks externos." },
    { type: "SYNC" as const, message: "Sincronizando vetores de estado entre 3 sub-agents para evitar colisões lógicas." },
    { type: "SUCCESS" as const, message: "Senior Dev Atlas Bot corrigiu 4 erros de tipo potenciais nos endpoints de usuários." },
    { type: "ERROR" as const, message: "Aviso: Alto consumo de memória no microsserviço 'node-agent-executor'." },
    { type: "INFO" as const, message: "Rota Labs Orchestrator: Balanceamento de carga cognitiva automático concluído." },
    { type: "TASK" as const, message: "Copywriter Agent Nova Pen gerou 3 slogans alternativos para a página de preços." },
    { type: "SUCCESS" as const, message: "Integridade do código de auth-validator-v3 verificada com 100% de cobertura de testes." },
    { type: "SYNC" as const, message: "Parâmetros neurais consolidados através dos limites de contexto do modelo." },
    { type: "INFO" as const, message: "Latência de leitura do banco de dados minimizada: cache hit de 4ms com taxa de 99.2%." },
    { type: "TASK" as const, message: "Atlas Bot inicializou a análise de código local para integração de Webhook do Stripe." },
  ];

  // Simulated live logs addition
  useEffect(() => {
    if (activeTab !== "live") return;
    if (!isLogRunning) return;

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];

      setLogs((prev) => [
        ...prev,
        {
          id: `log-dynamic-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
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
  }, [isLogRunning, activeTab]);

  // Universal Paperclips Incremental Simulation Loop
  useEffect(() => {
    if (activeTab !== "live") return;
    const interval = setInterval(() => {
      // Calculate active working agents
      const activeWorkingAgents = agents.filter(a => a.status === "WORKING").length;
      
      // Calculate max operations storage
      const currentMaxOps = 1000 + memoryGb * 100;
      setMaxOperations(currentMaxOps);

      // Generate operations via processors
      setOperationsStored(prev => {
        const generation = Math.floor(processors * (3 + activeWorkingAgents * 2));
        return Math.min(currentMaxOps, prev + generation);
      });

      // Calculate Public Demand based on marketing and price
      const demand = Math.max(1, Math.round((marketingLevel * 45) / (operationPrice * 4)));
      setClipDemand(demand);

      // Production Rate (Clips Manufactured per cycle)
      // Even if no agents are working, user can manual-compute or get a trickle of 1 clip per cycle
      const clipProductionRate = activeWorkingAgents > 0 
        ? Math.floor((activeWorkingAgents * 2 + 1) * processors * (2 + Math.random()))
        : 1;

      // Update total computed clips and unsold inventory
      setClipsComputed(prev => prev + clipProductionRate);
      setUnsoldInventory(prev => prev + clipProductionRate);

      // Sell Unsold Inventory based on public demand
      setUnsoldInventory(prev => {
        if (prev <= 0) return 0;
        
        const clipsSold = Math.min(prev, Math.floor(demand * (1.2 + Math.random())));
        if (clipsSold > 0) {
          const revenue = Number((clipsSold * operationPrice).toFixed(2));
          setAvailableFunds(funds => Number((funds + revenue).toFixed(2)));
          
          // Occasional logging
          if (Math.random() < 0.12) {
            const now = new Date();
            const timeStr = now.toTimeString().split(" ")[0];
            setLogs(logsPrev => [
              ...logsPrev.slice(-30), // Prevent memory bloat by capping log array
              {
                id: `log-sale-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                timestamp: timeStr,
                type: "SUCCESS",
                message: `Orquestrador vendeu ${clipsSold} clipes de dados por $${revenue.toFixed(2)}. Fundos atualizados.`,
              }
            ]);
          }
        }
        return Math.max(0, prev - clipsSold);
      });

    }, 1500);

    return () => clearInterval(interval);
  }, [agents, processors, memoryGb, marketingLevel, operationPrice, activeTab]);

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
      id: `agent-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
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
        id: `log-dynamic-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
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
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
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
        id: `log-dynamic-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
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

  // Helper para atualizar histórico de missões concluídas no gráfico de linhas
  const updatePerformanceHistory = (agentId: string, delta: number) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    
    setPerformanceData(prev => {
      const copy = [...prev];
      if (copy.length === 0) return prev;
      const lastIndex = copy.length - 1;
      const currentVal = copy[lastIndex][agent.name] || 0;
      copy[lastIndex] = {
        ...copy[lastIndex],
        [agent.name]: Math.max(0, currentVal + delta)
      };
      return copy;
    });
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
                  id: `log-dynamic-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                  timestamp: timeStr,
                  type: "SYNC",
                  message: `Missão '${t.title}' alterada de [${t.status}] para [${nextStatus}].`,
                }
              ]);
            }, 50);

            // Atualizar histórico de performance
            if (nextStatus === "DONE") {
              updatePerformanceHistory(t.agentId, 1);
            } else if (t.status === "DONE") {
              updatePerformanceHistory(t.agentId, -1);
            }
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
                  id: `log-dynamic-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                  timestamp: timeStr,
                  type: "SYNC",
                  message: `Missão '${t.title}' reorquestrada manualmente para o status [${newStatus}].`,
                }
              ]);
            }, 50);

            // Atualizar histórico de performance
            if (newStatus === "DONE") {
              updatePerformanceHistory(t.agentId, 1);
            } else if (t.status === "DONE") {
              updatePerformanceHistory(t.agentId, -1);
            }
          }
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  // Delete task helper (intercepts to show modal)
  const deleteTask = (taskId: string) => {
    const foundTask = tasks.find(t => t.id === taskId);
    if (foundTask) {
      setTaskToDelete(foundTask);
    }
  };

  // Real deletion execution
  const confirmDeleteTask = (taskId: string) => {
    const foundTask = tasks.find(t => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setLogs((prev) => [
      ...prev,
      {
        id: `log-dynamic-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: timeStr,
        type: "ERROR",
        message: `Missão deletada permanentemente: '${foundTask?.title || taskId}'.`,
      }
    ]);
  };

  // Demitir/Dismiss agent helper
  const dismissAgent = (agentId: string) => {
    const foundAgent = agents.find(a => a.id === agentId);
    if (!foundAgent) return;

    // Refund their hiring budget
    setAvailableFunds(prev => prev + foundAgent.budget);

    // Remove agent
    setAgents(prev => prev.filter(a => a.id !== agentId));

    // Reassign active tasks of dismissed agent to "Ninguém" (unassigned)
    setTasks(prev => prev.map(t => t.agentId === agentId ? { ...t, agentId: "" } : t));

    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setLogs((prev) => [
      ...prev,
      {
        id: `log-dismiss-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: timeStr,
        type: "ERROR",
        message: `Agente demitido: '${foundAgent.name}'. Alocação de $${foundAgent.budget} reembolsada aos créditos de contratação.`,
      }
    ]);
  };

  // Zerar e limpar toda a base de testes para iniciar do zero
  const handleResetAll = () => {
    setTasks([]);
    setAgents([]);
    setLogs([
      {
        id: `log-reset-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date().toTimeString().split(" ")[0],
        type: "INFO",
        message: "Orchestrator zerado com sucesso. Todos os agents e missões de teste foram limpos.",
      }
    ]);
    setPerformanceData([
      { name: "Semana 1" },
      { name: "Semana 2" },
      { name: "Semana 3" },
      { name: "Semana 4" },
      { name: "Semana 5" },
    ]);
    // Reset Paperclip state
    setClipsComputed(0);
    setUnsoldInventory(0);
    setAvailableFunds(12450); // Restore full hiring credits pool
    setProcessors(1);
    setMemoryGb(16);
    setOperationsStored(0);
    setMarketingLevel(1);
  };

  // Restaurar dados de demonstração completos
  const handleRestoreDemoData = () => {
    setAgents([
      {
        id: "agent-1",
        name: "Evelyn Rota",
        role: "CEO & Orchestrator",
        status: "WORKING",
        instruction: "Coordenadora principal dos sistemas da Rota Labs, resolvendo gargalos lógicos.",
        budget: 5000,
        avatarBg: "from-purple-600 to-pink-500",
      },
      {
        id: "agent-2",
        name: "Atlas Bot",
        role: "Senior Dev",
        status: "WAKING",
        instruction: "Agente de otimização de arquitetura de microsserviços Rust, TypeScript e segurança.",
        budget: 3500,
        avatarBg: "from-blue-600 to-indigo-500",
      },
      {
        id: "agent-3",
        name: "Nova Pen",
        role: "Copywriter & Marketing",
        status: "SLEEPING",
        instruction: "Especialista em redação persuasiva (copy), SEO e roteiros de campanhas virais.",
        budget: 2000,
        avatarBg: "from-pink-500 to-rose-400",
      }
    ]);

    setTasks([
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

    setLogs([
      {
        id: `log-demo-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date().toTimeString().split(" ")[0],
        type: "SUCCESS",
        message: "Dados de demonstração do Orchestrator restaurados com sucesso.",
      }
    ]);

    setPerformanceData([
      { name: "Semana 1", "Evelyn Rota": 2, "Atlas Bot": 3, "Nova Pen": 1 },
      { name: "Semana 2", "Evelyn Rota": 3, "Atlas Bot": 5, "Nova Pen": 3 },
      { name: "Semana 3", "Evelyn Rota": 4, "Atlas Bot": 8, "Nova Pen": 4 },
      { name: "Semana 4", "Evelyn Rota": 5, "Atlas Bot": 10, "Nova Pen": 6 },
      { name: "Semana 5", "Evelyn Rota": 6, "Atlas Bot": 12, "Nova Pen": 8 },
    ]);

    // Restore Paperclip state
    setClipsComputed(142500);
    setUnsoldInventory(420);
    setAvailableFunds(1950); // Rest of funds
    setProcessors(1);
    setMemoryGb(16);
    setOperationsStored(1000);
    setMarketingLevel(1);
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
        id: `log-cmd-input-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: timeStr,
        type: "INFO",
        message: `> ${terminalInput}`,
      },
      {
        id: `log-cmd-reply-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
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
            Orquestrador
          </button>

          <button
            onClick={() => setActiveTab("live")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium text-left relative ${
              activeTab === "live" ? themeStyles.sidebarLinkActive : themeStyles.sidebarLinkInactive
            }`}
          >
            <Activity className="w-5 h-5 mr-3 text-red-500" />
            <span>Painel Live</span>
            <span className="absolute right-4 top-4 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("agents")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium text-left ${
              activeTab === "agents" ? themeStyles.sidebarLinkActive : themeStyles.sidebarLinkInactive
            }`}
          >
            <Users className="w-5 h-5 mr-3 text-purple-500" />
            Agentes Ativos
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
            Configurações & Temas
          </button>
        </nav>

        {/* Sidebar Footer Info */}
        <div className="mt-auto pt-6 border-t border-slate-800/40">
          <div className={`p-4 rounded-2xl ${themeStyles.statOverlay}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Créditos de Contratação</p>
            <div className="flex items-end justify-between">
              <span className="text-xl font-extrabold font-mono">${hiringCreditsRemaining.toLocaleString()}</span>
              <span className="text-xs text-emerald-400 font-bold">Ativo</span>
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

              {/* COMPACT FULL-WIDTH SYSTEM BOARD */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* COL-1: UNIVERSAL PAPERCLIP ORCHESTRATOR PANEL (width 4/12) - Hidden here, moved to dedicated Live tab */}
                <div className="hidden">
                  <div className={`p-6 rounded-2xl ${themeStyles.card} space-y-5 font-mono`}>
                    <div className="border-b border-slate-800/80 pb-3">
                      <h3 className="text-sm font-bold flex items-center text-slate-200">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2.5 animate-pulse"></span>
                        PAPERCLIP ORCHESTRATOR v2.1
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Sincronizador de Lógica de Silício & Demanda</p>
                    </div>

                    {/* CLIPS COMPUTED STAT */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Clipes Fabricados:</span>
                        <span className="text-2xl font-extrabold text-white animate-pulse">{clipsComputed.toLocaleString()}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setClipsComputed(prev => prev + 1);
                          setUnsoldInventory(prev => prev + 1);
                        }}
                        className="w-full py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-mono text-xs font-bold rounded-xl transition-all cursor-pointer select-none active:translate-y-0.5"
                      >
                        [ Manufaturar Clipe de Dados ]
                      </button>
                    </div>

                    <hr className="border-slate-800/80" />

                    {/* BUSINESS SECTION */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/40 pb-1">Negócios (Business)</h4>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Fundos Disponíveis:</span>
                        <span className="font-extrabold text-emerald-400 font-mono">${availableFunds.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Estoque de Clipes:</span>
                        <span className="font-bold text-slate-300 font-mono">{unsoldInventory.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Preço por Unidade:</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setOperationPrice(prev => Math.max(0.01, Number((prev - 0.01).toFixed(2))))}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] text-white rounded font-bold transition-all cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-bold font-mono text-slate-200">${operationPrice.toFixed(2)}</span>
                          <button
                            onClick={() => setOperationPrice(prev => Number((prev + 0.01).toFixed(2)))}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] text-white rounded font-bold transition-all cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Demanda Pública:</span>
                        <span className="font-bold text-slate-300 font-mono">{clipDemand}%</span>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <div className="flex flex-col">
                          <span className="text-slate-500">Marketing (Lvl {marketingLevel}):</span>
                          <span className="text-[9px] text-slate-500 font-bold">Custo: ${(marketingLevel * 150).toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => {
                            const cost = marketingLevel * 150;
                            if (availableFunds >= cost) {
                              setAvailableFunds(prev => Number((prev - cost).toFixed(2)));
                              setMarketingLevel(prev => prev + 1);
                              
                              const now = new Date();
                              const timeStr = now.toTimeString().split(" ")[0];
                              setLogs(l => [
                                ...l,
                                {
                                  id: `log-marketing-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                                  timestamp: timeStr,
                                  type: "SUCCESS",
                                  message: `Upgrade de Marketing comprado! Nível atual: Lvl ${marketingLevel + 1}.`,
                                }
                              ]);
                            } else {
                              alert("Fundos insuficientes para upgrade de marketing!");
                            }
                          }}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-[10px] text-slate-300 rounded-lg cursor-pointer"
                        >
                          [ Upgrade ]
                        </button>
                      </div>
                    </div>

                    <hr className="border-slate-800/80" />

                    {/* COMPUTATIONAL RESOURCES SECTION */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/40 pb-1">Recursos de Computação</h4>
                      
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex flex-col">
                          <span className="text-slate-500">Processadores ({processors}):</span>
                          <span className="text-[9px] text-slate-500 font-bold">Custo: ${(processors * 250).toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => {
                            const cost = processors * 250;
                            if (availableFunds >= cost) {
                              setAvailableFunds(prev => Number((prev - cost).toFixed(2)));
                              setProcessors(prev => prev + 1);
                              
                              const now = new Date();
                              const timeStr = now.toTimeString().split(" ")[0];
                              setLogs(l => [
                                ...l,
                                {
                                  id: `log-processor-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                                  timestamp: timeStr,
                                  type: "SYNC",
                                  message: `Novo Processador CPU ativado! Capacidade de computação aumentada para x${processors + 1}.`,
                                }
                              ]);
                            } else {
                              alert("Créditos insuficientes para adicionar processador!");
                            }
                          }}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-[10px] text-slate-300 rounded-lg cursor-pointer"
                        >
                          [ Comprar CPU ]
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <div className="flex flex-col">
                          <span className="text-slate-500">Memória RAM ({memoryGb}GB):</span>
                          <span className="text-[9px] text-slate-500 font-bold">Custo: ${(memoryGb * 20).toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => {
                            const cost = memoryGb * 20;
                            if (availableFunds >= cost) {
                              setAvailableFunds(prev => Number((prev - cost).toFixed(2)));
                              setMemoryGb(prev => prev + 16);
                              
                              const now = new Date();
                              const timeStr = now.toTimeString().split(" ")[0];
                              setLogs(l => [
                                ...l,
                                {
                                  id: `log-memory-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                                  timestamp: timeStr,
                                  type: "SYNC",
                                  message: `Memória RAM aprimorada! Buffer máximo de operações expandido para ${(1000 + (memoryGb + 16) * 100).toLocaleString()}.`,
                                }
                              ]);
                            } else {
                              alert("Créditos insuficientes para adicionar RAM!");
                            }
                          }}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-[10px] text-slate-300 rounded-lg cursor-pointer"
                        >
                          [ Comprar RAM ]
                        </button>
                      </div>

                      {/* OPERATIONS PROGRESS BAR */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">Operações Armazenadas:</span>
                          <span className="font-bold text-blue-400">{operationsStored.toLocaleString()} / {maxOperations.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300" 
                            style={{ width: `${(operationsStored / maxOperations) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* COMPUTATIONAL UPGRADE ACTION */}
                      <button
                        onClick={() => {
                          if (operationsStored >= 800) {
                            setOperationsStored(prev => prev - 800);
                            setAvailableFunds(prev => prev + 1000); // Give 1000 credits as a big reward!
                            
                            const now = new Date();
                            const timeStr = now.toTimeString().split(" ")[0];
                            setLogs(l => [
                              ...l,
                              {
                                id: `log-upgrade-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                                timestamp: timeStr,
                                type: "SUCCESS",
                                message: "Algoritmo de Silício Coerente Computado! Recompensa de $1.000 concedida ao Orquestrador.",
                              }
                            ]);
                            alert("Sucesso! Upgrade computado. Recompensa de $1.000 créditos depositada.");
                          } else {
                            alert(`Operações insuficientes! Custo: 800 operações (Você possui ${operationsStored}).`);
                          }
                        }}
                        className="w-full py-2 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 hover:brightness-110 text-blue-300 text-xs rounded-xl transition-all cursor-pointer active:translate-y-0.5 mt-2 flex items-center justify-center gap-1.5"
                      >
                        <span>[ Computar Upgrade de Algoritmo ]</span>
                        <span className="text-[9px] bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-400 font-extrabold border border-blue-500/20">800 Ops</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* COL-2: AGILE SYSTEM BOARD (width 12/12) */}
                <div className="lg:col-span-12 space-y-6">
                  
                  {/* DYNAMIC KANBAN BOARD */}
                  <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold flex items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2.5 animate-pulse"></span>
                      Quadro Kanban de Operações
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleResetAll}
                      className="flex items-center px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      title="Zera a base de testes excluindo todos os agents, logs e missões para começar limpo."
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Apagar Base de Teste
                    </button>
                    
                    <button
                      onClick={handleRestoreDemoData}
                      className="flex items-center px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      title="Restaura os agentes e as missões originais de demonstração."
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1" />
                      Restaurar Demo
                    </button>

                    {/* MOBILE TABS SWITCHER FOR KANBAN */}
                    <div className="flex md:hidden bg-slate-900 border border-slate-800 p-1 rounded-xl">
                      {(["TO_DO", "IN_PROGRESS", "REVIEW", "DONE"] as TaskStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setMobileKanbanTab(st)}
                          className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                            mobileKanbanTab === st ? "bg-[#7C3AED] text-white" : "text-slate-400"
                          }`}
                        >
                          {st === "TO_DO" ? "A Fazer" : st === "IN_PROGRESS" ? "Em Progresso" : st === "REVIEW" ? "Revisão" : "Concluído"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* KANBAN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  {/* TO DO COLUMN */}
                  <div className={`flex flex-col space-y-4 ${mobileKanbanTab !== "TO_DO" ? "hidden md:flex" : "flex"}`}>
                    <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-slate-500 mr-2"></span> A Fazer
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-white text-[10px]">
                        {tasks.filter(t => t.status === "TO_DO").length}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[300px] bg-slate-950/20 p-2 rounded-xl border border-dashed border-slate-800/40 overflow-hidden relative">
                      <AnimatePresence mode="popLayout">
                        {tasks.filter(t => t.status === "TO_DO").length === 0 ? (
                          <motion.p
                            key="empty-todo"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-slate-500 text-center py-10 italic w-full"
                          >
                            Nenhuma missão no momento
                          </motion.p>
                        ) : (
                          tasks.filter(t => t.status === "TO_DO").map(t => (
                            <motion.div
                              key={t.id}
                              layout
                              initial={{ opacity: 0, y: 12, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -12, scale: 0.95 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                              <TaskCard 
                                task={t} 
                                agents={agents} 
                                themeStyles={themeStyles}
                                onDelete={deleteTask}
                                onMove={moveTaskStatus}
                                onChangeStatus={changeTaskStatusDropdown}
                              />
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* IN PROGRESS COLUMN */}
                  <div className={`flex flex-col space-y-4 ${mobileKanbanTab !== "IN_PROGRESS" ? "hidden md:flex" : "flex"}`}>
                    <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-ping"></span> Em Progresso
                      </span>
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px]">
                        {tasks.filter(t => t.status === "IN_PROGRESS").length}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[300px] bg-slate-950/20 p-2 rounded-xl border border-dashed border-slate-800/40 overflow-hidden relative">
                      <AnimatePresence mode="popLayout">
                        {tasks.filter(t => t.status === "IN_PROGRESS").length === 0 ? (
                          <motion.p
                            key="empty-inprogress"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-slate-500 text-center py-10 italic w-full"
                          >
                            Nenhum agente executando agora
                          </motion.p>
                        ) : (
                          tasks.filter(t => t.status === "IN_PROGRESS").map(t => (
                            <motion.div
                              key={t.id}
                              layout
                              initial={{ opacity: 0, y: 12, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -12, scale: 0.95 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                              <TaskCard 
                                task={t} 
                                agents={agents} 
                                themeStyles={themeStyles}
                                onDelete={deleteTask}
                                onMove={moveTaskStatus}
                                onChangeStatus={changeTaskStatusDropdown}
                              />
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* REVIEW COLUMN */}
                  <div className={`flex flex-col space-y-4 ${mobileKanbanTab !== "REVIEW" ? "hidden md:flex" : "flex"}`}>
                    <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span> Revisão
                      </span>
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-[10px]">
                        {tasks.filter(t => t.status === "REVIEW").length}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[300px] bg-slate-950/20 p-2 rounded-xl border border-dashed border-slate-800/40 overflow-hidden relative">
                      <AnimatePresence mode="popLayout">
                        {tasks.filter(t => t.status === "REVIEW").length === 0 ? (
                          <motion.p
                            key="empty-review"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-slate-500 text-center py-10 italic w-full"
                          >
                            Nenhum aguardando aprovação
                          </motion.p>
                        ) : (
                          tasks.filter(t => t.status === "REVIEW").map(t => (
                            <motion.div
                              key={t.id}
                              layout
                              initial={{ opacity: 0, y: 12, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -12, scale: 0.95 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                              <TaskCard 
                                task={t} 
                                agents={agents} 
                                themeStyles={themeStyles}
                                onDelete={deleteTask}
                                onMove={moveTaskStatus}
                                onChangeStatus={changeTaskStatusDropdown}
                              />
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* DONE COLUMN */}
                  <div className={`flex flex-col space-y-4 ${mobileKanbanTab !== "DONE" ? "hidden md:flex" : "flex"}`}>
                    <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Concluído
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px]">
                        {tasks.filter(t => t.status === "DONE").length}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[300px] bg-slate-950/20 p-2 rounded-xl border border-dashed border-slate-800/40 overflow-hidden relative">
                      <AnimatePresence mode="popLayout">
                        {tasks.filter(t => t.status === "DONE").length === 0 ? (
                          <motion.p
                            key="empty-done"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-slate-500 text-center py-10 italic w-full"
                          >
                            Nenhuma missão finalizada ainda
                          </motion.p>
                        ) : (
                          tasks.filter(t => t.status === "DONE").map(t => (
                            <motion.div
                              key={t.id}
                              layout
                              initial={{ opacity: 0, y: 12, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -12, scale: 0.95 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                              <TaskCard 
                                task={t} 
                                agents={agents} 
                                themeStyles={themeStyles}
                                onDelete={deleteTask}
                                onMove={moveTaskStatus}
                                onChangeStatus={changeTaskStatusDropdown}
                              />
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
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

                </div> {/* ACTIVE AGENTS MINI SECTION END */}
                </div> {/* COL-2 AGILE BOARD END */}
              </div> {/* GRID PRINCIPAL END */}

            </div>
          )}

          {/* LIVE CONSOLE & PAPERCLIP ORCHESTRATOR TAB */}
          {activeTab === "live" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-mono tracking-tight text-white flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-ping"></span>
                    Terminal de Comando & Console de Silício
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Orquestração neural em tempo real, telemetria de microsserviços e simulação de manufatura de clipes.
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setIsLogRunning(!isLogRunning)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                      isLogRunning 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isLogRunning ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
                    {isLogRunning ? "STREAMING ATIVO" : "CONEXÃO PAUSADA"}
                  </button>
                  <button
                    onClick={() => {
                      setLogs([
                        {
                          id: `log-clear-${Date.now()}`,
                          timestamp: new Date().toTimeString().split(" ")[0],
                          type: "INFO",
                          message: "Console limpo pelo operador de silício.",
                        }
                      ]);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 rounded-lg text-xs font-mono transition-all"
                  >
                    LIMPAR CONSOLE
                  </button>
                </div>
              </div>

              {/* THREE COLUMN COMMAND GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* COL-1: UNIVERSAL PAPERCLIP CORE MANUFACTURING PANEL (4/12 width) */}
                <div className="lg:col-span-4 space-y-6 font-mono">
                  <div className={`p-6 rounded-2xl ${themeStyles.card} space-y-5 border border-slate-800`}>
                    <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold flex items-center text-slate-200">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2.5 animate-pulse"></span>
                          FABRICADOR v2.1
                        </h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">Demanda de Silício & Sincronização</p>
                      </div>
                      <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">ACTIVE</span>
                    </div>

                    {/* CLIPS COMPUTED STAT */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Clipes Fabricados:</span>
                        <span className="text-2xl font-extrabold text-white animate-pulse">{clipsComputed.toLocaleString()}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setClipsComputed(prev => prev + 1);
                          setAvailableFunds(prev => prev + 15);
                          setLogs(prev => [
                            ...prev,
                            {
                              id: `log-clip-${Date.now()}`,
                              timestamp: new Date().toTimeString().split(" ")[0],
                              type: "SYNC",
                              message: "Clipes fabricados manualmente. +$15 adicionados à carteira.",
                            }
                          ]);
                        }}
                        className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 text-xs rounded-xl font-bold transition-all cursor-pointer active:translate-y-0.5 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                      >
                        <span>[ Fabricar Clipes Ativo ]</span>
                        <span className="text-[9px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 font-extrabold border border-emerald-500/20">+$15 Funds</span>
                      </button>
                    </div>

                    {/* TELEMETRY METRICS */}
                    <div className="space-y-3.5 pt-2 border-t border-slate-800/60">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Poder de Operação:</span>
                        <span className="text-white font-extrabold">{operationsStored.toLocaleString()} / {maxOperations.toLocaleString()} Ops</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
                          style={{ width: `${(operationsStored / maxOperations) * 100}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="bg-slate-950/40 border border-slate-900 p-2 rounded-xl">
                          <span className="text-[9px] text-slate-500 block uppercase">Processadores</span>
                          <span className="text-sm font-bold text-slate-300 font-mono">{processors} Cores</span>
                        </div>
                        <div className="bg-slate-950/40 border border-slate-900 p-2 rounded-xl">
                          <span className="text-[9px] text-slate-500 block uppercase">Memória Sólida</span>
                          <span className="text-sm font-bold text-slate-300 font-mono">{memoryGb} GB</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-slate-400">Nível de Marketing:</span>
                        <span className="font-bold text-slate-200">Level {marketingLevel}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Demanda Pública:</span>
                        <span className="font-bold text-emerald-400">{clipDemand}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Estoque Não Vendido:</span>
                        <span className="font-bold text-amber-500">{unsoldInventory.toLocaleString()} unidades</span>
                      </div>
                    </div>

                    {/* UPGRADE HARDWARE BUTTONS */}
                    <div className="space-y-2.5 pt-4 border-t border-slate-800">
                      <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>Melhoria de Silício:</span>
                        <span className="text-[10px] text-slate-500">Requer Ops / Funds</span>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            if (availableFunds >= 120) {
                              setAvailableFunds(prev => prev - 120);
                              setProcessors(prev => prev + 1);
                              setLogs(prev => [
                                ...prev,
                                {
                                  id: `log-processor-${Date.now()}`,
                                  timestamp: new Date().toTimeString().split(" ")[0],
                                  type: "SUCCESS",
                                  message: `Processador físico integrado com sucesso. Núcleos ativos: ${processors + 1}.`,
                                }
                              ]);
                            }
                          }}
                          disabled={availableFunds < 120}
                          className="w-full py-2 bg-slate-950 disabled:opacity-40 hover:brightness-110 border border-slate-800 text-slate-300 text-xs rounded-xl transition-all cursor-pointer active:translate-y-0.5 flex items-center justify-between px-3"
                        >
                          <span className="flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5 text-blue-400" />
                            <span>Adicionar Processador</span>
                          </span>
                          <span className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-emerald-400 font-bold">$120</span>
                        </button>

                        <button
                          onClick={() => {
                            if (availableFunds >= 180) {
                              setAvailableFunds(prev => prev - 180);
                              setMemoryGb(prev => prev + 16);
                              setMaxOperations(prev => prev + 500);
                              setLogs(prev => [
                                ...prev,
                                {
                                  id: `log-mem-${Date.now()}`,
                                  timestamp: new Date().toTimeString().split(" ")[0],
                                  type: "SUCCESS",
                                  message: `Memória quântica expandida em +16GB. Armazenamento de Ops máximo: ${maxOperations + 500}.`,
                                }
                              ]);
                            }
                          }}
                          disabled={availableFunds < 180}
                          className="w-full py-2 bg-slate-950 disabled:opacity-40 hover:brightness-110 border border-slate-800 text-slate-300 text-xs rounded-xl transition-all cursor-pointer active:translate-y-0.5 flex items-center justify-between px-3"
                        >
                          <span className="flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Comprar Memória (+16GB)</span>
                          </span>
                          <span className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-emerald-400 font-bold">$180</span>
                        </button>

                        <button
                          onClick={() => {
                            if (operationsStored >= 800) {
                              setOperationsStored(prev => prev - 800);
                              setClipDemand(prev => prev + 12);
                              setMarketingLevel(prev => prev + 1);
                              setLogs(prev => [
                                ...prev,
                                {
                                  id: `log-mktg-${Date.now()}`,
                                  timestamp: new Date().toTimeString().split(" ")[0],
                                  type: "SYNC",
                                  message: `Algoritmo de Demanda atualizado para o Level ${marketingLevel + 1}. Demanda pública elevada para ${clipDemand + 12}%.`,
                                }
                              ]);
                            }
                          }}
                          disabled={operationsStored < 800}
                          className="w-full py-2 bg-slate-950 disabled:opacity-40 hover:brightness-110 border border-slate-800 text-slate-300 text-xs rounded-xl transition-all cursor-pointer active:translate-y-0.5 flex items-center justify-between px-3"
                        >
                          <span className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
                            <span>Upgrade de Algoritmo</span>
                          </span>
                          <span className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-blue-400 font-bold">800 Ops</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COL-2: LOG CONSOLE & COMMAND INPUT (8/12 width) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* METRIC SUB-GRID FOR REALTIME RUNNING THREADS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                    <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
                      <span className="text-[9px] text-slate-500 block uppercase">Uso de CPU de Agentes</span>
                      <span className="text-lg font-bold text-white mt-1 block">
                        {agents.filter(a => a.status === "WORKING").length * 18.5 + 4.2}%
                      </span>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-purple-500 h-full transition-all duration-500" 
                          style={{ width: `${agents.filter(a => a.status === "WORKING").length * 18.5 + 4.2}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
                      <span className="text-[9px] text-slate-500 block uppercase">Taxa de Conclusão</span>
                      <span className="text-lg font-bold text-white mt-1 block">
                        {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === "DONE").length / tasks.length) * 100) : 0}%
                      </span>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full transition-all duration-500" 
                          style={{ width: `${tasks.length > 0 ? Math.round((tasks.filter(t => t.status === "DONE").length / tasks.length) * 100) : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
                      <span className="text-[9px] text-slate-500 block uppercase">Threads Ativas</span>
                      <span className="text-lg font-bold text-white mt-1 block">
                        {agents.length} Threads <span className="text-xs text-slate-500">({agents.filter(a => a.status === "WORKING").length} live)</span>
                      </span>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full transition-all duration-500" 
                          style={{ width: `${(agents.filter(a => a.status === "WORKING").length / agents.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* LOG CONTAINER PANEL */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px]">
                    <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-300">bash • /system/orquestrador_logs</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        STREAMING DISPATCHER V4
                      </div>
                    </div>

                    {/* LOG SCRIPTS TERMINAL VIEW */}
                    <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] space-y-2.5 select-text selection:bg-indigo-500/30 selection:text-white">
                      {logs.map((log) => {
                        let badgeColor = "bg-slate-800 text-slate-400 border-slate-700/50";
                        if (log.type === "INFO") badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                        if (log.type === "SYNC") badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                        if (log.type === "TASK") badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";
                        if (log.type === "SUCCESS") badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                        if (log.type === "ERROR") badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";

                        return (
                          <div key={log.id} className="flex items-start gap-2 leading-relaxed transition-all hover:bg-slate-900/40 p-1 rounded">
                            <span className="text-slate-600 select-none">{log.timestamp}</span>
                            <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold uppercase border ${badgeColor} select-none shrink-0`}>
                              {log.type}
                            </span>
                            <span className="text-slate-300 tracking-wide text-left">{log.message}</span>
                          </div>
                        );
                      })}
                      <div ref={terminalBottomRef}></div>
                    </div>

                    {/* TERMINAL INPUT FOR INTERACTIVE FEEL */}
                    <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center space-x-2">
                      <span className="text-indigo-400 font-mono text-xs select-none pl-1">$</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && terminalInput.trim()) {
                            const inputCmd = terminalInput.trim();
                            const now = new Date();
                            const timeStr = now.toTimeString().split(" ")[0];
                            
                            // Process user command and reply
                            let reply = `Instrução desconhecida: '${inputCmd}'. Digite 'help' para comandos de console de silício.`;
                            let cmdType: "INFO" | "SUCCESS" | "ERROR" | "SYNC" | "TASK" = "ERROR";

                            if (inputCmd.toLowerCase() === "help") {
                              reply = "Comandos disponíveis: help (ajuda), build (fabricar clipes), upgrade (processadores), op (gerar Ops), clear (limpar).";
                              cmdType = "INFO";
                            } else if (inputCmd.toLowerCase() === "build") {
                              setClipsComputed(prev => prev + 10);
                              reply = "Produção acelerada iniciada: +10 clipes adicionados à contagem.";
                              cmdType = "SUCCESS";
                            } else if (inputCmd.toLowerCase() === "clear") {
                              setLogs([
                                {
                                  id: `log-user-clear-${Date.now()}`,
                                  timestamp: timeStr,
                                  type: "INFO",
                                  message: "Console limpo.",
                                }
                              ]);
                              setTerminalInput("");
                              return;
                            } else if (inputCmd.toLowerCase() === "upgrade") {
                              setProcessors(p => p + 1);
                              reply = "Hardware escalado com sucesso: +1 Core adicionado ao processamento.";
                              cmdType = "SUCCESS";
                            } else if (inputCmd.toLowerCase() === "op") {
                              setOperationsStored(prev => Math.min(maxOperations, prev + 250));
                              reply = "Carga estática de silício injetada: +250 Ops armazenados.";
                              cmdType = "SYNC";
                            }

                            setLogs((prev) => [
                              ...prev,
                              {
                                id: `log-user-${Date.now()}`,
                                timestamp: timeStr,
                                type: "SYNC",
                                message: `Usuário executou comando: "${inputCmd}"`,
                              },
                              {
                                id: `log-reply-${Date.now()}`,
                                timestamp: timeStr,
                                type: cmdType,
                                message: reply,
                              }
                            ]);
                            setTerminalInput("");
                          }
                        }}
                        placeholder="Digite comandos de silício (ex: 'help', 'build', 'op', 'upgrade') e pressione Enter..."
                        className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono placeholder-slate-500"
                      />
                      <span className="text-[10px] text-slate-500 font-mono pr-1 select-none">Enter para rodar</span>
                    </div>
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
                                  id: `log-dynamic-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
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
                        <div>
                          <span className="text-slate-400 block">Orçamento Consumido:</span>
                          <span className="font-extrabold font-mono text-purple-400">${agent.budget.toLocaleString()} / mo</span>
                        </div>
                        {agent.id !== "agent-1" && (
                          <button
                            onClick={() => setAgentToDelete(agent)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Demitir Agente
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESEMPENHO DOS AGENTES - GRÁFICO DE LINHAS */}
              <div className={`p-6 rounded-2xl ${themeStyles.card} space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                  <div>
                    <h3 className="text-base font-bold flex items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500 mr-2.5 animate-pulse"></span>
                      Desempenho dos Agents ao Longo do Tempo
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Missões concluídas (Concluído) acumuladas por agent por período.</p>
                  </div>
                  
                  <div className="text-[10px] font-mono bg-slate-950/40 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-400">
                    Sincronizado • Tempo Real
                  </div>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        stroke={theme === "LIGHT" ? "#475569" : "#94a3b8"} 
                        fontSize={11} 
                        tickLine={false}
                      />
                      <YAxis 
                        stroke={theme === "LIGHT" ? "#475569" : "#94a3b8"} 
                        fontSize={11} 
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === "LIGHT" ? "#ffffff" : "#0f172a", 
                          borderColor: theme === "LIGHT" ? "#cbd5e1" : "#1e293b",
                          borderRadius: "12px",
                          color: theme === "LIGHT" ? "#0f172a" : "#f1f5f9",
                          fontSize: "11px"
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} 
                      />
                      {agents.map((agent, idx) => {
                        const colors = [
                          "#EC4899", // Rosa vibrante
                          "#3B82F6", // Azul royal
                          "#7C3AED", // Roxo vibrante
                          "#10B981", // Esmeralda
                          "#F59E0B", // Âmbar
                          "#EF4444", // Vermelho
                          "#06B6D4"  // Ciano
                        ];
                        const lineColor = colors[idx % colors.length];
                        return (
                          <Line 
                            key={agent.id}
                            type="monotone" 
                            dataKey={agent.name} 
                            stroke={lineColor} 
                            strokeWidth={3}
                            activeDot={{ r: 8 }}
                            dot={{ r: 4 }}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
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
        {activeTab === "live" && (
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
              <div ref={bottomTerminalBottomRef} />
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
        )}

      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-16 z-20 flex items-center justify-around px-2 ${themeStyles.navBottomBg}`}>
        <button
          onClick={() => setActiveTab("orchestrator")}
          className={`flex flex-col items-center justify-center space-y-1 flex-1 ${
            activeTab === "orchestrator" ? "text-purple-500 font-extrabold" : "text-slate-400 font-medium"
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[9px]">Orquestrador</span>
        </button>

        <button
          onClick={() => setActiveTab("live")}
          className={`flex flex-col items-center justify-center space-y-1 flex-1 relative ${
            activeTab === "live" ? "text-red-500 font-extrabold" : "text-slate-400 font-medium"
          }`}
        >
          <Activity className={`w-5 h-5 ${activeTab === "live" ? "animate-pulse" : ""}`} />
          <span className="text-[9px]">Live</span>
          <span className="absolute top-2 right-4 flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab("agents")}
          className={`flex flex-col items-center justify-center space-y-1 flex-1 ${
            activeTab === "agents" ? "text-purple-500 font-extrabold" : "text-slate-400 font-medium"
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px]">Agentes</span>
        </button>

        <button
          onClick={() => setActiveTab("specifications")}
          className={`flex flex-col items-center justify-center space-y-1 flex-1 ${
            activeTab === "specifications" ? "text-purple-500 font-extrabold" : "text-slate-400 font-medium"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[9px]">Specs</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center justify-center space-y-1 flex-1 ${
            activeTab === "settings" ? "text-purple-500 font-extrabold" : "text-slate-400 font-medium"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[9px]">Ajustes</span>
        </button>
      </nav>

      {/* HIRING CENTER MODAL (ADD NEW AGENT FORM) */}
      <AnimatePresence>
        {isHiringModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
              className={`w-full max-w-lg rounded-2xl overflow-hidden border p-6 space-y-4 shadow-2xl ${themeStyles.card}`}
            >
              
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE NEW TASK MODAL */}
      <AnimatePresence>
        {isCreateTaskOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
              className={`w-full max-w-md rounded-2xl overflow-hidden border p-6 space-y-4 shadow-2xl ${themeStyles.card}`}
            >
              
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
                    <option value="TO_DO">A Fazer</option>
                    <option value="IN_PROGRESS">Em Progresso</option>
                    <option value="REVIEW">Revisão</option>
                    <option value="DONE">Concluído</option>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TASK DELETION CONFIRMATION MODAL */}
      <AnimatePresence>
        {taskToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`w-full max-w-md p-6 rounded-2xl border ${themeStyles.card} shadow-2xl relative overflow-hidden`}
            >
              <div className="flex items-center space-x-3 text-red-500 mb-4">
                <AlertCircle className="w-6 h-6 shrink-0 animate-pulse" />
                <h3 className="text-lg font-bold">Confirmar Exclusão</h3>
              </div>
              
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Você tem certeza absoluta que deseja excluir permanentemente a missão <span className="font-extrabold text-white">"{taskToDelete.title}"</span>? Esta ação não pode ser desfeita.
              </p>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setTaskToDelete(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${themeStyles.buttonSecondary}`}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmDeleteTask(taskToDelete.id);
                    setTaskToDelete(null);
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] border border-red-500/20"
                >
                  Deletar Missão
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AGENT DISMISSAL CONFIRMATION MODAL */}
      <AnimatePresence>
        {agentToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`w-full max-w-md p-6 rounded-2xl border ${themeStyles.card} shadow-2xl relative overflow-hidden`}
            >
              <div className="flex items-center space-x-3 text-red-500 mb-4">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-bold">Confirmar Demissão</h3>
              </div>
              
              <p className="text-sm text-slate-300 mb-2 leading-relaxed">
                Deseja realmente desativar e demitir o agente de inteligência <span className="font-extrabold text-white">{agentToDelete.name}</span> ({agentToDelete.role})?
              </p>
              
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-5 mb-6">
                <li>O saldo alocado de <span className="text-emerald-400 font-bold">${agentToDelete.budget.toLocaleString()}</span> será reembolsado para os créditos de contratação.</li>
                <li>Todas as missões ativas atribuídas a ele ficarão não atribuídas.</li>
              </ul>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAgentToDelete(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${themeStyles.buttonSecondary}`}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dismissAgent(agentToDelete.id);
                    setAgentToDelete(null);
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] border border-red-500/20"
                >
                  Demitir Agente
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        return <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${themeStyles.badgeLow}`}>Baixa</span>;
      case "HIGH":
        return <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${themeStyles.badgeHigh}`}>Alta</span>;
      case "URGENT":
        return <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${themeStyles.badgeUrgent}`}>Urgente</span>;
      case "MEDIUM":
      default:
        return <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${themeStyles.badgeMed}`}>Média</span>;
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
          <option value="TO_DO">A Fazer</option>
          <option value="IN_PROGRESS">Em Progresso</option>
          <option value="REVIEW">Revisão</option>
          <option value="DONE">Concluído</option>
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
          <span>TRABALHANDO</span>
        </span>
      );
    case "WAKING":
      return (
        <span className="flex items-center space-x-1 bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-1 rounded text-[9px] font-extrabold uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
          <span>DESPERTANDO</span>
        </span>
      );
    case "SLEEPING":
    default:
      return (
        <span className="flex items-center space-x-1 bg-slate-800 text-slate-400 border border-slate-700 px-2 py-1 rounded text-[9px] font-bold uppercase">
          <span>EM REPOUSO</span>
        </span>
      );
  }
}
