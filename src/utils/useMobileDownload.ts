import { useRef } from "react";

export function useMobileDownload() {
  const hasDownloaded = useRef(false);
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    const storage = sessionStorage.getItem('downloaded');
    let foundCode = false;
    if (key && !hasDownloaded.current && !storage) {
      foundCode = true;
      hasDownloaded.current = true; // 최초 진입 시 즉시 가드 활성화
      sessionStorage.setItem('downloaded', 'true');
      const fetchAndDownloadFile = async () => {
        try {
          // Vite 개발 서버의 public 폴더에 저장된 정적 파일을 키값으로 다이렉트 역조회
          const response = await fetch(`/temp-pages/${key}.html`);
          
          // ⚠️ [명세 수용] 만약 30분이 지나 소멸했거나 없는 키인 경우 예외 핸들링
          if (response.status === 404) {
            alert("요청하신 페이지 파일이 존재하지 않거나, 30분 만료 시간이 지나 서버에서 자동 소멸되었습니다.");
            return;
          }

          const decodedHtml = await response.text();
          const blob = new Blob([decodedHtml], { type: 'text/html;charset=utf-8' });
          const downloadUrl = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'my-creative-web.html';
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        } catch (error) {
          console.error("모바일 정적 파일 포인터 다운로드 중 예외 발생:", error);
        }
      };

      fetchAndDownloadFile();
    }
    return foundCode;
}