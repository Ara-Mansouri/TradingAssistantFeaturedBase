export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_#1a1a1a_0%,_#0b0b0b_60%,_#000_100%)] text-white flex items-center justify-center p-4 overflow-hidden">
      <section className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-black/60 backdrop-blur-md ring-1 ring-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          <div className="relative">
            <img
               src="/images/login-bg.png"
              alt="Trading Assistant"
              className="w-full h-64 md:h-full object-cover object-center"
            />
            <div className="absolute inset-0 pointer-events-none
                            bg-gradient-to-b from-transparent to-black/80
                            md:bg-gradient-to-r md:from-transparent md:to-black/80" />
          </div>

        
          <div className="relative flex items-center justify-center p-6 md:p-10">
            {children}
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10
                     bg-gradient-to-r from-red-600/10 via-transparent to-red-600/10 blur-2xl"
        />
      </section>
    </main>
  );
}
