const G=require('./engine.js'),cp=require('child_process');
let seed=31337;const rnd=n=>{seed=(seed*1103515245+12345)&0x7fffffff;return (seed>>8)%n};const pick=a=>a[rnd(a.length)];
const d=()=>String(rnd(10));const digs=n=>{let s='';while(n--)s+=d();return s};
const gen=()=>{let s=pick(['','','-','+']);s+=digs(1+rnd(3));const k=rnd(3);for(let i=0;i<k;i++)s+=pick([',','.',' ','\u00a0','\u202f',"'"])+digs(1+rnd(3));if(rnd(3)==0)s+=pick([',','.'])+digs(rnd(3));return s};
const gen2=l=>{const y=G.symbols(l);let s=pick(['','-']);s+=digs(1+rnd(3));const k=rnd(3);for(let i=0;i<k;i++)s+=y.group+digs(3);if(rnd(2))s+=y.decimal+digs(1+rnd(3));return s};
const run=(label,cases)=>{const o=JSON.parse(cp.execFileSync('python3',['oracle.py'],{input:JSON.stringify(cases),maxBuffer:1e9}));
 let bad=0,agree=0,bl={};
 cases.forEach(([s,l],i)=>{const r=G.parse(s,l),p=o[i];const a=r.ok?['ok',r.value]:['err'];
  const same=a[0]===p[0]&&(a[0]==='err'||Number(a[1])===Number(p[1]));
  if(same)agree++;else{bad++;bl[l]=(bl[l]||0)+1;if(bad<=8)console.log(label,'MISMATCH',JSON.stringify(s),l,JSON.stringify(a),JSON.stringify(p),JSON.stringify([G.symbols(l).group,G.symbols(l).decimal]))}});
 console.log(label,'checks',cases.length,'agree',agree,'mismatch',bad,JSON.stringify(bl));return bad};
const A=[];for(let i=0;i<5000;i++){const l=pick(G.LOCALES);A.push([gen2(l),l])}
const B=[];for(let i=0;i<5000;i++)B.push([gen(),pick(G.LOCALES)]);
const DATA=new Set(['de-AT','de-CH','fr-CH','ar-EG']);
const A2=A.filter(x=>!DATA.has(x[1]));
run('A* four locales whose separators differ between ICU/CLDR in Node 22 and Babel 2.18 (de-AT, de-CH, fr-CH, ar-EG; informational)',A.filter(x=>DATA.has(x[1])));
const bad=run('A own-separator strings, other 29 locales',A2);run('B arbitrary strings (Babel is lenient, informational)',B);
process.exit(bad?1:0);
