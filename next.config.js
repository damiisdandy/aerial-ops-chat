/** @type {import("next").NextConfig} */
module.exports = {
  /** We run eslint as a separate task in CI */
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  images: {
    domains: ["aerial-ops-bucket.s3.amazonaws.com"]
  }
};
