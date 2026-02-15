import "./globals.css";

export const metadata = {
  title: {
    default: "Smart Support System",
    template: "%s | Smart Support System",
  },
  description:
    "AI-powered intelligent support automation platform with smart ticket processing and escalation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
