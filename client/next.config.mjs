/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	experimental: {
		missingSuspenseWithCSRBailout: false,
	},
	images: {
		domains: [process.env.CLIENT_URL],
	},
	env: {
		CLIENT_URL: process.env.CLIENT_URL,
		SERVER_URL: process.env.SERVER_URL,
		BITCART_API_URL: process.env.BITCART_API_URL
	}
};

export default nextConfig;
