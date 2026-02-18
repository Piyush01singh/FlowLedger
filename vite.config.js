import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          reactVendor: ["react", "react-dom", "react-router-dom"],
          firebaseVendor: ["firebase/app", "firebase/auth", "firebase/firestore"],
          motionVendor: ["framer-motion"],
          iconVendor: ["lucide-react"]
        }
      }
    }
  }
});
