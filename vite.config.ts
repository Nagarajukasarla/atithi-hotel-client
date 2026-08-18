import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: { "@": path.resolve(import.meta.dirname, "./src") },
    },
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: "react-vendor",
                            test: /node_modules[/\\](react|react-dom|react-router|react-router-dom)[/\\]/,
                            priority: 40,
                        },
                        {
                            name: "recharts",
                            test: /node_modules[/\\](recharts|d3-.+|internmap)[/\\]/,
                            priority: 30,
                        },
                        {
                            name: "lucide",
                            test: /node_modules[/\\]lucide-react[/\\]/,
                            priority: 20,
                        },
                        {
                            name: "tanstack",
                            test: /node_modules[/\\]@tanstack[/\\]/,
                            priority: 10,
                        },
                    ],
                },
            },
        },
    },
});
