import Sidebar from "@/components/custom/sidebar-wrapper";

export default function WarrantyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full h-full overflow-auto">
        {/* Content */}
        <div className="flex-1 p-3.5 md:pt-3.5 pt-20">
          <div
            className="md:hidden"
            style={{
              marginTop: "max(0rem, env(safe-area-inset-top))",
            }}
          />
          <div
            style={{
              paddingBottom:
                "max(0rem, calc(5rem + env(safe-area-inset-bottom)))",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
