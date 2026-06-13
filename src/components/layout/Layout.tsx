import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen h-screen w-full overflow-hidden">
      <div className="flex flex-1 px-4 lg:px-8 gap-6">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}