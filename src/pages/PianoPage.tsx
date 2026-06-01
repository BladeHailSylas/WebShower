import { useNavigate } from "react-router-dom";
import PianoHub from "../components/piano/PianoHub";

export default function PianoPage() {
    const navigate = useNavigate();
    return(
        <div className="flex flex-col items-center">
            <div className="flex w-full justify-end">
                <button className="btn" onClick={() => {navigate("/");}}>
                    ←돌아가기
                </button>
            </div>
            <PianoHub />
        </div>
    )
}