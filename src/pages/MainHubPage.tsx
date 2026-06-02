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

/*
TODO: 물리 샌드박스 추가하기(방법론 논의 중, 전문성 측면에서 얕보이기 싫다면 엄밀한 물리학을 동원하기)
TODO: 피아노 '작곡' 기능 추가하기(MIDI 또는 적합한 형식의 파일로 로컬 저장)
TODO: 픽셀 스튜디오 '도안 저장' 기능 추가하기(csv 또는 적합한 형식의 파일로 로컬 저장)
*/
