import { useNavigate } from "react-router-dom";
import PhysicsSandbox from "../components/physics/GravitySandbox";

export default function PhysicsPage() {
    const navigate = useNavigate();
    return(
        <div className="flex flex-col items-center">
            <div className="flex w-full justify-end">
                <button className="btn" onClick={() => {navigate("/");}}>
                    ←돌아가기
                </button>
            </div>
            <PhysicsSandbox />
        </div>
    )
}