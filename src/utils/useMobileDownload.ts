import { useEffect } from "react";

export function useMobileDownload() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    let foundCode = false;
    if (code) {
        foundCode = true;
      try {
        // [수정] 주소창을 거치며 공백(' ')으로 변형된 base64의 '+' 기호들을 강제로 원상복구
        const cleanCode = code.replace(/ /g, '+');
        
        // 원상복구된 코드로 복호화 진행 (이제 InvalidCharacterError가 발생하지 않음)
        const decodedHtml = decodeURIComponent(escape(atob(cleanCode)));
        
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
        console.error("파일 다운로드 중 오류가 발생했습니다.", error);
      }
    }
    return foundCode;
}