/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Enable environment variables
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Ensure environment variables are available on the client side
  publicRuntimeConfig: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
}

module.exports = nextConfig 