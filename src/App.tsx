import React, { useState, useEffect } from "react";
import { 
  Pizza, 
  Calendar, 
  Users, 
  Clock, 
  Phone, 
  User, 
  Check, 
  Settings, 
  Trash2, 
  Search, 
  Lock, 
  RefreshCw, 
  X, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import reypizzalibreLogo from "./logo.jpg";

// --- Types ---
interface PizzaItem {
  id: string;
  name: string;
  column: 1 | 2;
  ingredients: string;
  defaultPrice: number;
}

interface Reservation {
  id: string;
  name: string;
  guests: number;
  date: string;
  time: string;
  phone: string;
  createdAt: string;
}

// --- Raw pizza menu data exact list ordered by Column ---
const INITIAL_PIZZAS: PizzaItem[] = [
  // Columna 1
  { id: "napolitana-provenzal", name: "Napolitana con provenzal", column: 1, ingredients: "Salsa de tomate, muzzarella, rodajas de tomate natural, ajo picado, perejil fresco y aceite de oliva.", defaultPrice: 17500 },
  { id: "napolitana", name: "Napolitana", column: 1, ingredients: "Salsa de tomate, muzzarella, rodajas de tomate maduro, orégano de campo y aceitunas verdes.", defaultPrice: 16500 },
  { id: "provenzal", name: "Provenzal", column: 1, ingredients: "Base de muzzarella premium con una lluvia generosa de ajo fresco fileteado y perejil aromatizado.", defaultPrice: 16000 },
  { id: "aceitunas", name: "Aceitunas", column: 1, ingredients: "Doble cobertura de muzzarella hilada coronada con una lluvia de aceitunas verdes seleccionadas.", defaultPrice: 15500 },
  { id: "anchoas", name: "Anchoas", column: 1, ingredients: "Salsa de tomate casera artesanal, filetes de anchoas saladas de primera y aceite de oliva.", defaultPrice: 18500 },
  { id: "calabreza", name: "Calabreza", column: 1, ingredients: "Salsa de tomate, muzzarella, rodajas de longaniza calabresa crocante, pimienta negra y aceitunas.", defaultPrice: 18900 },
  { id: "salchicha", name: "Salchicha", column: 1, ingredients: "Muzzarella, salchicha alemana de primera fileteada y un suave toque de mostaza dulce tostada.", defaultPrice: 17000 },
  { id: "panceta", name: "Panceta", column: 1, ingredients: "Muzzarella y crujientes láminas de panceta ahumada doradas al horno de barro con orégano.", defaultPrice: 18500 },
  { id: "panceta-huevo", name: "Panceta y huevo", column: 1, ingredients: "Muzzarella, panceta ahumada crujiente y una fina lluvia de huevo duro rallado al instante.", defaultPrice: 19500 },
  { id: "panceta-ciruela", name: "Panceta y ciruela", column: 1, ingredients: "Muzzarella, panceta crocante y rodajas finas de ciruela dulce en dulce contraste.", defaultPrice: 19500 },
  { id: "roquefort", name: "Roquefort", column: 1, ingredients: "Base de muzzarella gratinada y vetas de auténtico queso azul Roquefort fundido de sabor intenso.", defaultPrice: 18555 },
  { id: "papitas", name: "Papitas", column: 1, ingredients: "Muzzarella fundida cubierta con crocantes y sequitas papas pay hilo doradas al horno.", defaultPrice: 16800 },
  { id: "pollo", name: "Pollo", column: 1, ingredients: "Muzzarella, pechuga de pollo desmenuzada al verdeo, finas hierbas y un toque de crema.", defaultPrice: 17800 },
  { id: "morron", name: "Morron", column: 1, ingredients: "Salsa de tomate, muzzarella y abundantes corazones de morrón asado al horno de leña.", defaultPrice: 16200 },
  { id: "palmitos", name: "Palmitos", column: 1, ingredients: "Muzzarella, tiernos palmitos seleccionados cortados en rodajas, jamón cocido y salsa golf.", defaultPrice: 19800 },
  { id: "anana", name: "Anana", column: 1, ingredients: "Muzzarella, rodajas de ananá caramelizadas, jamón y una sutil pizca de azúcar negra tostada.", defaultPrice: 19200 },
  { id: "primavera", name: "Primavera", column: 1, ingredients: "Muzzarella, jamón cocido, huevo duro picado, rodajas de tomate fresco y morrones asados.", defaultPrice: 19000 },
  { id: "jamon-morron", name: "Jamon y morron", column: 1, ingredients: "Salsa de tomate, muzzarella, láminas de jamón cocido y tiritas de morrón asado dulce.", defaultPrice: 18200 },
  { id: "jamon", name: "Jamon", column: 1, ingredients: "Salsa de tomate, muzzarella abundante y fetas seleccionadas de jamón cocido tierno.", defaultPrice: 17200 },

  // Columna 2
  { id: "verdeo", name: "Verdeo", column: 2, ingredients: "Base de muzzarella, cebolla de verdeo fresca salteada en manteca y queso parmesano gratinado.", defaultPrice: 16800 },
  { id: "choclo", name: "Choclo", column: 2, ingredients: "Muzzarella, granos tiernos de choclo dulce en crema de choclo casera y pizca de nuez moscada.", defaultPrice: 16500 },
  { id: "criolla", name: "Criolla", column: 2, ingredients: "Muzzarella con salsa criolla artesanal (cebolla picada, morrones de dos colores, tomate y oliva).", defaultPrice: 16500 },
  { id: "acelga-salsa-blanca", name: "Acelga con salsa blanca", column: 2, ingredients: "Crema de acelga fresca al vapor ligada en salsa blanca perfumada, y queso provolone rayado.", defaultPrice: 17000 },
  { id: "champinon", name: "Champinon", column: 2, ingredients: "Muzzarella saborizada con champiñones parís laminados salteados al ajillo y perejil fresco.", defaultPrice: 18850 },
  { id: "cancha", name: "Cancha", column: 2, ingredients: "Pizza tradicional sin muzzarella, con base crujiente de salsa de tomate espesa súper sazonada.", defaultPrice: 15000 },
  { id: "provolone", name: "Provolone", column: 2, ingredients: "Muzzarella, rodajas de provolone curado, orégano silvestre y un hilo de aceite de oliva.", defaultPrice: 19500 },
  { id: "rucula", name: "Rucula", column: 2, ingredients: "Muzzarella, hojas de rúcula selvática fresca, láminas de jamón crudo y lluvia de parmesano.", defaultPrice: 19200 },
  { id: "huevo", name: "Huevo", column: 2, ingredients: "Salsa de tomate, muzzarella derretida, huevo duro picado grueso, orégano y aceitunas negras.", defaultPrice: 15800 },
  { id: "atun", name: "Atun", column: 2, ingredients: "Muzzarella fundida con atún premium desmenuzado, plumas de cebolla dulce y aceitunas negras.", defaultPrice: 19800 },
  { id: "cantimpalo", name: "Cantimpalo", column: 2, ingredients: "Muzzarella de primera con rodajas finas de cantimpalo español curado de sabor intenso.", defaultPrice: 18900 },
  { id: "mortadela", name: "Mortadela", column: 2, ingredients: "Muzzarella dorada, finas fetas de mortadela con pistachos, un hilo de pesto y albahaca.", defaultPrice: 18500 },
  { id: "albahaca", name: "Albahaca", column: 2, ingredients: "Salsa de tomate premium, muzzarella derretida, hojas frescas de albahaca y aceite de oliva.", defaultPrice: 15800 },
  { id: "muzzarella", name: "Muzzarella", column: 2, ingredients: "Salsa de tomate casera de la casa, abundante muzzarella fundida, orégano premium y aceitunas.", defaultPrice: 15000 },
  { id: "fugazzeta", name: "Fugazzeta", column: 2, ingredients: "Base de muzzarella de la casa cubierta con cebolla blanca fileteada dulce rehogada al horno.", defaultPrice: 15800 },
  { id: "fugazzeta-rellena", name: "Fugazzeta rellena", column: 2, ingredients: "Doble masa casera rellena con jamón y muzzarella, dorada con abundante cebolla y parmesano.", defaultPrice: 20000 },
  { id: "faina", name: "Faina", column: 2, ingredients: "Porción de deliciosa y crocante masa de harina de garbanzos tradicional italiana.", defaultPrice: 15000 },
  { id: "faina-cebolla", name: "Faina con cebolla", column: 2, ingredients: "Masa de fainá artesanal de garbanzos cubierta con cebollas fileteadas caramelizadas.", defaultPrice: 15500 },
  { id: "faina-verdeo", name: "Faina con verdeo", column: 2, ingredients: "Fainá crocante espolvoreada con cebolla de verdeo sazonada y aceite de oliva extra virgen.", defaultPrice: 15500 }
];

export default function App() {
  // --- States ---
  const [pizzas, setPizzas] = useState<PizzaItem[]>(() => {
    const saved = localStorage.getItem("rey_pizza_menu_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error al cargar pizzas de localStorage, usando por defecto", e);
      }
    }
    return INITIAL_PIZZAS;
  });

  const [weekdayPrice, setWeekdayPrice] = useState<number>(() => {
    const saved = localStorage.getItem("rey_pizza_weekday_price_v2");
    return saved ? parseInt(saved, 10) : 13900;
  });

  const [weekendPrice, setWeekendPrice] = useState<number>(() => {
    const saved = localStorage.getItem("rey_pizza_weekend_price_v2");
    return saved ? parseInt(saved, 10) : 14900;
  });

  const [bookingList, setBookingList] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem("rey_pizza_reservas");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredPizza, setHoveredPizza] = useState<PizzaItem | null>(null);
  
  // Mobile accordion / column tab controls
  const [activeMobileTab, setActiveMobileTab] = useState<"menu" | "reservar">("menu");

  // Reservation form states
  const [formName, setFormName] = useState("");
  const [formGuests, setFormGuests] = useState(2);
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Administration modal states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [tempWeekdayPrice, setTempWeekdayPrice] = useState(weekdayPrice);
  const [tempWeekendPrice, setTempWeekendPrice] = useState(weekendPrice);
  const [adminPizzas, setAdminPizzas] = useState<PizzaItem[]>([]);
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [adminNotification, setAdminNotification] = useState("");

  // Logo fallback safety state
  const [logoError, setLogoError] = useState(false);

  // Initialize admin local pizza edit pricing
  useEffect(() => {
    if (isAdminOpen) {
      setAdminPizzas(JSON.parse(JSON.stringify(pizzas))); // deep clone
      setTempWeekdayPrice(weekdayPrice);
      setTempWeekendPrice(weekendPrice);
      setAdminSearchQuery("");
      setAdminNotification("");
    }
  }, [isAdminOpen, pizzas, weekdayPrice, weekendPrice]);

  // Format Helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Resolve service price based on weekday of date
  const getPriceForDate = (dateStr: string) => {
    if (!dateStr) return weekdayPrice;
    try {
      const dateObj = new Date(dateStr + "T00:00:00");
      const day = dateObj.getDay(); // 0 is Sunday, 1 is Monday, etc.
      // Lunes a Miercoles = 1, 2, 3
      if (day >= 1 && day <= 3) {
        return weekdayPrice;
      }
      return weekendPrice;
    } catch {
      return weekdayPrice;
    }
  };

  // Submit Reservation
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDate || !formTime || !formPhone || formGuests < 1) {
      alert("Por favor complete todos los campos requeridos.");
      return;
    }

    setIsSubmittingBooking(true);

    // Simulate clean, serious process delay
    setTimeout(() => {
      const newBooking: Reservation = {
        id: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
        name: formName,
        guests: formGuests,
        date: formDate,
        time: formTime,
        phone: formPhone,
        createdAt: new Date().toISOString()
      };

      const updated = [newBooking, ...bookingList];
      setBookingList(updated);
      localStorage.setItem("rey_pizza_reservas", JSON.stringify(updated));

      setConfirmedBooking(newBooking);
      setIsSubmittingBooking(false);

      // Clean inputs
      setFormName("");
      setFormGuests(2);
      setFormDate("");
      setFormTime("");
      setFormPhone("");
    }, 1200);
  };

  // Save changes from Admin Panel
  const handleSaveAdminPrices = () => {
    setPizzas(adminPizzas);
    setWeekdayPrice(tempWeekdayPrice);
    setWeekendPrice(tempWeekendPrice);
    
    localStorage.setItem("rey_pizza_menu_v2", JSON.stringify(adminPizzas));
    localStorage.setItem("rey_pizza_weekday_price_v2", tempWeekdayPrice.toString());
    localStorage.setItem("rey_pizza_weekend_price_v2", tempWeekendPrice.toString());

    setAdminNotification("¡Cambios guardados con éxito e impactados inmediatamente!");
    setTimeout(() => {
      setAdminNotification("");
      setIsAdminOpen(false);
    }, 1500);
  };

  // Restore factory prices
  const handleRestoreDefaultPrices = () => {
    if (confirm("¿Está seguro que desea restaurar todos los precios por defecto?")) {
      setPizzas(INITIAL_PIZZAS);
      setWeekdayPrice(13900);
      setWeekendPrice(14900);
      localStorage.removeItem("rey_pizza_menu_v2");
      localStorage.removeItem("rey_pizza_weekday_price_v2");
      localStorage.removeItem("rey_pizza_weekend_price_v2");
      setAdminPizzas(JSON.parse(JSON.stringify(INITIAL_PIZZAS)));
      setTempWeekdayPrice(13900);
      setTempWeekendPrice(14900);
      setAdminNotification("¡Precios por defecto restaurados!");
      setTimeout(() => setAdminNotification(""), 2200);
    }
  };

  // Cancel reservation in Admin Panel
  const handleDeleteBooking = (id: string) => {
    if (confirm("¿Desactivar o cancelar esta reserva?")) {
      const updated = bookingList.filter(b => b.id !== id);
      setBookingList(updated);
      localStorage.setItem("rey_pizza_reservas", JSON.stringify(updated));
    }
  };

  // Filter pizzas based on main menu search
  const filteredPizzas = pizzas.filter(pizza => 
    pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    pizza.ingredients.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const col1Pizzas = filteredPizzas.filter(p => p.column === 1);
  const col2Pizzas = filteredPizzas.filter(p => p.column === 2);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-zinc-950 font-sans leading-relaxed relative overflow-x-hidden">
      
      {/* Background ambient light details */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-red-600/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      
      {/* HEADER SECTION */}
      <header className="border-b border-zinc-800/60 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
        <div id="header-container" className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Brand - Logo + Name */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-amber-500/80 bg-zinc-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
              {!logoError ? (
                <img 
                  id="brand-logo" 
                  src={reypizzalibreLogo} 
                  alt="El Rey Pizza Libre Logo" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                  onError={() => setLogoError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                /* Sophisticated fallback SVG logo */
                <div className="flex flex-col items-center justify-center text-amber-500 select-none">
                  <span className="text-[10px] font-bold font-serif leading-none tracking-widest">EL REY</span>
                  <Pizza className="w-5 h-5 text-amber-500 mt-0.5 animate-pulse" />
                  <span className="text-[7px] font-semibold leading-none tracking-tight">PIZZA</span>
                </div>
              )}
              {/* Little golden crown ornament */}
              <div className="absolute -top-1 right-2 text-amber-400 drop-shadow-md">
                <span className="text-sm font-serif">♛</span>
              </div>
            </div>

            <div className="flex flex-col text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <h1 className="font-serif font-black text-xl md:text-2xl tracking-tight text-white uppercase flex items-center gap-1.5">
                  El Rey <span className="text-amber-500">Pizza Libre</span>
                </h1>
              </div>
              <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium mt-0.5 sm:mt-0">
                La experiencia definitiva en sabor y abundancia
              </p>
            </div>
          </div>

          {/* Pricing indicator block */}
          <div className="flex justify-center sm:justify-end items-center gap-4 bg-zinc-950/80 px-4 py-2 rounded-lg border border-amber-500/20 shadow-md">
            <div className="text-center sm:text-right">
              <div className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-wider leading-none">
                Lun a Mier
              </div>
              <div className="text-sm font-bold text-white font-serif mt-1">
                {formatCurrency(weekdayPrice)} <span className="text-[9px] text-zinc-400 font-sans font-normal lowercase">/ pers.</span>
              </div>
            </div>
            <div className="h-6 w-[1px] bg-zinc-800"></div>
            <div className="text-center sm:text-left">
              <div className="text-[9px] font-mono text-red-500 font-bold uppercase tracking-wider leading-none">
                Jue a Dom
              </div>
              <div className="text-sm font-bold text-white font-serif mt-1">
                {formatCurrency(weekendPrice)} <span className="text-[9px] text-zinc-400 font-sans font-normal lowercase">/ pers.</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* MOBILE TAB CHANGER */}
      <div className="sm:hidden border-b border-zinc-900 bg-zinc-950/90 flex sticky top-[73px] z-30">
        <button
          onClick={() => setActiveMobileTab("menu")}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-colors ${
            activeMobileTab === "menu"
              ? "border-amber-500 text-amber-500 font-serif"
              : "border-transparent text-zinc-400"
          }`}
        >
          🍕 Ver el Menú
        </button>
        <button
          onClick={() => setActiveMobileTab("reservar")}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-colors ${
            activeMobileTab === "reservar"
              ? "border-red-600 text-red-500 font-serif"
              : "border-transparent text-zinc-400"
          }`}
        >
          ✉ Reservar Mesa
        </button>
      </div>

      {/* MAIN LAYOUT GRID */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* LEFT COLUMN: THE COMPACT MENU (7/10 spans on desktop) */}
        <section 
          id="menu-section"
          className={`lg:col-span-7 flex flex-col bg-zinc-900/40 border border-zinc-900/85 rounded-xl p-4 md:p-5 shadow-2xl relative ${
            activeMobileTab === "reservar" ? "hidden sm:flex" : "flex"
          }`}
        >
          
          {/* Menu Title, Quick Search and Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-zinc-800/60">
            <div>
              <h2 className="text-lg md:text-xl font-serif font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-amber-500 rounded-sm"></span>
                Gustos Incluidos en el Menú
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {searchQuery ? `Mostrando ${filteredPizzas.length} de ${pizzas.length} variedades` : "Selección rotativa de ingredientes y porciones recién horneados"}
              </p>
            </div>

            {/* Quick Keyword Search input */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar gusto (ej. panceta, verdeo)..."
                className="w-full bg-zinc-950/90 text-zinc-200 placeholder:text-zinc-650 text-xs py-2 pl-9 pr-8 rounded-md border border-zinc-800 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all duration-255"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* COMPACT PIZZA GRID CONTAINER */}
          <div className="flex-1 flex flex-col justify-between">
            {filteredPizzas.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-3">
                <Pizza className="w-12 h-12 text-zinc-700 stroke-[1.2]" />
                <p className="font-serif text-sm">No encontramos ningún gusto que coincida con "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-amber-500 underline hover:text-amber-400"
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-2 sm:gap-x-6 gap-y-1.5 sm:gap-y-4">
                
                {/* COLUMN 1 COMPARTMENT */}
                <div className="flex flex-col">
                  {/* Collapsible header on mobile, standard label on desktop */}
                  <div className="flex justify-between items-center py-1 px-1.5 mb-1.5 rounded bg-zinc-950/45 border-l-2 border-amber-500">
                    <span className="text-[9px] sm:text-xs font-serif font-black uppercase text-amber-400 tracking-wide">
                      <span className="hidden xs:inline">Especialidades </span>Tradicionales
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5 sm:gap-1">
                    {col1Pizzas.map((pizza) => (
                      <div
                        key={pizza.id}
                        onMouseEnter={() => setHoveredPizza(pizza)}
                        onMouseLeave={() => setHoveredPizza(null)}
                        className="group flex flex-col py-0.5 sm:py-1 px-1 sm:px-2 rounded hover:bg-zinc-950/30 transition-all duration-150 border border-transparent hover:border-zinc-800/40 relative cursor-help"
                      >
                        <div className="flex items-center justify-between gap-1">
                          {/* Pizza Dot Indicator */}
                          <div className="flex items-center gap-1 sm:gap-1.5 overflow-hidden">
                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-amber-500 shrink-0 group-hover:scale-120 group-hover:bg-red-500 transition-all"></span>
                            <span className="text-[10px] sm:text-xs md:text-[13px] font-medium text-zinc-200 group-hover:text-white truncate">
                              {pizza.name}
                            </span>
                          </div>
                          {/* Dot lines connector */}
                          <div className="flex-1 border-b border-dotted border-zinc-805/60 mx-1 group-hover:border-zinc-700/60"></div>
                          {/* Price label */}
                          <span className="text-[9.5px] sm:text-xs font-mono font-bold text-amber-500/90 group-hover:text-amber-400 tracking-tight shrink-0 bg-zinc-950/40 px-1 py-0.5 rounded border border-zinc-900">
                            {formatCurrency(pizza.defaultPrice)}
                          </span>
                        </div>
                        
                        {/* Mobile inline ingredients showing or brief inline details */}
                        <p className="text-[8.5px] sm:text-[10px] text-zinc-450 truncate mt-0.5 max-w-[95%] italic font-light leading-none">
                          {pizza.ingredients}
                        </p>
                      </div>
                    ))}
                    {col1Pizzas.length === 0 && (
                      <span className="text-[11px] text-zinc-500 italic py-2 pl-2">Ningún gusto encontrado</span>
                    )}
                  </div>
                </div>

                {/* COLUMN 2 COMPARTMENT */}
                <div className="flex flex-col">
                  {/* Collapsible header on mobile */}
                  <div className="flex justify-between items-center py-1 px-1.5 mb-1.5 rounded bg-zinc-950/45 border-l-2 border-red-500">
                    <span className="text-[9px] sm:text-xs font-serif font-black uppercase text-red-500 tracking-wide">
                      <span className="hidden xs:inline">Gourmet y </span>Tradición
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5 sm:gap-1">
                    {col2Pizzas.map((pizza) => (
                      <div
                        key={pizza.id}
                        onMouseEnter={() => setHoveredPizza(pizza)}
                        onMouseLeave={() => setHoveredPizza(null)}
                        className="group flex flex-col py-0.5 sm:py-1 px-1 sm:px-2 rounded hover:bg-zinc-950/30 transition-all duration-150 border border-transparent hover:border-zinc-800/40 relative cursor-help"
                      >
                        <div className="flex items-center justify-between gap-1">
                          {/* Pizza Dot Indicator */}
                          <div className="flex items-center gap-1 sm:gap-1.5 overflow-hidden">
                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-red-600 shrink-0 group-hover:scale-120 group-hover:bg-amber-500 transition-all"></span>
                            <span className="text-[10px] sm:text-xs md:text-[13px] font-medium text-zinc-200 group-hover:text-white truncate">
                              {pizza.name}
                            </span>
                          </div>
                          {/* Dot lines connector */}
                          <div className="flex-1 border-b border-dotted border-zinc-805/60 mx-1 group-hover:border-zinc-700/60"></div>
                          {/* Price label */}
                          <span className="text-[9.5px] sm:text-xs font-mono font-bold text-amber-500/90 group-hover:text-amber-400 tracking-tight shrink-0 bg-zinc-950/40 px-1 py-0.5 rounded border border-zinc-900">
                            {formatCurrency(pizza.defaultPrice)}
                          </span>
                        </div>
                        
                        {/* Mobile inline ingredients showing */}
                        <p className="text-[8.5px] sm:text-[10px] text-zinc-450 truncate mt-0.5 max-w-[95%] italic font-light leading-none">
                          {pizza.ingredients}
                        </p>
                      </div>
                    ))}
                    {col2Pizzas.length === 0 && (
                      <span className="text-[11px] text-zinc-500 italic py-2 pl-2">Ningún gusto encontrado</span>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* DYNAMIC REAL-TIME INGREDIENTS BANNER (DESKTOP SPECIFIC SAVED SPACE) */}
            <div className="hidden sm:block mt-4 p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-lg min-h-[56px] flex items-center gap-3 transition-all duration-200">
              <div className="text-amber-500 shrink-0">
                <Info className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                {hoveredPizza ? (
                  <motion.div
                    key={hoveredPizza.id}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="text-xs font-serif font-bold text-white uppercase tracking-wider block">
                      Ingredientes - {hoveredPizza.name}
                    </span>
                    <span className="text-xs text-zinc-400 mt-0.5 block leading-normal italic">
                      {hoveredPizza.ingredients}
                    </span>
                  </motion.div>
                ) : (
                  <span className="text-xs text-zinc-500 block leading-normal italic">
                    Pase con el puntero sobre cualquier gusto de pizza para ver el detalle de sus ingredientes reales y elaboración.
                  </span>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* RIGHT COLUMN: BOOKINGS & GENERAL CONTROLS (3/10 spans on desktop) */}
        <section 
          id="booking-section"
          className={`lg:col-span-3 flex flex-col gap-5 ${
            activeMobileTab === "menu" ? "hidden sm:flex" : "flex"
          }`}
        >
          
          {/* BOOKING FORM MODULE */}
          <div className="bg-zinc-900/40 border border-zinc-900/85 rounded-xl p-4 md:p-5 shadow-2x flex flex-col gap-4 relative">
            <div className="border-b border-zinc-800/60 pb-3">
              <h2 className="text-base md:text-lg font-serif font-black text-white tracking-wide uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-red-600 rounded-sm"></span>
                RESERVA
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Reserve su lugar para el almuerzo o cena libre
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!confirmedBooking ? (
                /* Dynamic Booking form state */
                <motion.form 
                  key="booking-form"
                  onSubmit={handleBookingSubmit}
                  className="space-y-3.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Full Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-450 tracking-wider font-semibold">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-zinc-950 text-xs py-2.5 pl-9 pr-4 rounded-md border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 outline-none transition-all duration-150 text-white"
                      />
                    </div>
                  </div>

                  {/* Quantity and Telephone row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-450 tracking-wider font-semibold">
                        Comensales *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-500">
                          <Users className="w-4 h-4" />
                        </span>
                        <input
                          type="number"
                          min="1"
                          max="40"
                          required
                          value={formGuests}
                          onChange={(e) => setFormGuests(Math.max(1, parseInt(e.target.value, 10)))}
                          className="w-full bg-zinc-950 text-xs py-2.5 pl-9 pr-2 rounded-md border border-zinc-800 focus:border-red-500 outline-none transition-all duration-150 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-450 tracking-wider font-semibold">
                        Teléfono *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-500">
                          <Phone className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="tel"
                          required
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder="Cod. Área + Nro"
                          className="w-full bg-zinc-950 text-xs py-2.5 pl-9 pr-2 rounded-md border border-zinc-800 focus:border-red-500 outline-none transition-all duration-150 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date and Time row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-450 tracking-wider font-semibold">
                        Fecha *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-500 pointer-events-none">
                          <Calendar className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="date"
                          required
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          className="w-full bg-zinc-950 text-xs py-2.5 pl-8 pr-1 rounded-md border border-zinc-800 focus:border-red-500 outline-none transition-all duration-150 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-450 tracking-wider font-semibold">
                        Horario *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-500 pointer-events-none">
                          <Clock className="w-3.5 h-3.5" />
                        </span>
                        <select
                          required
                          value={formTime}
                          onChange={(e) => setFormTime(e.target.value)}
                          className="w-full bg-zinc-950 text-xs py-2.5 pl-8 pr-1 rounded-md border border-zinc-800 focus:border-red-500 outline-none transition-all duration-150 text-white font-mono"
                        >
                          <option value="">Seleccionar</option>
                          <option value="12:00">12:00 Almuerzo</option>
                          <option value="13:00">13:00 Almuerzo</option>
                          <option value="14:00">14:00 Almuerzo</option>
                          <option value="20:30">20:30 Cena</option>
                          <option value="21:30">21:30 Cena</option>
                          <option value="22:30">22:30 Cena</option>
                          <option value="23:30">23:30 Cena</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Submission CTA Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full md:mt-1 bg-red-600 hover:bg-red-700 active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-550 disabled:scale-100 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-md shadow-lg shadow-red-600/10 cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    {isSubmittingBooking ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Procesando Reserva...
                      </>
                    ) : (
                      <>
                        Confirmar Reserva
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-zinc-450 text-center leading-normal mt-2 italic">
                    * El envío procesará su solicitud de mesa vinculando los datos locales al panel de administración.
                  </p>
                </motion.form>
              ) : (
                /* Beautiful commercial receipt confirmation screen */
                <motion.div 
                  key="booking-success"
                  className="bg-white text-zinc-950 p-4 rounded-lg font-mono text-xs shadow-xl border-t-8 border-amber-500 relative flex flex-col gap-2 overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Decorative safety circle cuts on sides resembling a real machine ticket */}
                  <div className="absolute top-1/2 -left-2 w-4 h-4 bg-zinc-950 rounded-full"></div>
                  <div className="absolute top-1/2 -right-2 w-4 h-4 bg-zinc-950 rounded-full"></div>

                  <div className="text-center font-serif font-black text-sm uppercase tracking-wide border-b border-dashed border-zinc-300 pb-2 mb-1">
                    👑 El Rey Pizza Libre 👑
                  </div>

                  <div className="text-center text-[10px] text-zinc-500 -mt-1 pb-1">
                    RECOMPANTE DE RESERVA
                  </div>

                  <div className="flex justify-between font-bold text-[11px] mb-1">
                    <span>CÓDIGO:</span>
                    <span className="text-red-700">{confirmedBooking.id}</span>
                  </div>

                  <div className="space-y-1 text-zinc-700 border-b border-dashed border-zinc-300 pb-2 text-[11px]">
                    <div className="flex justify-between">
                      <span>CLIENTE:</span>
                      <span className="text-zinc-950 font-bold truncate max-w-[150px]">{confirmedBooking.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>COMENSALES:</span>
                      <span className="text-zinc-950 font-bold">{confirmedBooking.guests} Personas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FECHA:</span>
                      <span className="text-zinc-950 font-bold">{confirmedBooking.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HORARIO:</span>
                      <span className="text-zinc-950 font-bold">{confirmedBooking.time} hs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TELÉFONO:</span>
                      <span className="text-zinc-950 font-mono font-semibold">{confirmedBooking.phone}</span>
                    </div>
                  </div>

                  <div className="py-1 text-center font-bold text-zinc-900 border-b border-zinc-200 text-xs">
                    Sugerido Pizza Libre: {formatCurrency(getPriceForDate(confirmedBooking.date) * confirmedBooking.guests)}
                    <span className="block text-[9px] text-zinc-500 font-normal mt-0.5">
                      ({formatCurrency(getPriceForDate(confirmedBooking.date))} por persona)
                    </span>
                  </div>

                  <div className="text-[10px] text-center text-zinc-500 mt-1 italic leading-normal">
                    Gracias por elegirnos. Presente este comprobante digital o su ID en recepción al ingresar.
                  </div>

                  <button
                    onClick={() => setConfirmedBooking(null)}
                    className="w-full mt-3 bg-zinc-900 hover:bg-black text-white py-2 px-3 rounded font-sans text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Crear nueva reserva
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* QUICK RULES INTERACTIVE BLOCK */}
          <div className="bg-zinc-900/20 border border-zinc-900/60 rounded-xl p-4 flex flex-col gap-2">
            <h3 className="text-xs font-serif font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              TÉRMINOS DE LA CASA
            </h3>
            <ul className="text-[11px] text-zinc-400 space-y-2 list-none pl-0">
              <li className="flex gap-1.5 items-start">
                <span className="text-amber-500 font-bold">✓</span>
                <span><strong>Consumición Libre:</strong> Pruebe y repita las veces que quiera entre las 38 variedades clásicas.</span>
              </li>
              <li className="flex gap-1.5 items-start">
                <span className="text-amber-500 font-bold">✓</span>
                <span><strong>No acumulable:</strong> El consumo es únicamente para comer dentro del salón, evite desperdicios.</span>
              </li>
              <li className="flex gap-1.5 items-start">
                <span className="text-amber-500 font-bold">✓</span>
                <span><strong>Menores:</strong> Descuentos exclusivos para menores de 10 años que se abonan directo en caja.</span>
              </li>
            </ul>
          </div>

        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-5 mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-zinc-500 text-xs text-zinc-450">
          
          <div>
            <div className="font-serif text-sm font-semibold text-zinc-350">
              El Rey Pizza Libre © {new Date().getFullYear()}
            </div>
          </div>

          {/* Quick contact tags */}
          <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-mono">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-500" /> Goya 815, Ituzaingó
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-red-500" /> 011 6403-6124
            </span>
          </div>

          {/* Discret administration panel toggle action */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 hover:text-white px-3 py-1.5 rounded-md border border-zinc-800 text-zinc-400 text-xs font-medium cursor-pointer tracking-wide transition-all"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-500" />
            Panel de Administración
          </button>

        </div>
      </footer>

      {/* --- ADMINISTRATION PANEL MODAL --- */}
      <AnimatePresence>
        {isAdminOpen && (
          <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              id="admin-modal"
              className="bg-zinc-900 border border-zinc-850 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* Modal Header */}
              <div className="bg-zinc-950 p-4 flex items-center justify-between border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-white uppercase tracking-wide">
                      Panel de Control de Administración
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      EL REY PIZZA LIBRE LOCAL ENGINE • ESTADO EN TIEMPO REAL
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAdminOpen(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-md bg-zinc-900 border border-zinc-850 hover:bg-red-950/40"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content - Scrollable area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">
                
                {/* Admin alerts */}
                {adminNotification && (
                  <div className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 p-3 rounded-lg text-xs font-semibold animate-pulse flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {adminNotification}
                  </div>
                )}

                {/* 1. Global pricing configuration block */}
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-3 md:p-4 space-y-4">
                  <h4 className="text-xs font-serif font-black text-amber-400 uppercase tracking-widest pb-2 border-b border-zinc-800/60">
                    Precios de Servicio "Pizza Libre"
                  </h4>
                  
                  {/* Weekday Price */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[10px] text-zinc-300 uppercase font-mono tracking-wider font-bold">
                        Lunes a Miércoles (ARS)
                      </label>
                      <span className="text-[11px] text-zinc-500 italic">
                        Precio sugerido por persona para los días hábiles.
                      </span>
                    </div>
                    <div className="relative shrink-0 w-full sm:w-44">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 font-mono font-bold">
                        $
                      </span>
                      <input
                        type="number"
                        step="50"
                        min="1000"
                        value={tempWeekdayPrice}
                        onChange={(e) => setTempWeekdayPrice(Math.max(1000, parseInt(e.target.value, 10) || 0))}
                        className="w-full bg-zinc-950 text-white font-mono font-bold text-xs py-2 pl-7 pr-3 rounded-md border border-zinc-850 focus:border-amber-500 outline-none text-right"
                      />
                    </div>
                  </div>

                  {/* Weekend Price */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-900">
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[10px] text-zinc-300 uppercase font-mono tracking-wider font-bold">
                        Jueves a Domingo (ARS)
                      </label>
                      <span className="text-[11px] text-zinc-500 italic">
                        Precio sugerido por persona para fines de semana y feriados.
                      </span>
                    </div>
                    <div className="relative shrink-0 w-full sm:w-44">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 font-mono font-bold">
                        $
                      </span>
                      <input
                        type="number"
                        step="50"
                        min="1000"
                        value={tempWeekendPrice}
                        onChange={(e) => setTempWeekendPrice(Math.max(1000, parseInt(e.target.value, 10) || 0))}
                        className="w-full bg-zinc-950 text-white font-mono font-bold text-xs py-2 pl-7 pr-3 rounded-md border border-zinc-850 focus:border-red-500 outline-none text-right"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. List of tables active reservations logs */}
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-3 md:p-4">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800/60">
                    <h4 className="text-xs font-serif font-black text-red-500 uppercase tracking-widest">
                      Reservas de Mesas Registradas ({bookingList.length})
                    </h4>
                    {bookingList.length > 0 && (
                      <button 
                        onClick={() => {
                          if (confirm("¿Limpiar por completo el registro de reservas locales?")) {
                            setBookingList([]);
                            localStorage.setItem("rey_pizza_reservas", JSON.stringify([]));
                          }
                        }}
                        className="text-[10px] text-red-500 hover:underline uppercase font-mono tracking-wider"
                      >
                        Limpiar todo
                      </button>
                    )}
                  </div>

                  {bookingList.length === 0 ? (
                    <p className="text-zinc-500 text-xs italic py-2">
                       No existen solicitudes de reserva locales almacenadas en el navegador en este momento.
                    </p>
                  ) : (
                    <div className="max-h-40 overflow-y-auto divide-y divide-zinc-800/60 border border-zinc-805 pr-1.5 rounded-lg bg-zinc-950">
                      {bookingList.map((book) => (
                        <div key={book.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-zinc-900/60 transition-all">
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-white font-mono text-[11px]">
                              <span className="text-amber-500">{book.id}</span>
                              <span className="text-zinc-400 font-sans">• {book.name}</span>
                            </div>
                            <div className="text-[10px] text-zinc-400 mt-0.5 space-x-2">
                              <span>📅 {book.date}</span>
                              <span>⏰ {book.time} hs</span>
                              <span>👥 {book.guests} p</span>
                              <span>📞 {book.phone}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteBooking(book.id)}
                            className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-500 border border-zinc-800 transition-all cursor-pointer"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Detailed list of all 38 pizzas prices */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                    <div>
                      <h4 className="text-xs font-serif font-black text-white uppercase tracking-widest">
                        Modificar Precios de Gustos Individuales
                      </h4>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        Edite el valor estimado de venta por tamaño entero sugerido para cada variedad.
                      </p>
                    </div>

                    {/* Filter pizzas inside administrator */}
                    <div className="relative w-full sm:w-48">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-500">
                        <Search className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        value={adminSearchQuery}
                        onChange={(e) => setAdminSearchQuery(e.target.value)}
                        placeholder="Buscar gusto..."
                        className="w-full bg-zinc-950 text-white text-[11px] py-1.5 pl-8 pr-2 rounded border border-zinc-800 focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* List Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 max-h-60 overflow-y-auto pr-1.5 border border-zinc-850 p-2 rounded-lg bg-zinc-950">
                    {adminPizzas
                      .filter(p => p.name.toLowerCase().includes(adminSearchQuery.toLowerCase()))
                      .map((pizza, idx) => {
                        return (
                          <div key={pizza.id} className="flex items-center justify-between p-2 rounded bg-zinc-900/40 border border-zinc-850/60 hover:bg-zinc-900 transition-all">
                            <span className="text-xs font-medium truncate shrink-1 text-zinc-250 max-w-[170px]" title={pizza.name}>
                              {pizza.name} 
                              <span className="text-[9px] text-zinc-500 capitalize block font-mono">Columna {pizza.column}</span>
                            </span>
                            <div className="relative shrink-0 w-28">
                              <span className="absolute inset-y-0 left-2.5 flex items-center text-[10px] text-zinc-450 font-mono font-bold">
                                $
                              </span>
                              <input
                                type="number"
                                step="50"
                                min="0"
                                value={pizza.defaultPrice}
                                onChange={(e) => {
                                  const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                                  const updated = [...adminPizzas];
                                  const matchIdx = updated.findIndex(p => p.id === pizza.id);
                                  if (matchIdx !== -1) {
                                    updated[matchIdx].defaultPrice = val;
                                    setAdminPizzas(updated);
                                  }
                                }}
                                className="w-full bg-zinc-955 text-white font-mono font-semibold text-xs py-1.5 pl-6 pr-1 rounded border border-zinc-800 focus:border-amber-500 outline-none text-right"
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>

              {/* Modal Actions Footer */}
              <div className="bg-zinc-950 p-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={handleRestoreDefaultPrices}
                  className="w-full sm:w-auto text-[11px] font-mono hover:underline uppercase tracking-wide text-zinc-500 hover:text-amber-500 py-2 border border-transparent flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Restaurar por Defecto
                </button>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsAdminOpen(false)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all cursor-pointer"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={handleSaveAdminPrices}
                    className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold rounded bg-red-650 hover:bg-red-700 text-white shadow-lg shadow-red-600/10 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
