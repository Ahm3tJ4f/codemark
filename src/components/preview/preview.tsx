import { useEffect, useRef } from "react";
import "./preview.css";
interface PreviewProps {
  code: string;
}

const html = `
<html>
   <head>
   </head>
   <body>
      <div id="root"></div>
      <script>
         function showError(err) {
         console.error(err);
         const root = document.querySelector("#root");
         root.innerHTML =
         '<div style="color: #b80000;"><h4>Runtime Error</h4>' + err + "</div>";
         }
         
         window.addEventListener("error", (event) => {
         showError(event.error);
         });
         
         window.addEventListener("message", (event) => {
         try {
         eval(event.data);
         } catch (err) {
         showError(event.error);
         }
         });
      </script>
   </body>
</html>
    `;

// eslint-disable-next-line react/prop-types
const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 10);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="codePreview"
        srcDoc={html}
        ref={iframe}
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default Preview;
