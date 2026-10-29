import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import WinnersLogo from "@/components/brand/WINNER.webp";

export default function AdminLayout({
  title = "LFC Iseyin",
  subtitle = "Admin Control Panel",
  summary = [],
  onLogout,
  tab,
  setTab,
  tabs = [],
  children,
}) {
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 lg:pb-16 text-slate-900 font-sans antialiased">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <Container className="py-3 px-4 sm:px-6 flex justify-between items-center">
          {/* Logo + Title */}
          <div className="flex gap-2.5 sm:gap-3 items-center min-w-0">
            <img
              src={WinnersLogo}
              alt="Winners Chapel Logo"
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain shrink-0"
            />
            <div className="min-w-0">
              <strong className="block text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                {title}
              </strong>
              <span className="block text-[9px] sm:text-[11px] font-semibold tracking-wider uppercase text-slate-400 truncate">
                {subtitle}
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden md:block text-right border-r border-slate-200 pr-4">
              <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                {todayLabel}
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                as="a"
                href="/"
                className="text-[11px] sm:text-xs py-1.5 px-2.5 sm:py-2 sm:px-3 hover:bg-slate-50 transition-colors"
              >
                <span className="hidden sm:inline">View Site →</span>
                <span className="sm:hidden">Site →</span>
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={onLogout}
                className="text-[11px] sm:text-xs py-1.5 px-2.5 sm:py-2 sm:px-3 bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                Logout
              </Button>
            </div>
          </div>
        </Container>

        {/* Desktop/Tablet Tab Bar */}
        <div className="border-t border-slate-100 bg-white hidden sm:block">
          <Container className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <nav className="flex gap-4 sm:gap-6 min-w-max">
              {tabs.map((item) => {
                const isActive = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`py-3 px-1 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-150 relative ${
                      isActive
                        ? "border-rose-600 text-rose-600"
                        : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </Container>
        </div>
      </header>

      {/* Main Area */}
      <Container className="py-4 sm:py-8 px-4 sm:px-6">
        {/* Metric Cards Grid - 2 columns on small screens, 4 on large */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          {summary.map((item) => {
            const isLiveItem = item.label.toLowerCase() === "live";

            return (
              <div
                key={item.label}
                className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs"
              >
                <div className="text-[9px] sm:text-[11px] font-bold tracking-widest uppercase text-rose-600 mb-0.5 sm:mb-1">
                  {item.label}
                </div>

                <div className="h-7 sm:h-8 flex items-center">
                  {isLiveItem ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold border ${
                        item.value === "Live"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                          item.value === "Live" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                        }`}
                      />
                      {item.value}
                    </span>
                  ) : (
                    <div className="font-fraunces text-xl sm:text-3xl text-slate-900 truncate">
                      {item.value}
                    </div>
                  )}
                </div>

                <div className="text-[10px] sm:text-xs text-slate-500 truncate mt-0.5">{item.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Tab View Output */}
        <main className="animate-in fade-in duration-200">{children}</main>
      </Container>

      {/* Mobile Sticky Navigation Bottom-Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 z-40 px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((item) => {
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-lg text-[11px] font-bold transition-all ${
                  isActive
                    ? "bg-rose-50 text-rose-700"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span className="capitalize">{item.label}</span>
                {isActive && <span className="w-1 h-1 rounded-full bg-rose-600 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}