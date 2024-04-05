import type { AppProps } from "next/app";
import React from "react";

import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/Toaster";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <Component {...pageProps} />
                <Toaster />
            </ThemeProvider>
        </SessionProvider>
    );
}

export default MyApp;
