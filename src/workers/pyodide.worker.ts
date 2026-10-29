/// <reference lib="webworker" />
declare const self:DedicatedWorkerGlobalScope;
let ready:Promise<any>|null=null;
async function py(){if(!ready)ready=(async()=>{const url='https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs';const module=await import(/* @vite-ignore */ url);return module.loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/'});})();return ready}
self.onmessage=async(e)=>{const{id,code,input}=e.data;try{const p=await py();p.globals.set('__source',code);p.globals.set('__input',input);const output=await p.runPythonAsync(`import sys, io, contextlib\n__out = io.StringIO()\n__oldin = sys.stdin\nsys.stdin = io.StringIO(__input)\ntry:\n    with contextlib.redirect_stdout(__out), contextlib.redirect_stderr(__out):\n        exec(compile(__source, '<решение>', 'exec'), {'__name__': '__main__'})\nfinally:\n    sys.stdin = __oldin\n__out.getvalue()`);self.postMessage({id,ok:true,output})}catch(error){self.postMessage({id,ok:false,output:String(error)})}};
export{};
