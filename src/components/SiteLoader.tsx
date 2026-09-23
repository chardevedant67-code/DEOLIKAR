/**
 * Premium first-visit loader: the word DEOLIKAR while a thin line draws an
 * upward curve. Pure CSS (no JS) so it can never block interaction, and it is
 * skipped for repeat views in the same session (see the head script in layout).
 * With prefers-reduced-motion it becomes a plain, short fade.
 */
export function SiteLoader() {
  return (
    <div className="site-loader" aria-hidden="true">
      <div className="flex flex-col items-center gap-7">
        <svg className="loader-curve" width="220" height="72" viewBox="0 0 220 72" fill="none">
          <defs>
            <linearGradient id="loader-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5b93ee" />
              <stop offset="1" stopColor="#47cf98" />
            </linearGradient>
          </defs>
          <path
            pathLength="1"
            d="M4 66C50 66 70 54 102 42S164 22 212 8"
            stroke="url(#loader-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle className="loader-dot" cx="212" cy="8" r="4.5" fill="#47cf98" />
        </svg>
        <span className="loader-word">DEOLIKAR</span>
      </div>
    </div>
  );
}
