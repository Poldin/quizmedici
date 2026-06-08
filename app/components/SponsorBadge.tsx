"use client";

type SponsorProps = {
  name: string | null;
  logoUrl: string | null;
  extLinkUrl?: string | null;
};

export default function SponsorBadge({ name, logoUrl, extLinkUrl }: SponsorProps) {
  if (!name && !logoUrl) return null;

  const Wrapper = extLinkUrl ? "a" : "div";
  const wrapperProps = extLinkUrl 
    ? { href: extLinkUrl, target: "_blank", rel: "noopener noreferrer" } 
    : {};

  return (
    <Wrapper 
      {...wrapperProps} 
      className={`w-auto -mx-4 flex flex-col items-center justify-center text-center p-4 bg-zinc-50/60 dark:bg-zinc-900/40 ${
        extLinkUrl ? "hover:opacity-90 transition-opacity cursor-pointer" : ""
      }`}
    >
      {name && (
        <div className="flex flex-col items-center gap-0.5 m-3">
          {/* Prima riga fissa: sostenuto da */}
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold leading-none">
            sostenuto da
          </span>
          {/* Seconda riga dinamica: Nome Clinica */}
          <span className="text-md font-bold text-zinc-800 dark:text-zinc-200 tracking-tight leading-tight">
            {name}
          </span>
        </div>
      )}
      
      {logoUrl && (
        <div className="w-full max-w-[200px] px-2 flex items-center justify-center">
          <img 
            src={logoUrl} 
            alt={`Logo ${name || "Sponsor"}`} 
            className="w-full h-auto object-contain filter dark:brightness-95"
          />
        </div>
      )}
    </Wrapper>
  );
}