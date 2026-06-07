/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ImageResponse (next/og) renders artifacts server-side; keep node runtime on those routes.
};
export default nextConfig;
