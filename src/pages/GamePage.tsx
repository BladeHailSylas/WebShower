import { useNavigate } from "react-router-dom";
import GameLibrary from "../components/games/GameLibrary";

export default function SnakePage() {
    const navigate = useNavigate();
    return(
        <div className="flex flex-col items-center">
            <div className="flex w-full justify-end">
                <button className="btn" onClick={() => {navigate("/");}}>
                    ←돌아가기
                </button>
            </div>
            <GameLibrary />
        </div>
    )
}