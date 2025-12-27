import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "MedGPT",
    description: "Clinical Decision Support & Triage Assistant",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-gpt-bg text-gpt-text antialiased">
                {children}
            </body>
        </html>
    );
}
