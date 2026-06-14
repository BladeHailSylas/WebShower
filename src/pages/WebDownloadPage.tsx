import { useMobileDownload } from "../utils/useMobileDownload";

export default function WebDownloadPage() {
    useMobileDownload();
        return(
        <div className="h-full flex flex-col justify-center items-center">
            <div className="text-7xl font-bold">
                다운로드 중입니다...
            </div>
            <p className="mt-2">
              다운로드한 페이지를 보려면 휴대폰의 내 파일 앱으로 들어가세요.
            </p>
        </div>
        );
}