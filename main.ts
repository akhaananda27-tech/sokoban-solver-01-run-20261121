import fs from'node:fs'
const E=process.env,I=E.MAKEFUN_INPUT_DIR??'/input',O=E.MAKEFUN_OUTPUT_DIR??'/output'
const D=[[0,-1],[0,1],[-1,0],[1,0]]
const P=t=>{let r=t.split('\n'),w=r[0].length,a=new Uint8Array(w*r.length).fill(1),g=[],b=[],p=-1
r.forEach((x,y)=>{for(let i in x){let c=x[i],j=y*w+ +i;if(c!='#'){a[j]=0;if('.*+'.includes(c))g.push(j);if('$*'.includes(c))b.push(j);if('@+'.includes(c))p=j}}})
return{w,a,g,b,p}}
const W=(l,o,f,t)=>{let{w,a}=l,s=new Uint8Array(a.length),r=''
let F=x=>{if(x==t)return 1;s[x]=1
for(let k=0;k<4;k++){let[dx,dy]=D[k],y=x+dy*w+dx
if(!a[y]&&!o[y]&&!s[y]&&F(y)){r='udlr'[k]+r;return 1}}return 0}
F(f);return r}
const S=(l,M=25e4)=>{let{w,a,g}=l,s=a.length,G=new Uint8Array(s)
for(let x of g)G[x]=1
let o=new Uint8Array(s),e=new Int32Array(s),k=new Int32Array(s),T=0
let Z=b=>b.every(x=>G[x])
let q=[l.b],u=[l.p],A=[-1],Dr=[0],m=new Set
for(let x of l.b)o[x]=1
m.add(l.b+','+l.p)
let f=Z(l.b)?0:-1
for(let h=0;f<0&&h<q.length;h++){let b=q[h]
for(let x of b)o[x]=1
let Y=++T,n=0;k[n++]=u[h];e[u[h]]=Y
while(n){let p=k[--n]
for(let[dx,dy]of D){let y=p+dy*w+dx
if(!a[y]&&!o[y]&&e[y]!=Y){e[y]=Y;k[n++]=y}}}
for(let i=0;i<b.length&&f<0;i++){let x=b[i]
for(let[dx,dy]of D){let d=dy*w+dx,t=x+d
if(e[x-d]!=Y||a[t]||o[t])continue
o[x]=0;o[t]=1
let z=!G[t]&&(a[t-1]||o[t-1]||a[t+1]||o[t+1])&&(a[t-w]||o[t-w]||a[t+w]||o[t+w]),J,N
if(!z){N=[...b];N[i]=t;N.sort((x,y)=>x-y);J=N+','+x}
o[t]=0;o[x]=1
if(z||m.has(J))continue
if(q.length>=M)return null
m.add(J);q.push(N);u.push(x);A.push(h);Dr.push(d)
if(Z(N)){f=q.length-1;break}}}
for(let x of b)o[x]=0}
if(f<0)return null
let P=[]
for(let x=f;x>0;x=A[x])P.unshift(x)
let v='',p=l.p,b=l.b
for(let x of P){let N=q[x],f2=u[x],d=Dr[x]
for(let y of b)o[y]=1
v+=W(l,o,p,f2-d)
for(let y of b)o[y]=0
v+='UDLR'[d==-w?0:d==w?1:d==-1?2:3];p=f2;b=N}
return{pushes:P.length,moves:v,p}}
const C=l=>{let{w,a,g,b,p}=l,r=(p/w)|0,c=new Uint8Array(a.length)
for(let i=r*w;i<(r+1)*w;i++)if(!a[i])c[i]=1
if(b.some(x=>c[x]))return null
let t=[],R=[]
for(let s=0;s<a.length;s++){if(a[s]||c[s]||t[s]>=0)continue
let Q=[s];t[s]=R.length
for(let i=0;i<Q.length;i++)for(let[dx,dy]of D){let y=Q[i]+dy*w+dx
if(!a[y]&&!c[y]&&t[y]==null){t[y]=R.length;Q.push(y)}}
R.push([[],[]])}
for(let x of b)R[t[x]][0].push(x)
for(let x of g)if(t[x]>=0)R[t[x]][1].push(x)
if(g.some(x=>t[x]==null)||R.some(x=>x[0].length!=x[1].length))return null
return R.filter(x=>x[0].length)}
const B=(l,M=25e4)=>{let R=C(l)
if(!R)return S(l,M)
let p=l.p,u=0,v=''
for(let r of R){let a=l.a.slice()
for(let o of R)if(o!=r)for(let x of o[o.done?1:0])a[x]=1
let s={w:l.w,a,g:r[1],b:r[0],p},z=S(s,M)
if(!z)return null
u+=z.pushes;v+=z.moves;p=z.p
r.done=1}
return{pushes:u,moves:v}}
for(let i=1;i<6;i++){let d='i00'+i,l=P(fs.readFileSync(I+'/'+d+'/level.txt','utf8')),m=(B(l)||S(l)||{moves:''}).moves;fs.mkdirSync(O+'/'+d,{recursive:!0});fs.writeFileSync(O+'/'+d+'/solution.txt',m+'\n')}
