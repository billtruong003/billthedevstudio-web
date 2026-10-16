const PATHS = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  left: <path d="M15 5l-7 7 7 7" />,
  right: <path d="M9 5l7 7-7 7" />,
  down: <path d="M6 9l6 6 6-6" />,
  arrow: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  ext: <><path d="M14 4h6v6" /><path d="M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  share: <><path d="M12 3v12" /><path d="M7 8l5-5 5 5" /><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" /></>,
  check: <path d="M5 12l5 5 9-10" />,
  download: <><path d="M12 4v12" /><path d="M7 11l5 5 5-5" /><path d="M5 20h14" /></>,
  play: <path d="M7 4l13 8-13 8z" />,
  send: <><path d="M21 3L3 11l7 3 3 7z" /><path d="M10 14l11-11" /></>,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  pad: <><path d="M7 7h10a4.5 4.5 0 0 1 4.3 5.8l-1.2 3.9a2.4 2.4 0 0 1-4.1.9L14.3 16H9.7L8 17.6a2.4 2.4 0 0 1-4.1-.9l-1.2-3.9A4.5 4.5 0 0 1 7 7z" /><path d="M8 10.2v3.6M6.2 12h3.6" /><path d="M15.6 10.6h.01M17.6 12.6h.01" /></>,
  gauge: <><path d="M3.5 17.5a8.5 8.5 0 1 1 17 0" /><path d="M12 16l4.5-5.5" /><circle cx="12" cy="16" r="1.6" /><path d="M6.6 11.2l1.1.8M12 7.2v1.3M17.4 11.2l-1.1.8" /></>,
  layers: <><path d="M12 2.5l9 4.8-9 4.8-9-4.8z" /><path d="M3 11.6l9 4.8 9-4.8" /><path d="M3 16l9 4.8 9-4.8" /></>,
  email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 10v7" /><path d="M8 7v.01" /><path d="M12 17v-4a2 2 0 0 1 4 0v4" /><path d="M12 10v7" /></>,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  people: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M18 14a6 6 0 0 1 3.5 6" /></>,
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 22, stroke = 2.2, className }: { name: IconName; size?: number; stroke?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {PATHS[name]}
    </svg>
  );
}

export const CONTACT_ICON = { email: "email", linkedin: "linkedin", zalo: "chat", messenger: "chat", discord: "people", telegram: "send" } as const;
export const VALUE_ICONS: IconName[] = ["bolt", "pad", "gauge", "layers"];
