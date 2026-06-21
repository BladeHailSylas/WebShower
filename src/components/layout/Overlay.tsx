import { createPortal } from "react-dom";

export default function Overlay() {
    return createPortal(
    <div className="pointer-events-none fixed inset-0 z-9999">
        <div className="flex justify-center">
            <div className="border-4 border-blue-700 bg-white rounded-xl text-slate-900 text-5xl font-bold">
                HELLO AGAIN
            </div>
        </div>
    </div>
    , document.body);
}