import { useNavigate } from "react-router-dom";
import SnakeStudio from "../components/games/SnakeStudio";

export default function SnakePage() {
    const navigate = useNavigate();
    return(
        <div className="flex flex-col items-center">
            <div className="flex w-full justify-end">
                <button className="btn" onClick={() => {navigate("/");}}>
                    ←돌아가기
                </button>
            </div>
            <SnakeStudio />
        </div>
    )
}