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
        window.addEventListener("message", (event)=> {
         try{
          eval(event.data)
         } catch (err) {
          console.log(err)
          const root = document.querySelector("#root");
          root.innerHTML = '<div style="color: #b80000;"><h4>Runtime Error</h4>' + err + '</div>';
         }
        })
      </script>
    </body>
  </html>
    `;

// eslint-disable-next-line react/prop-types
const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    iframe.current.contentWindow.postMessage(code, "*");
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
