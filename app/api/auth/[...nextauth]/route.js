import NextAuth from "next-auth";
import dns from "dns";

// Force Google and Cloudflare DNS to bypass local/ISP DNS issues with MongoDB Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  // Ignore
}

import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
