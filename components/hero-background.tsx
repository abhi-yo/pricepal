export function HeroBackground() {
  return (
    <>
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0 scale-100"
        style={{
          backgroundImage: "url('/images/bg.jpg')",
          backgroundSize: "cover",
          filter: "",
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-amber-100/20 via-orange-50/10 to-lime-100/10 mix-blend-soft-light" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-orange-200/20 via-transparent to-transparent mix-blend-soft-light" />

      {/* Texture Overlay */}
      <div
        className="absolute inset-0 z-10 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 60%),
                            radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
          mixBlendMode: "overlay",
        }}
      />
    </>
  );
} 