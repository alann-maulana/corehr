import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },
  serverExternalPackages: [
    "knex",
    "mysql2",
    "pg",
    "pg-hstore",
    "sqlite3",
    "tedious",
    "better-sqlite3",
    "oracledb",
  ],
};

export default nextConfig;
