const PATHS = {
  back: '<path d="M15 18l-6-6 6-6"/>',
  pin: '<path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.3"/>',
  clock: '<circle cx="12" cy="12" r="8.3"/><path d="M12 7.6V12l3 1.8"/>',
  signal: '<path d="M5 19v-6"/><path d="M11 19V9"/><path d="M17 19V5"/>',
  chat: '<path d="M4 5.5h16v10.2H9.3L5 19.5v-3.8H4z"/>',
  search: '<circle cx="10.3" cy="10.3" r="6"/><path d="M20 20l-4.6-4.6"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M4 12H1M23 12h-3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  send: '<path d="M3.5 12L20.5 4l-6 16-2.6-6.4L3.5 12z"/>',
  feed:
    '<circle cx="4.2" cy="6" r="1.1" fill="currentColor" stroke="none"/><circle cx="4.2" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="4.2" cy="18" r="1.1" fill="currentColor" stroke="none"/><path d="M8 6h12M8 12h12M8 18h12"/>',
  clubs:
    '<circle cx="9" cy="8.2" r="3"/><path d="M3.2 20c0-3.4 2.6-6 5.8-6s5.8 2.6 5.8 6"/><circle cx="17.3" cy="9.4" r="2.2"/><path d="M15.7 14.4c2.5.5 4.3 2.6 4.3 5.2"/>',
  profileNav: '<circle cx="12" cy="8.2" r="3.6"/><path d="M4.5 20c0-4.1 3.4-7.4 7.5-7.4s7.5 3.3 7.5 7.4"/>',
  bell: '<path d="M12 3.6a5 5 0 0 0-5 5v3.3L5.4 15h13.2L17 11.9V8.6a5 5 0 0 0-5-5z"/><path d="M9.8 18.4a2.3 2.3 0 0 0 4.4 0"/>',
  football: '<circle cx="12" cy="12" r="8.3"/><path d="M12 7.6l2.5 1.8-.9 3H10.4l-.9-3z"/>',
  basketball:
    '<circle cx="12" cy="12" r="8.3"/><path d="M3.7 12h16.6M12 3.7v16.6"/><path d="M6.2 5.7c2.3 2.2 3.5 4.8 3.5 6.3s-1.2 4.1-3.5 6.3"/><path d="M17.8 5.7c-2.3 2.2-3.5 4.8-3.5 6.3s1.2 4.1 3.5 6.3"/>',
  tennis: '<circle cx="12" cy="12" r="8.3"/><path d="M4.6 8.3C7 10.3 9 12.3 4.6 15.7"/><path d="M19.4 8.3C17 10.3 15 12.3 19.4 15.7"/>',
  volleyball:
    '<circle cx="12" cy="12" r="8.3"/><path d="M12 3.7c2.7 1.9 4.1 5 4.1 8.3"/><path d="M12 3.7c-2.7 1.9-4.1 5-4.1 8.3"/><path d="M4 14.6c3-.6 6-.3 8 1.4"/><path d="M20 14.6c-3-.6-6-.3-8 1.4"/>',
  running: '<path d="M4 17l5-4-5-4"/><path d="M11 17l5-4-5-4"/><path d="M18 17l3-4-3-4"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  check: '<path d="M4 12.5l5 5L20 6"/>',
  close: '<path d="M5 5l14 14M19 5L5 19"/>',
  camera: '<rect x="3" y="7.2" width="18" height="12.3" rx="2.4"/><path d="M8.3 7.2l1.2-2.1h4.9l1.3 2.1"/><circle cx="12" cy="13.3" r="3.3"/>',
  image:
    '<rect x="3" y="4" width="18" height="16" rx="2.4"/><circle cx="8.3" cy="9.3" r="1.5" fill="currentColor" stroke="none"/><path d="M4 17l4.8-4.8 3.7 3.7 2.8-2.8 4.7 4.7"/>',
  logo:
    '<rect x="3.5" y="3.5" width="5" height="7" rx="1.2"/><rect x="9.5" y="3.5" width="5" height="7" rx="1.2"/><rect x="15.5" y="3.5" width="5" height="7" rx="1.2" opacity="0.35"/><rect x="3.5" y="13.5" width="5" height="7" rx="1.2" opacity="0.35"/><rect x="9.5" y="13.5" width="5" height="7" rx="1.2" opacity="0.35"/><rect x="15.5" y="13.5" width="5" height="7" rx="1.2" opacity="0.35"/>',
};

const SPORT_ICON_BY_NAME = {
  Футбол: 'football',
  Баскетбол: 'basketball',
  Теннис: 'tennis',
  Волейбол: 'volleyball',
  Бег: 'running',
};

export function sportIconName(sportName) {
  return SPORT_ICON_BY_NAME[sportName] || 'football';
}

export default function Icon({ name, style }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
}
