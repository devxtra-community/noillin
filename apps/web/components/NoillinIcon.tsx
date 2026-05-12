import Link from "next/link";

interface NoillinIconProps {
  /** Wrap the logo in a Link to href (default: "/") */
  href?: string;
  /** Extra classes on the wrapper */
  className?: string;
}

export default function NoillinIcon({ href = "/", className = "" }: NoillinIconProps) {
  const logo = (
    <span className={`flex items-center gap-2 group cursor-pointer ${className}`}>
      <span className="w-8 h-8 text-emerald-500 transition-transform group-hover:scale-110 duration-200">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </span>
      <span className="text-xl font-bold tracking-tight text-slate-900">Noillin</span>
    </span>
  );

  return href ? <Link href={href}>{logo}</Link> : logo;
}
