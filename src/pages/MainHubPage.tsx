import { useNavigate } from "react-router-dom";
import MainHubComponent from "../components/layout/MainHubComponent";

export default function MainHubPage() {
    const navigate = useNavigate();
    return(
        <div className="flex justify-center">
            <MainHubComponent />
        </div>
    )
}
