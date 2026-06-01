import { useNavigate } from "react-router-dom";
import PixelStudio from "../components/pixel/PixelStudio";

export default function PixelPage() {
    const navigate = useNavigate();
    return(
        <div className="flex flex-col items-center">
            <div className="flex w-full justify-end">
                <button className="btn" onClick={() => {navigate("/");}}>
                    ←돌아가기
                </button>
            </div>
            <PixelStudio />
        </div>
    )
}