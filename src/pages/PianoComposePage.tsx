import { useNavigate } from "react-router-dom";
import PianoComposerHub from "../components/piano/PianoComposerHub";

export default function PianoComposePage() {
    const navigate = useNavigate();
    return(
        <div className="flex flex-col items-center">
            <div className="flex w-full justify-end">
                <button className="btn" onClick={() => {navigate("/");}}>
                    ←돌아가기
                </button>
            </div>
            <PianoComposerHub />
            <button className="btn" onClick={() => {navigate("/piano");}}>연주 모드</button>
        </div>
    )
}