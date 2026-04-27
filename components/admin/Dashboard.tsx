"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  Map as MapIcon, 
  FileText, 
  Package, 
  Save, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Camera,
  X,
  Loader2,
  Trash2,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { 
  getHeroConfig, 
  updateHeroConfig, 
  updateHeroImage,
  getConnectionConfig,
  updateConnectionConfig,
  getPlans, 
  createPlan,
  updatePlan, 
  deletePlan,
  getMapPoints,
  createMapPoint,
  updateMapPoint,
  deleteMapPoint,
  getAdminData,
  getAdminUsers,
  updateProfilePhoto,
  removeProfilePhoto
} from "@/backend/actions";
import Image from "next/image";
import gsap from "gsap";
import { signOutAdminAction } from "@/app/admin/actions";

interface MapPointAdmin {
  id: number;
  nombre: string;
  lat: number;
  lng: number;
  color: string;
  radio: number;
}

interface PlanAdmin {
  id: number;
  speed: string;
  price: string;
  tv: string;
  monthLabel?: string;
  description?: string;
  buttonLabel?: string;
  includeLabel?: string;
  popularLabel?: string;
  suscripcion: string;
  zona: string;
  order: number;
  isPopular?: boolean;
}

interface AdminUserItem {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  updatedAt: Date | string;
}

const PORTAL_CLIENTES_URL = "https://avisos.wisphub.net/saldo/bcas-sas/";
const DEFAULT_MAP_COORDS = { lat: 4.14546, lng: -73.655689 };

const AdminDashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  
  // Data States
  const [adminUser, setAdminUser] = useState<any>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>([]);
  const [heroData, setHeroData] = useState({
    bienvenido: "",
    empresa: "",
    slogan: "",
    heroImage: ""
  });
  const [connectionData, setConnectionData] = useState({
    titulo: "",
    subtitulo: "",
    buttonText: "",
    features: ["", "", "", "", ""],
  });
  const [plansData, setPlansData] = useState<PlanAdmin[]>([]);
  const [mapPointsData, setMapPointsData] = useState<MapPointAdmin[]>([]);
  const [newPlanData, setNewPlanData] = useState({
    speed: "50MB",
    zona: "mesetas",
    order: 1,
    suscripcion: "99.000",
    tv: "1 Punto de TV GRATIS",
    price: "68K",
    monthLabel: "/mes",
    description: "Ideal para hogares que buscan conexión estable para navegar, estudiar y disfrutar contenido sin interrupciones.",
    buttonLabel: "Elegir plan",
    includeLabel: "Incluye",
    popularLabel: "Popular",
    isPopular: false,
  });
  const [newMapPointData, setNewMapPointData] = useState({
    nombre: "",
    lat: DEFAULT_MAP_COORDS.lat,
    lng: DEFAULT_MAP_COORDS.lng,
    color: "#2563EB",
    radio: 300,
  });
  const [newZoneName, setNewZoneName] = useState("");

  const sanitizeCoordinate = (value: number | null | undefined, fallback: number) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric === 0) return fallback;
    return numeric;
  };

  const formatCoordinate = (value: number) => Number(value).toFixed(6);

  useEffect(() => {
    gsap.set(".admin-reveal", { clearProps: "all" });
  }, [activeTab, adminUsers.length]);

  useEffect(() => {
    const fetchData = async () => {
      // Mock email for now, in real apps get from session
      const admin = await getAdminData("henro@gmail.com");
      setAdminUser(admin);
      const admins = (await getAdminUsers()) as AdminUserItem[];
      setAdminUsers(admins);

      const hero = await getHeroConfig();
      if (hero) {
        setHeroData({
          bienvenido: hero.bienvenido,
          empresa: hero.empresa,
          slogan: hero.slogan,
          heroImage: hero.heroImage
        });
      }

      const plans = await getPlans();
      setPlansData(plans);
      const mapPoints = (await getMapPoints()) as unknown as Array<{
        id: number;
        nombre: string;
        lat: number | null;
        lng: number | null;
        color: string | null;
        radio: number | null;
      }>;
      setMapPointsData(
        mapPoints.map((point) => ({
          id: point.id,
          nombre: point.nombre,
          lat: sanitizeCoordinate(point.lat, DEFAULT_MAP_COORDS.lat),
          lng: sanitizeCoordinate(point.lng, DEFAULT_MAP_COORDS.lng),
          color: point.color ?? "#2563EB",
          radio: Number(point.radio ?? 300),
        }))
      );

      const connection = await getConnectionConfig();
      if (connection) {
        setConnectionData({
          titulo: connection.titulo,
          subtitulo: connection.subtitulo,
          buttonText: connection.buttonText,
          features:
            connection.features?.length > 0
              ? connection.features.map((feature: { text: string }) => feature.text)
              : ["Conexión estable", "Velocidad ideal para tu hogar", "Instalación rápida", "Soporte técnico cercano", "Planes adaptados a ti"],
        });
      }
    };
    fetchData();

    const adminRefreshInterval = setInterval(async () => {
      const admin = await getAdminData("henro@gmail.com");
      setAdminUser(admin);
      const admins = (await getAdminUsers()) as AdminUserItem[];
      setAdminUsers(admins);
    }, 8000);

    return () => clearInterval(adminRefreshInterval);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "hero", label: "Hero Principal", icon: Package },
    { id: "plans", label: "Planes", icon: Package },
    { id: "connection", label: "Conexión", icon: Package },
    { id: "sectors", label: "Sectores", icon: MapIcon },
    { id: "about", label: "Nosotros", icon: FileText },
    { id: "policies", label: "Políticas", icon: FileText },
    { id: "portal", label: "Portal Clientes", icon: ExternalLink },
  ];

  const handleSaveHero = async () => {
    setIsSaving(true);
    const res = await updateHeroConfig(heroData);
    if (res.success) toast.success("Hero actualizado");
    else toast.error("Error al actualizar");
    setIsSaving(false);
  };

  const handleDeletePlan = async (id: number) => {
    const res = await deletePlan(id);
    if (res.success) {
      setPlansData((prev) => prev.filter((plan) => plan.id !== id));
      toast.success("Plan eliminado");
    } else {
      toast.error("No se pudo eliminar");
    }
  };

  const handleUpdatePlan = async (id: number, data: Partial<PlanAdmin>) => {
    const res = await updatePlan(id, data);
    if (res.success) {
      const refreshed = await getPlans();
      setPlansData(refreshed);
      toast.success("Plan actualizado");
    } else {
      toast.error("No se pudo actualizar");
    }
  };

  const handleCreatePlan = async (overrides?: Partial<typeof newPlanData>) => {
    const res = await createPlan({ ...newPlanData, ...overrides });
    if (res.success) {
      const refreshed = await getPlans();
      setPlansData(refreshed);
      toast.success("Plan creado");
    } else {
      toast.error("No se pudo crear");
    }
  };

  const handleSaveConnection = async () => {
    setIsSaving(true);
    const res = await updateConnectionConfig(connectionData);
    if (res.success) toast.success("Sección Conexión actualizada");
    else toast.error("Error al actualizar Conexión");
    setIsSaving(false);
  };

  const handleCreateMapPoint = async () => {
    if (!newMapPointData.nombre.trim()) {
      toast.error("El nombre del punto es obligatorio");
      return;
    }

    const res = await createMapPoint(newMapPointData);
    if (res.success) {
      const refreshed = (await getMapPoints()) as unknown as Array<{
        id: number;
        nombre: string;
        lat: number | null;
        lng: number | null;
        color: string | null;
        radio: number | null;
      }>;
      setMapPointsData(
        refreshed.map((point) => ({
          id: point.id,
          nombre: point.nombre,
          lat: sanitizeCoordinate(point.lat, DEFAULT_MAP_COORDS.lat),
          lng: sanitizeCoordinate(point.lng, DEFAULT_MAP_COORDS.lng),
          color: point.color ?? "#2563EB",
          radio: Number(point.radio ?? 300),
        }))
      );
      setNewMapPointData({ nombre: "", lat: DEFAULT_MAP_COORDS.lat, lng: DEFAULT_MAP_COORDS.lng, color: "#2563EB", radio: 300 });
      toast.success("Punto del mapa creado");
    } else {
      toast.error("No se pudo crear el punto");
    }
  };

  const handleUpdateMapPoint = async (id: number, point: MapPointAdmin) => {
    const res = await updateMapPoint(id, {
      nombre: point.nombre,
      lat: Number(point.lat),
      lng: Number(point.lng),
      color: point.color,
      radio: Number(point.radio),
    });
    if (res.success) toast.success("Punto actualizado");
    else toast.error("No se pudo actualizar");
  };

  const handleDeleteMapPoint = async (id: number) => {
    const res = await deleteMapPoint(id);
    if (res.success) {
      setMapPointsData((prev) => prev.filter((point) => point.id !== id));
      toast.success("Punto eliminado");
    } else {
      toast.error("No se pudo eliminar");
    }
  };

  const handleCreateSectionForPlans = async () => {
    const sectionName = newZoneName.trim();
    if (!sectionName) {
      toast.error("Escribe el nombre de la sección");
      return;
    }
    await handleCreatePlan({
      zona: sectionName,
      speed: "Nuevo plan",
      price: "0",
      suscripcion: "0",
      tv: "Sin TV",
      order: (Math.max(0, ...plansData.map((plan) => plan.order)) || 0) + 1,
      description: "Plan base para esta nueva sección.",
    });
    setNewZoneName("");
  };

  const handleDeleteSection = async (zona: string) => {
    const plansToDelete = plansData.filter((plan) => plan.zona === zona);
    if (plansToDelete.length === 0) return;
    await Promise.all(plansToDelete.map((plan) => deletePlan(plan.id)));
    const refreshed = await getPlans();
    setPlansData(refreshed);
    toast.success("Sección eliminada");
  };

  const handleAddPlanToSection = async (zona: string) => {
    const plansInSection = plansData.filter((plan) => plan.zona === zona);
    const nextOrder = (Math.max(0, ...plansInSection.map((plan) => plan.order)) || 0) + 1;
    await handleCreatePlan({
      zona,
      speed: "50MB",
      price: "68K",
      suscripcion: plansInSection[0]?.suscripcion || "99.000",
      tv: "+1 TV",
      order: nextOrder,
      description: "Ideal para hogares que buscan conexión estable para navegar, estudiar y disfrutar contenido sin interrupciones.",
      isPopular: plansInSection[0]?.isPopular ?? false,
    });
  };

  const handleRenameSection = async (oldZone: string, newZone: string) => {
    const trimmed = newZone.trim();
    if (!trimmed || trimmed === oldZone) return;
    const plansInSection = plansData.filter((plan) => plan.zona === oldZone);
    await Promise.all(plansInSection.map((plan) => updatePlan(plan.id, { zona: trimmed })));
    const refreshed = await getPlans();
    setPlansData(refreshed);
    toast.success("Sección actualizada");
  };

  const handleSectionMetaChange = async (zona: string, patch: Partial<PlanAdmin>) => {
    const plansInSection = plansData.filter((plan) => plan.zona === zona);
    await Promise.all(plansInSection.map((plan) => updatePlan(plan.id, patch)));
    const refreshed = await getPlans();
    setPlansData(refreshed);
    toast.success("Sección actualizada");
  };

  const handleOpenPortalClientes = () => {
    window.open(PORTAL_CLIENTES_URL, "_blank", "noopener,noreferrer");
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === "portal") {
      handleOpenPortalClientes();
      return;
    }
    setActiveTab(tabId);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    toast.loading("Subiendo foto...", { id: "upload" });
    const res = await updateProfilePhoto("henro@gmail.com", formData);
    
    if (res.success) {
      setAdminUser({ ...adminUser, image: res.url });
      toast.success("Foto actualizada", { id: "upload" });
    } else {
      toast.error("Error al subir", { id: "upload" });
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    toast.loading("Subiendo imagen del hero...", { id: "hero-upload" });
    const res = await updateHeroImage(formData);

    if (res.success && res.url) {
      setHeroData((prev) => ({ ...prev, heroImage: res.url! }));
      toast.success("Imagen del hero actualizada", { id: "hero-upload" });
    } else {
      toast.error("No se pudo subir la imagen", { id: "hero-upload" });
    }
  };

  const handleLogout = () => {
    signOutAdminAction()
      .then((res) => {
        if (res.success) {
          toast.success("Sesión cerrada");
        } else {
          toast.error("No se pudo cerrar la sesión");
        }
      })
      .finally(() => {
        router.push("/admin");
      });
  };

  const groupedPlans = plansData.reduce<Record<string, PlanAdmin[]>>((acc, plan) => {
    if (!acc[plan.zona]) acc[plan.zona] = [];
    acc[plan.zona].push(plan);
    acc[plan.zona].sort((a, b) => a.order - b.order);
    return acc;
  }, {});
  const dashboardQuickLinks = [
    { id: "hero", label: "Hero Principal", description: "Ajusta imagen y textos de bienvenida.", icon: Package, color: "text-blue-500", accent: "bg-blue-500/10" },
    { id: "about", label: "Quiénes Somos", description: "Edita contenido de la sección Nosotros.", icon: FileText, color: "text-orange-500", accent: "bg-orange-500/10" },
    { id: "plans", label: "Planes", description: "Gestiona planes y secciones de precios.", icon: Package, color: "text-emerald-500", accent: "bg-emerald-500/10" },
    { id: "sectors", label: "Sectores", description: "Actualiza coordenadas y cobertura.", icon: MapIcon, color: "text-lime-500", accent: "bg-lime-500/10" },
    { id: "connection", label: "Conexión", description: "Configura el bloque informativo.", icon: Settings, color: "text-cyan-500", accent: "bg-cyan-500/10" },
    { id: "policies", label: "Políticas", description: "Administra políticas del sitio.", icon: FileText, color: "text-violet-500", accent: "bg-violet-500/10" },
    { id: "portal", label: "Portal Clientes", description: "Abre WispHub en una nueva pestaña.", icon: ExternalLink, color: "text-amber-500", accent: "bg-amber-500/10" },
  ] as const;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020617] text-slate-200 flex font-sans">
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarCollapsed ? 100 : 292 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="border-r border-slate-800 bg-[#020617] flex flex-col relative z-20 shrink-0"
      >
        <button
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="absolute -right-3 top-8 w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-all z-30 flex items-center justify-center shadow-lg cursor-pointer"
          aria-label={isSidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10 overflow-hidden">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 flex-shrink-0">
              <Image src="/images/Logo_BCAS_MODO_OSCURO.png" alt="BCAS" fill sizes="40px" className="object-contain p-1.5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-black text-sm tracking-tight text-white leading-none">Bioconstructores</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Asociados SAS</span>
              </div>
            )}
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium group cursor-pointer",
                  activeTab === tab.id 
                    ? "bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-inner" 
                    : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
                )}
              >
                <tab.icon className={cn("w-5 h-5 flex-shrink-0", activeTab === tab.id ? "text-blue-500" : "text-slate-500")} />
                {!isSidebarCollapsed && <span className="ml-3 text-sm">{tab.label}</span>}
                {activeTab === tab.id && !isSidebarCollapsed && (
                   <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Admin Profile Bottom */}
        <div className="mt-auto p-4 border-t border-slate-800">
           <button 
             onClick={() => setShowProfileModal(true)}
             className="w-full flex items-center p-2 rounded-xl hover:bg-slate-800/50 transition-all text-left cursor-pointer"
           >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-700 flex-shrink-0 bg-slate-800">
                {adminUser?.image ? (
                  <Image src={adminUser.image} alt="Admin" fill sizes="40px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                    {(adminUser?.name?.[0] || "H").toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-3 overflow-hidden min-w-0">
                <p className="text-sm font-bold text-white truncate">{adminUser?.name || "Henry Gonzalez"}</p>
                <p className="text-[10px] text-slate-300 uppercase font-black tracking-tighter">ADMINISTRADOR</p>
              </div>
           </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#020617] overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-slate-800 px-10 flex items-center justify-between bg-[#020617]/50 backdrop-blur-md">
          <h1 className="text-xl font-bold text-white">Panel de Control</h1>
        </header>

        <div className="p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                 <div className="admin-reveal relative p-8 rounded-[2rem] bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/10 overflow-hidden">
                    <div className="relative z-10">
                      <h2 className="text-4xl font-black text-white mb-2">¡Hola, {adminUser?.name?.split(' ')[0]}!</h2>
                      <p className="text-slate-400 max-w-2xl leading-relaxed">
                        Avancemos en el desarrollo de proyectos sostenibles y ampliemos nuestra cobertura para un mundo conectado. 
                        Tu gestión administrativa es clave para proyectar y posicionar a <span className="text-blue-400 font-bold">Bioconstructores Asociados SAS</span> en Villavicencio.
                      </p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none pr-10 pb-5">
                       <span className="text-[120px] font-black text-blue-500">BCAS</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {dashboardQuickLinks.map((item) => (
                      <div key={item.id} className="admin-reveal p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all group">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", item.accent, item.color)}>
                          <item.icon size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{item.label}</h3>
                        <p className="text-sm text-slate-500 mb-6 italic">{item.description}</p>
                        <button onClick={() => handleTabClick(item.id)} className={cn("text-sm font-bold flex items-center hover:underline cursor-pointer", item.color)}>
                          Ir ahora <ChevronRight size={14} className="ml-1" />
                        </button>
                      </div>
                    ))}
                 </div>
                 <div className="admin-reveal p-6 rounded-3xl bg-slate-900 border border-slate-800">
                       <div className="flex items-center justify-between mb-6">
                         <h3 className="text-lg font-bold text-white">Administradores</h3>
                         <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase">
                           {adminUsers.length} Activo{adminUsers.length === 1 ? "" : "s"}
                         </span>
                       </div>
                       <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                        {adminUsers.map((user) => (
                          <div key={user.id} className="flex items-center p-3 rounded-2xl bg-black/30 border border-slate-800">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 mr-3 border border-slate-700 flex-shrink-0">
                              {user.image ? (
                                <Image src={user.image} alt={user.name || "A"} fill sizes="40px" className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                  {(user.name?.[0] || user.email[0] || "A").toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white truncate">{user.name || "Sin nombre"}</p>
                              <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                            <div className="ml-auto text-right pl-2">
                              <p className="text-[10px] text-slate-600 font-bold uppercase">Últ. vez</p>
                              <p className="text-[10px] text-slate-400 font-bold">
                                {new Date(user.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                       </div>
                 </div>
              </motion.div>
            )}

            {activeTab === "plans" && (
              <motion.div key="plans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-white">Secciones de Precios</h2>
                  <button type="button" onClick={handleCreateSectionForPlans} className="bg-blue-900 hover:bg-blue-800 border border-blue-700 rounded-xl px-4 py-2 text-sm text-white font-semibold cursor-pointer flex items-center gap-2">
                    <Plus size={16} />
                    Añadir Sección
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
                    <input value={newZoneName} onChange={(e) => setNewZoneName(e.target.value)} placeholder="Crear nueva sección (zona)" className="md:col-span-3 bg-black border border-slate-800 rounded-xl px-3 py-2 text-sm" />
                    <button type="button" onClick={handleCreateSectionForPlans} className="bg-slate-950 hover:bg-black border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-semibold cursor-pointer">
                      Añadir sección
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {Object.entries(groupedPlans).map(([zona, plans]) => (
                    <div key={zona} className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Zona / Barrio(s)</p>
                        <button onClick={() => handleDeleteSection(zona)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <input
                        defaultValue={zona}
                        onBlur={(e) => handleRenameSection(zona, e.target.value)}
                        className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-bold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          defaultValue={plans[0]?.suscripcion || ""}
                          onBlur={(e) => handleSectionMetaChange(zona, { suscripcion: e.target.value })}
                          placeholder="Subtítulo (suscripción)"
                          className="bg-black border border-slate-800 rounded-lg px-2 py-2 text-xs text-white"
                        />
                        <input
                          defaultValue={plans[0]?.popularLabel || ""}
                          onBlur={(e) => handleSectionMetaChange(zona, { popularLabel: e.target.value })}
                          placeholder="Badge"
                          className="bg-black border border-slate-800 rounded-lg px-2 py-2 text-xs text-white"
                        />
                      </div>
                      <label className="text-xs text-slate-300 flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked={!!plans[0]?.isPopular}
                          onChange={(e) => handleSectionMetaChange(zona, { isPopular: e.target.checked })}
                        />
                        Mostrar como sección Premium
                      </label>
                      <div className="rounded-2xl border border-slate-800 bg-black/30 p-3">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Planes de esta zona</p>
                          <button onClick={() => handleAddPlanToSection(zona)} className="bg-blue-900 hover:bg-blue-800 text-white text-xs px-3 py-1 rounded-lg font-semibold cursor-pointer">
                            + PLAN
                          </button>
                        </div>
                        <div className="space-y-2">
                          {plans.map((plan) => (
                            <div key={plan.id} className="grid grid-cols-1 sm:grid-cols-[1fr_90px_80px_30px] gap-2 items-center">
                              <input
                                defaultValue={plan.speed}
                                onBlur={(e) => handleUpdatePlan(plan.id, { speed: e.target.value })}
                                className="bg-black border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                              />
                              <input
                                defaultValue={plan.price}
                                onBlur={(e) => handleUpdatePlan(plan.id, { price: e.target.value })}
                                className="bg-black border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                              />
                              <input
                                defaultValue={plan.tv}
                                onBlur={(e) => handleUpdatePlan(plan.id, { tv: e.target.value })}
                                className="bg-black border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                              />
                              <button onClick={() => handleDeletePlan(plan.id)} className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all cursor-pointer justify-self-end sm:justify-self-auto">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "about" && (
              <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
                  <h3 className="text-xl font-bold text-white">Sección Nosotros</h3>
                  <p className="text-slate-400">Este apartado ya está habilitado desde el dashboard. Aquí puedes seguir agregando editor completo cuando lo necesites.</p>
                  <button onClick={() => setActiveTab("dashboard")} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer">
                    Volver al Dashboard
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "policies" && (
              <motion.div key="policies" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
                  <h3 className="text-xl font-bold text-white">Sección Políticas</h3>
                  <p className="text-slate-400">Este apartado ya está habilitado para navegación desde el menú y tarjetas del dashboard.</p>
                  <button onClick={() => setActiveTab("dashboard")} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer">
                    Volver al Dashboard
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "hero" && (
              <motion.div key="hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-8">
                 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-xl font-bold text-white">Editar Hero Principal</h3>
                       <button onClick={handleSaveHero} disabled={isSaving} className="flex items-center space-x-2 bg-blue-700 text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50 cursor-pointer">
                         {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                         <span>Guardar</span>
                       </button>
                    </div>

                    <div className="space-y-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Título Bienvenida</label>
                         <input 
                           type="text" 
                           value={heroData.bienvenido}
                           onChange={e => setHeroData({...heroData, bienvenido: e.target.value})}
                           className="w-full bg-black border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
                         />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Texto del Badge (arriba)</label>
                         <input
                           type="text"
                           value={heroData.empresa}
                           onChange={e => setHeroData({...heroData, empresa: e.target.value})}
                           className="w-full bg-black border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
                         />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Slogan / Subtítulo</label>
                         <textarea 
                           value={heroData.slogan}
                           onChange={e => setHeroData({...heroData, slogan: e.target.value})}
                           className="w-full bg-black border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all h-32 resize-none"
                         />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Imagen de Fondo</label>
                        <div className="mt-4">
                          <input type="file" ref={heroImageInputRef} className="hidden" accept="image/*" onChange={handleHeroImageUpload} />
                          <button
                            type="button"
                            onClick={() => heroImageInputRef.current?.click()}
                            className="w-full flex items-center justify-center space-x-3 py-4 border border-dashed border-slate-700 rounded-2xl text-slate-300 hover:text-white hover:border-slate-500 transition-all font-bold cursor-pointer"
                          >
                            <Camera size={18} />
                            <span>Cambiar imagen</span>
                          </button>
                        </div>
                        {heroData.heroImage && (
                          <div className="relative mt-4 h-40 w-full rounded-2xl overflow-hidden border border-slate-800">
                            <Image src={heroData.heroImage} alt="Hero preview" fill sizes="100vw" className="object-cover" />
                          </div>
                        )}
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === "sectors" && (
              <motion.div key="sectors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-white">Gestión de Sectores / Mapa</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4">
                    <h3 className="font-bold text-white text-lg">Añadir Sector</h3>
                    <input value={newMapPointData.nombre} onChange={(e) => setNewMapPointData({ ...newMapPointData, nombre: e.target.value })} placeholder="Nombre del sector" className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-sm" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" step="0.000001" value={newMapPointData.lat} onChange={(e) => setNewMapPointData({ ...newMapPointData, lat: Number(e.target.value) })} placeholder="Latitud" className="bg-black border border-slate-800 rounded-xl px-3 py-2 text-sm" />
                      <input type="number" step="0.000001" value={newMapPointData.lng} onChange={(e) => setNewMapPointData({ ...newMapPointData, lng: Number(e.target.value) })} placeholder="Longitud" className="bg-black border border-slate-800 rounded-xl px-3 py-2 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" value={newMapPointData.radio} onChange={(e) => setNewMapPointData({ ...newMapPointData, radio: Number(e.target.value) })} placeholder="Radio (m)" className="bg-black border border-slate-800 rounded-xl px-3 py-2 text-sm" />
                      <label className="bg-black border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 flex items-center justify-between gap-2">
                        <span>Color</span>
                        <input type="color" value={newMapPointData.color} onChange={(e) => setNewMapPointData({ ...newMapPointData, color: e.target.value })} className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer" />
                      </label>
                    </div>
                    <p className="text-xs text-slate-400 bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
                      Consejo: en Google Maps haz clic derecho sobre el punto y copia latitud/longitud exacta.
                    </p>
                    <button onClick={handleCreateMapPoint} className="w-full flex items-center justify-center space-x-2 bg-blue-950 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all active:scale-95 shadow-lg shadow-blue-950/40 cursor-pointer">
                      <Plus size={18} />
                      <span>Añadir Sector al Mapa</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {mapPointsData.map((point) => (
                    <div key={point.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
                        <input value={point.nombre} onChange={(e) => setMapPointsData((prev) => prev.map((item) => item.id === point.id ? { ...item, nombre: e.target.value } : item))} className="bg-black border border-slate-800 rounded-lg px-3 py-2 text-sm text-white lg:col-span-2" />
                        <input type="number" step="0.000001" value={point.lat} onChange={(e) => setMapPointsData((prev) => prev.map((item) => item.id === point.id ? { ...item, lat: Number(e.target.value) } : item))} className="bg-black border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                        <input type="number" step="0.000001" value={point.lng} onChange={(e) => setMapPointsData((prev) => prev.map((item) => item.id === point.id ? { ...item, lng: Number(e.target.value) } : item))} className="bg-black border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                        <label className="bg-black border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 flex items-center gap-2">
                          <span>Color</span>
                          <input type="color" value={point.color} onChange={(e) => setMapPointsData((prev) => prev.map((item) => item.id === point.id ? { ...item, color: e.target.value } : item))} className="w-7 h-7 p-0 border-none bg-transparent cursor-pointer" />
                        </label>
                        <input type="number" value={point.radio} onChange={(e) => setMapPointsData((prev) => prev.map((item) => item.id === point.id ? { ...item, radio: Number(e.target.value) } : item))} className="bg-black border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                      </div>
                      <div className="mt-3 text-xs text-slate-400">
                        Coordenadas actuales: {formatCoordinate(point.lat)}, {formatCoordinate(point.lng)}
                      </div>
                      <div className="flex items-center space-x-2 justify-end mt-4">
                        <button onClick={() => handleUpdateMapPoint(point.id, point)} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"><Settings size={18} /></button>
                        <button onClick={() => handleDeleteMapPoint(point.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "connection" && (
              <motion.div key="connection" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-8">
                 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-xl font-bold text-white">Editar Sección Conexión</h3>
                       <button onClick={handleSaveConnection} disabled={isSaving} className="flex items-center space-x-2 bg-blue-700 text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50 cursor-pointer">
                         {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                         <span>Guardar</span>
                       </button>
                    </div>

                    <div className="space-y-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Título</label>
                         <input
                           type="text"
                           value={connectionData.titulo}
                           onChange={e => setConnectionData({ ...connectionData, titulo: e.target.value })}
                           className="w-full bg-black border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
                         />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Subtítulo</label>
                         <textarea
                           value={connectionData.subtitulo}
                           onChange={e => setConnectionData({ ...connectionData, subtitulo: e.target.value })}
                           className="w-full bg-black border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all h-28 resize-none"
                         />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Texto del Botón</label>
                         <input
                           type="text"
                           value={connectionData.buttonText}
                           onChange={e => setConnectionData({ ...connectionData, buttonText: e.target.value })}
                           className="w-full bg-black border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
                         />
                       </div>
                       {connectionData.features.map((feature, index) => (
                         <div key={index}>
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{`Feature ${index + 1}`}</label>
                           <input
                             type="text"
                             value={feature}
                             onChange={(e) => {
                               const updated = [...connectionData.features];
                               updated[index] = e.target.value;
                               setConnectionData({ ...connectionData, features: updated });
                             }}
                             className="w-full bg-black border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
                           />
                         </div>
                       ))}
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                 <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black text-white">Editar Mi Perfil</h2>
                    <button onClick={() => setShowProfileModal(false)} className="p-2 text-slate-500 hover:text-white transition-colors cursor-pointer">
                      <X size={24} />
                    </button>
                 </div>

                 <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Nombre Mostrado</label>
                      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-400 font-bold text-lg">
                        {adminUser?.name}
                      </div>
                      <p className="text-[10px] text-slate-600 mt-2 italic font-medium">El nombre se modifica desde Configuración.</p>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-5">Foto de Perfil</label>
                      
                      <div className="bg-slate-900/30 border border-slate-800 rounded-[2rem] p-6 flex items-center">
                         <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-slate-800 group bg-slate-900">
                            {adminUser?.image ? (
                              <Image src={adminUser.image} alt="P" fill sizes="96px" className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-700 text-3xl font-black">{adminUser?.name?.[0]}</div>
                            )}
                         </div>
                         <div className="ml-6 flex-1">
                            <h4 className="font-bold text-white text-lg leading-none mb-1">Vista Previa</h4>
                            <p className="text-xs text-slate-500 mb-4">Así te verás en el panel.</p>
                            <button
                              onClick={async () => {
                                const res = await removeProfilePhoto("henro@gmail.com");
                                if (res.success) {
                                  setAdminUser({ ...adminUser, image: null });
                                  toast.success("Foto eliminada");
                                } else {
                                  toast.error("No se pudo quitar la foto");
                                }
                              }}
                              className="text-red-500 text-xs font-black uppercase tracking-tighter hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              Quitar Imagen
                            </button>
                         </div>
                      </div>

                      <div className="mt-6">
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center justify-center space-x-3 py-5 border-2 border-dashed border-slate-800 rounded-2xl text-slate-400 hover:text-white hover:border-slate-600 transition-all font-bold group cursor-pointer"
                        >
                           <Camera className="group-hover:scale-110 transition-transform" />
                           <span>Cambiar mi foto actual...</span>
                        </button>
                      </div>
                    </div>
                 </div>

                 <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between">
                    <button onClick={handleLogout} className="text-red-500 font-black text-sm uppercase hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all cursor-pointer">Cerrar Sesion</button>
                    <div className="flex items-center space-x-4">
                       <button onClick={() => setShowProfileModal(false)} className="text-slate-400 font-bold text-sm hover:text-white transition-colors cursor-pointer">Cancelar</button>
                       <button onClick={() => setShowProfileModal(false)} className="bg-blue-900 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-950/40 hover:bg-blue-800 transition-all active:scale-95 cursor-pointer">Guardar Perfil</button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
