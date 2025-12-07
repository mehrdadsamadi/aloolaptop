import type {Metadata} from "next";
import "./globals.css";
import localFont from "next/font/local";

const vazir = localFont({
    src: [
        {
            path: "../fonts/Vazirmatn-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../fonts/Vazirmatn-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../fonts/Vazirmatn-Bold.woff2",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
    title: "الو لپتاپ",
    description: "خرید لپتاپ های دسته دوم و نو",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fa" dir="rtl">
        <body
            className={`${vazir.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
