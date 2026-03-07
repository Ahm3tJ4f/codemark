import { useEffect, useRef, useState } from "react";
import "./preview.css";
interface PreviewProps {
  code: string;
  err: string;
}

const html = `
<html>
   <head>
      <script src="https://unpkg.com/react@17.0.2/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js"></script>
   </head>
   <body>
      <div id="root"></div>
      <script>
         function showError(err) {
         console.error(err);
         const root = document.querySelector("#root");
         if (root) {
            root.innerHTML =
            '<div style="color: #b80000;"><h4>Runtime Error</h4>' + (err || 'Unknown error') + "</div>";
         }
         }
         
         window.addEventListener("error", (event) => {
         event.preventDefault();
         if (event.error) {
            showError(event.error.message || event.error);
         } else if (event.message) {
            showError(event.message);
         }
         });
         
         window.addEventListener("message", (event) => {
         try {
         eval(event.data);
         } catch (err) {
         showError(err.message || err);
         }
         });

         // Signal that we're ready
         window.parent.postMessage('iframe-ready', '*');
      </script>
   </body>
</html>
    `;

// eslint-disable-next-line react/prop-types
const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Reset iframe when code is cleared or on initial load
  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;

    // Only set srcdoc if it's different
    if (iframe.srcdoc !== html) {
      iframe.srcdoc = html;
    }
  }, [iframeKey]);

  // Execute code in iframe
  useEffect(() => {
    if (!code.trim() || !iframeRef.current) return;

    const iframe = iframeRef.current;

    // Wait a bit for iframe to be ready, then execute
    const executeCode = () => {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(code, "*");
        }
      } catch (e) {
        console.error("Failed to execute code in iframe:", e);
      }
    };

    // Small delay to ensure iframe is ready
    const timer = setTimeout(executeCode, 50);
    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        key={iframeKey}
        title="codePreview"
        ref={iframeRef}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
