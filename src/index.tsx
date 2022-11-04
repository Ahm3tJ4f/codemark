import { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from 'plugins/unpkg-path-plugin';

const App: React.FC = () => {

  const [input,setInput] = useState('');
  const [code,setCode] = useState('')
  const ref = useRef<any>();
  
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    })
  }

  useEffect(() => {
    startService();
  },[])

  const handleSubmit = async () => {
    
    if(!ref.current){
      return;
    }
    
    const result = await ref.current.build({ //bundling
      entryPoints: ['index.js'],
      bundle:true,
      write:false,
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      }
    })
    setCode(result.outputFiles[0].text) 

  }


  return <div>
    <textarea value={input} onChange={(e) => {setInput(e.target.value)}}></textarea>
    <div className="">
      <button onClick={handleSubmit}>Submit</button>
    </div>
    <pre>{code}</pre>
  </div>
}

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);

interface LocalForageDbMethodsCore {
  getItem<T>(
    key: string,
  ): Promise<T | null>;
}
