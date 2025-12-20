export function FlagIcon({ countryCode }: { countryCode: "us" | "uz" }) {
  const flags = {
    us: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="2" fill="#B22234" />
        <rect y="2" width="24" height="2" fill="white" />
        <rect y="6" width="24" height="2" fill="white" />
        <rect y="10" width="24" height="2" fill="white" />
        <rect y="14" width="24" height="2" fill="white" />
        <rect y="18" width="24" height="2" fill="white" />
        <rect y="22" width="24" height="2" fill="white" />
        <rect width="10" height="13" fill="#3C3B6E" />
      </svg>
    ),
    uz: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="8" fill="#1EB53A" rx="2" />
        <rect y="8" width="24" height="1" fill="#CE1126" />
        <rect y="9" width="24" height="6" fill="white" />
        <rect y="15" width="24" height="1" fill="#CE1126" />
        <rect y="16" width="24" height="8" fill="#0099B5" />
      </svg>
    ),
  }

  return flags[countryCode]
}
