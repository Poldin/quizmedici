"use client";

import { ArrowUpRight } from "lucide-react";

type SponsorProps = {
    name: string | null;
    logoUrl: string | null;
    extLinkUrl?: string | null;
};

// Funzione helper per formattare il link
const formatExternalLink = (url: string | null | undefined) => {
    if (!url) return "";
    // Se il link non inizia con http:// o https://, aggiunge https://
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

export default function SponsorBadge({ name, logoUrl, extLinkUrl }: SponsorProps) {
    if (!name && !logoUrl) return null;

    // Formattiamo il link prima di usarlo
    const formattedLink = formatExternalLink(extLinkUrl);

    const Wrapper = formattedLink ? "a" : "div";
    const wrapperProps = formattedLink
        ? { href: formattedLink, target: "_blank", rel: "noopener noreferrer" }
        : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={`w-auto -mx-4 flex flex-col items-center justify-center text-center p-4 bg-zinc-50/60 dark:bg-zinc-900/40 rounded-xl ${
                formattedLink ? "hover:opacity-90 transition-all hover:scale-[1.01] cursor-pointer" : ""
            }`}
        >
            {name && (
                <div className="flex flex-col items-center gap-0.5 m-3">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 leading-none">
                        presentato da
                    </span>
                    <span className="text-md font-bold text-zinc-800 dark:text-zinc-200 tracking-tight leading-tight">
                        {name}
                    </span>
                </div>
            )}

            {logoUrl && (
                <div className="w-full max-w-[200px] px-2 flex items-center justify-center mb-2">
                    <img
                        src={logoUrl}
                        alt={`Logo ${name || "Sponsor"}`}
                        className="w-full h-auto object-contain filter dark:brightness-95"
                    />
                </div>
            )}

            {formattedLink && (
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-0.5 hover:underline decoration-1">
                    visita il sito
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
            )}
        </Wrapper>
    );
}