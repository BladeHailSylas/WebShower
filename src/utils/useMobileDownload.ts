export function useMobileDownload() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    let foundCode = false;
    if (code) {
      foundCode = true;
      // 🌟 스트림 처리를 위해 내부에 비동기 전용 실행 블록 구성
      const triggerDownload = async () => {
        try {
          const cleanCode = code.replace(/ /g, '+');

          // 1. Base64 규격을 디코딩하여 원시 바이트 가상 스트링 문자열 획득
          const binary = atob(cleanCode);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }

          // 2. DecompressionStream을 가동하여 브라우저 메모리 단축 팩 해제
          const stream = new Blob([bytes]).stream();
          const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
          const decodedHtml = await new Response(decompressedStream).text();

          // 3. 최종 복원된 순수 HTML 텍스트를 다운로드 가능한 Blob 파일 객체로 전환
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
          console.error("모바일 수신 및 압축 해제 프로세스 도중 장애가 발생했습니다.", error);
        }
      };

      triggerDownload();
    }
    return foundCode;
}