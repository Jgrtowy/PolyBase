import type { AppProps } from "next/app";
import React from "react";

import Header from "@/components/Header";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/Toaster";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <main className="w-screen h-screen overflow-hidden max-w-screen max-h-screen m-0 p-0">
                    <Header />
                    <Component {...pageProps} />
                    <Toaster />
                </main>
            </ThemeProvider>
        </SessionProvider>
    );
}

export default MyApp;
