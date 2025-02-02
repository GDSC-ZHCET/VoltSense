import { Button } from "../ui/button";
import { Sidebar } from "../sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar - hidden on mobile, shown on larger screens */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar className="border-r" />
      </div>

      {/* Mobile header with menu */}
      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-10 border-b bg-background md:hidden">
          <div className="flex h-16 items-center px-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </Button>
            <div className="flex items-center justify-between flex-1">
              <h2 className="text-lg font-semibold">Smart Switch</h2>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 font-sans">
          <div className="container mx-auto py-6 px-4 md:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
