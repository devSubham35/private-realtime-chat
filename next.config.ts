import type { NextConfig } from "next";

const securityHeaders = [
  /// force HTTPS for 2 years, including subdomains
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  /// disallow being framed (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  /// block MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  /// don't leak full URL on cross-origin navigation
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  /// disable powerful browser features we don't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  /// isolate this origin from cross-origin windows
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  /// require explicit opt-in for cross-origin resources
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  /// legacy XSS auditor (kept for older browsers)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  /// keep DNS prefetch on for perf
  { key: "X-DNS-Prefetch-Control", value: "on" },
  /// content security policy — adjust if you add 3rd-party scripts/styles
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.upstash.io wss://*.upstash.io",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,

  /// hide framework fingerprint
  poweredByHeader: false,

  /// keep trailing slashes consistent
  trailingSlash: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
