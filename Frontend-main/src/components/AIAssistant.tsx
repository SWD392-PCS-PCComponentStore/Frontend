import { useState } from "react";
import { toast } from "sonner";
import { buildPcApi, analyzeApi, getRecommendationsApi } from "@/api/ai";
import {
  Loader2,
  Check,
  Sparkles,
  Cpu,
  Monitor,
  Layers,
  HardDrive,
  Zap,
  Box,
  Wind,
  Layout,
  Brain,
  Star,
  Copy,
  Download,
  Share2,
  ChevronRight,
  AlertTriangle,
  DollarSign,
  Gauge,
  Wrench,
} from "lucide-react";

interface AIAssistantProps {
  onApplyBuild?: (build: any) => void;
}

type Mode = "build" | "analyze" | "recommendations";

const CATEGORY_ICONS: Record<string, any> = {
  cpu: Cpu,
  gpu: Monitor,
  ram: Layers,
  storage: HardDrive,
  psu: Zap,
  case: Box,
  cooler: Wind,
  mainboard: Layout,
  motherboard: Layout,
};

const CATEGORY_COLORS: Record<string, string> = {
  cpu: "from-blue-600 to-blue-400",
  gpu: "from-emerald-600 to-emerald-400",
  ram: "from-purple-600 to-purple-400",
  storage: "from-orange-600 to-orange-400",
  psu: "from-yellow-600 to-yellow-400",
  case: "from-gray-600 to-gray-400",
  cooler: "from-cyan-600 to-cyan-400",
  mainboard: "from-pink-600 to-pink-400",
  motherboard: "from-pink-600 to-pink-400",
};

const CATEGORY_LABELS: Record<string, string> = {
  cpu: "CPU",
  gpu: "GPU",
  ram: "RAM",
  storage: "Ổ cứng",
  psu: "Nguồn",
  case: "Vỏ case",
  cooler: "Tản nhiệt",
  mainboard: "Mainboard",
  motherboard: "Mainboard",
};

const BUILD_TYPE_INFO: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  gaming: { label: "Gaming", icon: "🎮", color: "text-red-400" },
  workstation: { label: "Workstation", icon: "🖥️", color: "text-blue-400" },
  gaming_workstation: {
    label: "Gaming + Đồ họa",
    icon: "🎮🖥️",
    color: "text-purple-400",
  },
  streaming: { label: "Streaming", icon: "📡", color: "text-pink-400" },
  editing: { label: "Edit Video/Ảnh", icon: "🎬", color: "text-orange-400" },
  ai_ml: { label: "AI / ML", icon: "🤖", color: "text-cyan-400" },
  office: { label: "Văn phòng", icon: "💼", color: "text-green-400" },
  home_server: { label: "Home Server", icon: "🗄️", color: "text-gray-400" },
  budget: { label: "Tiết kiệm", icon: "💰", color: "text-yellow-400" },
};

const isMockResult = (data: any): boolean => {
  if (data?.mock === true) return true;
  if (
    typeof data?.explanation === "string" &&
    data.explanation.startsWith("[MOCK]")
  )
    return true;
  return false;
};
const stripMock = (text?: string) => text?.replace(/^\[MOCK\]\s*/i, "") ?? "";

/** Lấy mảng components từ nhiều dạng response khác nhau */
function extractComponents(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.components)) return data.components;
  if (Array.isArray(data.recommendations)) return data.recommendations;
  return [];
}

export function AIAssistant({ onApplyBuild }: AIAssistantProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("build");
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(submitMode: Mode = mode) {
    if (!query.trim()) return toast.error("Nhập yêu cầu trước đã nhé!");
    setLoading(true);
    setResult(null);
    try {
      let res: any;
      if (submitMode === "build") {
        res = await buildPcApi(query.trim());
        if (res?.success) toast.success("Đã tạo cấu hình!");
      } else if (submitMode === "analyze") {
        res = await analyzeApi(query.trim());
        if (res?.success) toast.success("Phân tích xong!");
      } else {
        res = await getRecommendationsApi(query.trim());
        if (res?.success) toast.success("Đã gợi ý linh kiện!");
      }
      setResult(res);
    } catch (err: any) {
      toast.error(err?.message || "Có lỗi xảy ra, thử lại nhé!");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
  }

  function handleCopy() {
    const text =
      result?.data?.explanation ||
      (result?.data?.build
        ? JSON.stringify(result.data.build, null, 2)
        : null) ||
      JSON.stringify(result?.data, null, 2);
    if (!text) return toast.error("Không có nội dung để copy");
    navigator.clipboard?.writeText(text).then(
      () => toast.success("Đã copy!"),
      () => toast.error("Copy thất bại"),
    );
  }

  function handleExport() {
    if (!result?.data) return toast.error("Không có dữ liệu để xuất");
    const blob = new Blob([JSON.stringify(result.data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-${mode}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất JSON");
  }

  async function handleShare() {
    const text =
      stripMock(result?.data?.explanation) ||
      JSON.stringify(result?.data?.build || result?.data, null, 2);
    if (!text) return toast.error("Không có gì để chia sẻ");
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: "AI Build PC", text });
      } catch {
        /* cancelled */
      }
    } else {
      navigator.clipboard
        ?.writeText(text)
        .then(() => toast.success("Đã copy để chia sẻ!"));
    }
  }

  const MODES: { key: Mode; label: string; icon: any; placeholder: string }[] =
    [
      {
        key: "build",
        label: "Tạo Build",
        icon: Sparkles,
        placeholder:
          "VD: Build PC gaming ngân sách 25 triệu, chơi 4K, tản nhiệt nước...",
      },
      {
        key: "analyze",
        label: "Phân tích",
        icon: Brain,
        placeholder:
          "VD: Tôi muốn build máy render 3D, ngân sách 40 triệu, ưu tiên CPU mạnh...",
      },
      {
        key: "recommendations",
        label: "Gợi ý linh kiện",
        icon: Star,
        placeholder:
          "VD: Cần GPU chiến game 1440p, budget 7–10 triệu, compatible mainboard B660...",
      },
    ];

  const currentMode = MODES.find((m) => m.key === mode)!;
  const CurrentModeIcon = currentMode.icon;
  const isMock = result?.success && isMockResult(result.data);
  const recs = result?.success ? extractComponents(result.data) : [];
  const hasResult = Boolean(result?.success && result?.data);

  const panelClass =
    "relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/88 shadow-[0_28px_90px_rgba(2,6,23,0.62)] backdrop-blur-xl";
  const sectionClass =
    "rounded-[28px] border border-white/10 bg-slate-900/72 p-4 shadow-[0_20px_56px_rgba(2,6,23,0.44)] backdrop-blur-xl sm:p-6";
  const tileClass =
    "rounded-[22px] border border-white/10 bg-white/[0.045] backdrop-blur-xl transition-all duration-300";
  const actionButtonClass =
    "flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-xs font-semibold text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-white/[0.1] hover:text-white hover:shadow-lg";
  const statCardClass = `${tileClass} relative overflow-hidden p-4 sm:p-5`;

  return (
    <div className="relative mb-10 px-4 sm:px-0">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden rounded-[40px]">
        <div className="absolute -left-16 top-8 h-48 w-48 rounded-full bg-cyan-400/14 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/18 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-40 w-40 rounded-full bg-fuchsia-500/14 blur-3xl" />
      </div>

      <div className={`${panelClass} mb-6`}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#081120] to-slate-950" />
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(circle at 14% 18%, rgba(56,189,248,0.18), transparent 26%), radial-gradient(circle at 82% 20%, rgba(99,102,241,0.2), transparent 24%), radial-gradient(circle at 68% 78%, rgba(168,85,247,0.15), transparent 22%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.18) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />

        <div className="relative grid gap-6 px-5 py-5 sm:px-7 sm:py-7 lg:grid-cols-[minmax(0,1.1fr)_320px]">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-[26px] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_22px_48px_rgba(34,211,238,0.2)] ring-1 ring-white/30">
                  <div className="absolute inset-[1px] rounded-[25px] bg-gradient-to-br from-white/12 to-transparent" />
                  <Sparkles className="relative z-10 h-7 w-7 text-white" />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200 backdrop-blur">
                    <div className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
                    AI Build Studio
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                      AI PC Master Pro
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                      Tạo cấu hình, phân tích nhu cầu và gợi ý linh kiện trong
                      một giao diện rõ ràng hơn, sáng điểm chính và nổi bật hơn
                      trên nền tối.
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-cyan-300/90">
                    Powered by Groq · Llama 3.3 70B
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-xs font-bold text-emerald-300 shadow-sm backdrop-blur">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.75)]" />
                System Ready
              </div>
            </div>

            <div className="flex flex-wrap gap-2 rounded-[24px] border border-white/10 bg-black/20 p-2 shadow-inner backdrop-blur-xl">
              {MODES.map((m) => {
                const Icon = m.icon;
                const active = mode === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => {
                      setMode(m.key);
                      setResult(null);
                    }}
                    className={`group relative flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      active
                        ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white shadow-[0_16px_35px_rgba(59,130,246,0.28)] ring-1 ring-white/25"
                        : "border border-transparent bg-white/[0.04] text-slate-300 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {m.label}
                  </button>
                );
              })}
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/20 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent" />
              <div className="relative">
                <div className="mb-3 flex items-center justify-between gap-3 flex-wrap px-1">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-slate-200 shadow-sm">
                    <CurrentModeIcon className="h-3.5 w-3.5 text-cyan-300" />
                    {currentMode.label}
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1">
                      Ctrl + Enter để gửi
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1">
                      Càng chi tiết càng chuẩn
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={currentMode.placeholder}
                    rows={5}
                    className="min-h-[170px] w-full resize-none rounded-[24px] border border-white/10 bg-slate-950/78 px-5 py-5 pr-28 text-[15px] leading-relaxed text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10"
                  />
                  <button
                    onClick={() => handleSubmit()}
                    disabled={loading}
                    title="Ctrl + Enter để gửi"
                    className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-[0_18px_36px_rgba(59,130,246,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_44px_rgba(59,130,246,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang xử lý
                      </>
                    ) : (
                      <>
                        Gửi yêu cầu
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={`${sectionClass} hidden lg:block`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                  Quick Focus
                </p>
                <h4 className="mt-2 text-lg font-bold text-white">
                  Tối ưu cho nền tối
                </h4>
              </div>
              <div className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-3 text-cyan-300">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-3">
              <div className={`${tileClass} flex items-start gap-3 p-4`}>
                <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-2.5 text-white shadow-lg shadow-cyan-500/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Build theo ngân sách
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Chốt danh sách linh kiện với tổng chi phí và độ tương thích.
                  </p>
                </div>
              </div>
              <div className={`${tileClass} flex items-start gap-3 p-4`}>
                <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 p-2.5 text-white shadow-lg shadow-indigo-500/20">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Phân tích nhu cầu
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Nhìn nhanh build type, độ chắc chắn và ưu tiên CPU/GPU.
                  </p>
                </div>
              </div>
              <div className={`${tileClass} flex items-start gap-3 p-4`}>
                <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 p-2.5 text-white shadow-lg shadow-fuchsia-500/20">
                  <Star className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Gợi ý tương thích
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Tách bạch danh mục linh kiện để nhìn nhanh và dễ quyết định.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasResult && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isMock && (
            <div className="flex items-start gap-3 rounded-[24px] border border-amber-400/20 bg-amber-400/10 p-4 shadow-sm backdrop-blur">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <p className="text-sm font-bold text-amber-200">Demo Mode</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-200/80">
                  Backend đang chạy AI giả lập. Restart server sau khi thêm{" "}
                  <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-amber-200">
                    GROQ_API_KEY
                  </code>{" "}
                  để dùng Groq thật.
                </p>
              </div>
            </div>
          )}

          <div
            className={`${sectionClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                AI Output
              </p>
              <h4 className="mt-2 text-lg font-bold text-white">
                Kết quả {currentMode.label.toLowerCase()}
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleCopy} className={actionButtonClass}>
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
              <button onClick={handleExport} className={actionButtonClass}>
                <Download className="h-3.5 w-3.5" /> Export
              </button>
              <button onClick={handleShare} className={actionButtonClass}>
                <Share2 className="h-3.5 w-3.5" /> Chia sẻ
              </button>
            </div>
          </div>

          {/* ── BUILD RESULT ── */}
          {mode === "build" &&
            result.data.build &&
            (() => {
              const build = result.data.build;
              const comps = build.components
                ? Object.entries(build.components)
                : [];
              return (
                <div className={`${sectionClass} space-y-5`}>
                  {result.data.explanation && (
                    <div className="relative overflow-hidden rounded-[24px] border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-transparent p-5">
                      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />
                      <p className="relative text-sm italic font-medium leading-relaxed text-slate-100">
                        <span className="mr-2 font-serif text-2xl text-cyan-300/50">
                          "
                        </span>
                        {stripMock(result.data.explanation)}
                        <span className="ml-2 font-serif text-2xl text-cyan-300/50">
                          "
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className={`${statCardClass} border-emerald-400/15`}>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 p-2.5 text-white shadow-lg shadow-emerald-500/20">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300/80">
                          Tổng chi phí
                        </span>
                      </div>
                      <p className="text-2xl font-black text-emerald-300">
                        {Number(build.estimated_total_cost).toLocaleString(
                          "vi-VN",
                        )}
                        <span className="ml-1 text-base text-emerald-400">
                          ₫
                        </span>
                      </p>
                      {build.cost_over_budget > 0 && (
                        <p className="mt-2 text-xs font-semibold text-orange-300">
                          +
                          {Number(build.cost_over_budget).toLocaleString(
                            "vi-VN",
                          )}
                          ₫ vượt ngân sách
                        </p>
                      )}
                    </div>
                    {build.compatibility && (
                      <div className={statCardClass}>
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-2.5 text-white shadow-lg shadow-cyan-500/20">
                            <Gauge className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                            Tương thích
                          </span>
                        </div>
                        <p className="text-2xl font-black text-white">
                          {build.compatibility.compatibility_score ?? "—"}
                          <span className="ml-1 text-base text-slate-400">
                            /100
                          </span>
                        </p>
                      </div>
                    )}
                    <div className={statCardClass}>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2.5 text-white shadow-lg shadow-violet-500/20">
                          <Wrench className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                          Linh kiện
                        </span>
                      </div>
                      <p className="text-2xl font-black text-white">
                        {comps.length}
                        <span className="ml-1 text-base text-slate-400">
                          món
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                        Cấu hình chi tiết
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Mỗi linh kiện được tách card để quét nhanh hơn trên nền
                        tối.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {comps.map(([key, comp]: any) => {
                        const Icon = CATEGORY_ICONS[key] || Box;
                        const label = CATEGORY_LABELS[key] || key.toUpperCase();
                        const gradient =
                          CATEGORY_COLORS[key] ||
                          "from-indigo-600 to-indigo-400";
                        return (
                          <div
                            key={key}
                            className={`${tileClass} group relative overflow-hidden p-4 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07] hover:shadow-[0_18px_38px_rgba(34,211,238,0.08)]`}
                          >
                            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />
                            <div className="relative flex items-start gap-4">
                              <div
                                className={`flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br ${gradient} shrink-0 shadow-lg`}
                              >
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                                    {label}
                                  </p>
                                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
                                    Ready
                                  </div>
                                </div>
                                <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-white">
                                  {comp.product_name || comp.name || "—"}
                                </p>
                                {comp.price && (
                                  <p className="mt-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                                    {Number(comp.price).toLocaleString("vi-VN")}
                                    ₫
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {onApplyBuild && (
                    <button
                      onClick={() => {
                        onApplyBuild(build);
                        toast.success("Đã áp dụng cấu hình!");
                      }}
                      className="flex w-full items-center justify-center gap-3 rounded-[22px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-5 py-4 text-base font-bold text-white shadow-[0_18px_40px_rgba(59,130,246,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(59,130,246,0.4)]"
                    >
                      <Check className="h-5 w-5" />
                      Áp dụng cấu hình này vào PC Builder
                    </button>
                  )}
                </div>
              );
            })()}

          {/* ── ANALYZE RESULT ── */}
          {mode === "analyze" &&
            (() => {
              const d = result.data;
              const typeInfo = BUILD_TYPE_INFO[d.buildType] || {
                label: d.buildType,
                icon: "📦",
                color: "text-slate-300",
              };
              return (
                <div className={`${sectionClass} space-y-5`}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {d.buildType && (
                      <div className={statCardClass}>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                          Loại Build
                        </p>
                        <p className={`text-base font-bold ${typeInfo.color}`}>
                          {typeInfo.icon} {typeInfo.label}
                        </p>
                      </div>
                    )}
                    {d.budget && (
                      <div className={`${statCardClass} border-emerald-400/15`}>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300/80">
                          Ngân sách
                        </p>
                        <p className="text-base font-bold text-emerald-300">
                          {Number(d.budget).toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    )}
                    {d.confidence !== undefined && (
                      <div className={statCardClass}>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                          Độ chắc chắn
                        </p>
                        <div className="mb-2 flex items-end gap-1">
                          <p className="text-base font-black text-white">
                            {Math.round(d.confidence * 100)}
                          </p>
                          <p className="mb-0.5 text-xs text-slate-400">%</p>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-700"
                            style={{
                              width: `${Math.round(d.confidence * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {d.cpuPreference && (
                      <div className={statCardClass}>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                          CPU
                        </p>
                        <div
                          className={`inline-flex rounded-xl px-3 py-1.5 text-xs font-bold capitalize
                        ${d.cpuPreference === "performance" ? "bg-red-500/15 text-red-300" : d.cpuPreference === "balanced" ? "bg-blue-500/15 text-blue-300" : "bg-white/10 text-slate-300"}`}
                        >
                          {d.cpuPreference}
                        </div>
                      </div>
                    )}
                    {d.gpuPreference && (
                      <div className={statCardClass}>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                          GPU
                        </p>
                        <div
                          className={`inline-flex rounded-xl px-3 py-1.5 text-xs font-bold capitalize
                        ${d.gpuPreference === "none" ? "bg-white/10 text-slate-300" : d.gpuPreference === "performance" ? "bg-emerald-500/15 text-emerald-300" : "bg-blue-500/15 text-blue-300"}`}
                        >
                          {d.gpuPreference === "none"
                            ? "Không cần"
                            : d.gpuPreference}
                        </div>
                      </div>
                    )}
                  </div>

                  {d.explanation && (
                    <div className="rounded-[24px] border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-transparent p-5">
                      <p className="text-sm italic font-medium leading-relaxed text-slate-100">
                        "{stripMock(d.explanation)}"
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setMode("build");
                      handleSubmit("build");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-[22px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-5 py-4 text-sm font-bold text-white shadow-[0_18px_40px_rgba(59,130,246,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(59,130,246,0.4)]"
                  >
                    <Sparkles className="h-4 w-4" />
                    Tạo build theo phân tích này
                  </button>
                </div>
              );
            })()}

          {mode === "recommendations" && recs.length > 0 && (
            <div className={`${sectionClass} space-y-4`}>
              {result.data.requirements && (
                <div className="rounded-[24px] border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-transparent p-4">
                  <p className="text-xs font-medium italic leading-relaxed text-slate-100">
                    {result.data.requirements}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recs.map((item: any, i: number) => {
                  const cat = (item.type || item.category || "").toLowerCase();
                  const Icon = CATEGORY_ICONS[cat] || Box;
                  const gradient =
                    CATEGORY_COLORS[cat] || "from-indigo-600 to-indigo-400";
                  const label =
                    CATEGORY_LABELS[cat] || item.type || item.category || "";
                  return (
                    <div
                      key={i}
                      className={`${tileClass} group relative overflow-hidden p-4 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07] hover:shadow-[0_18px_38px_rgba(34,211,238,0.08)]`}
                    >
                      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />
                      <div className="relative mb-3 flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                          {label}
                        </span>
                      </div>
                      <p className="relative mb-1 text-sm font-bold text-white">
                        {item.name || item.product_name || "—"}
                      </p>
                      {item.price && (
                        <p className="mb-2 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                          {Number(item.price).toLocaleString("vi-VN")}₫
                        </p>
                      )}
                      {item.reason && (
                        <p className="text-xs italic leading-relaxed text-slate-400">
                          {item.reason}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {mode === "recommendations" && recs.length === 0 && result.data && (
            <div className={`${sectionClass} rounded-[24px]`}>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                Raw Response
              </p>
              <pre className="max-h-96 overflow-auto rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-indigo-100/70">
                {typeof result.data === "string"
                  ? result.data
                  : JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {result && !result.success && (
        <div className="mt-6 flex items-start gap-3 rounded-[24px] border border-red-400/20 bg-red-400/10 p-4 shadow-sm backdrop-blur">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
          <p className="text-sm font-medium text-red-300">
            {result.message || "Có lỗi xảy ra. Vui lòng thử lại."}
          </p>
        </div>
      )}
    </div>
  );
}

export default AIAssistant;
