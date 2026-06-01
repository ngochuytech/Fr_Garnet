import { Outlet } from 'react-router-dom';

/**
 * AuthLayout – centered card on top of a full-screen gradient background.
 * Inspired by Quora's layout: background fills screen, white card is centered.
 */
const AuthLayout = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(175deg, #bfdbfe 0%, #dbeafe 25%, #eff6ff 55%, #fef9ee 80%, #fef3c7 100%)',
      }}
    >
      {/* Subtle noise/texture overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Centered card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand header – above the card */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'var(--color-dusty-rose-500)' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
            <h1
              className="text-4xl tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-dusty-rose-600)',
              }}
            >
              CampusHub
            </h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Nền tảng mạng xã hội – chia sẻ đam mê và khám phá cùng nhau!
          </p>
        </div>

        {/* White card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
