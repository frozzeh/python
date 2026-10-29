let worker:Worker|null=null;
let warm=false,busy=false;
export function runPython(code:string,input:string,timeout?:number):Promise<{ok:boolean;output:string}>{
if(busy)return Promise.resolve({ok:false,output:'Дождитесь завершения текущего запуска.'});
if(!worker)worker=new Worker(new URL('../workers/pyodide.worker.ts',import.meta.url),{type:'module'});
busy=true;return new Promise(resolve=>{const id=crypto.randomUUID();const current=worker!;let timer:ReturnType<typeof setTimeout>;
const finish=(r:{ok:boolean;output:string},reset=false)=>{clearTimeout(timer);current.removeEventListener('message',on);current.removeEventListener('error',error);if(reset){current.terminate();worker=null;warm=false}busy=false;resolve(r)};
const on=(e:MessageEvent)=>{if(e.data.id!==id)return;warm=true;finish(e.data)};
const error=(e:ErrorEvent)=>finish({ok:false,output:'Ошибка загрузки Python. Проверьте доступ к cdn.jsdelivr.net. '+e.message},true);
timer=setTimeout(()=>finish({ok:false,output:'Превышен лимит времени. Исполнитель перезапущен.'},true),warm?Math.min(timeout??5000,5000):60000);
current.addEventListener('message',on);current.addEventListener('error',error);current.postMessage({id,code,input});});}
