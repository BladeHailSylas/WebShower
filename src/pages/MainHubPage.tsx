import { useNavigate } from "react-router-dom";

export default function MainHubPage() {
    const navigate = useNavigate();
    return(
        <div className="max-w-5xl flex justify-center">
            <div className="flex justify-center gap-4">
                <button className="btn" onClick={() => {navigate("/clicker")}}>클리커 게임</button>
                <button className="btn" onClick={() => {navigate("/piano")}}>디지털 피아노</button>
                <button className="btn" onClick={() => {navigate("/pixel")}}>픽셀 스튜디오</button>
                <button className="btn" onClick={() => {navigate("/sandbox")}}>물리 샌드박스</button>
            </div>
        </div>
    )
}