import { Outlet } from "react-router";
import Overlay from "./Overlay";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen h-screen w-full overflow-hidden">
      <div className="flex flex-1 gap-6">
        <div className="flex-1">
          <Outlet />
          <Overlay />
        </div>
      </div>
    </div>
  );
}