import{mkdirSync,readFileSync,writeFileSync}from'node:fs'
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output'
const D=[[0,-1,'u','U'],[0,1,'d','D'],[-1,0,'l','L'],[1,0,'r','R']]
const P=t=>{let r=t.split('\n'),w=Math.max(...r.map(x=>x.length)),a=new Uint8Array(w*r.length).fill(1),g=[],b=[],p=-1
r.forEach((x,y)=>{for(let i=0;i<x.length;i++){let c=x[i],j=y*w+i;if(c=='#')continue;a[j]=0;if('.*+'.includes(c))g.push(j);if('$*'.includes(c))b.push(j);if('@+'.includes(c))p=j}})
return{w,a,g,b:b.sort((x,y)=>x-y),p}}
const V=l=>{let{w,a,g}=l,v=new Uint8Array(a.length),q=[...g]
for(let x of g)v[x]=1
while(q.length){let x=q.shift()
for(let[dx,dy]of D){let d=dy*w+dx,y=x-d
if(!a[y]&&!a[y-d]&&!v[y]){v[y]=1;q.push(y)}}}
return v}
const H=(l,o,f,s,t,k)=>{let{w,a}=l,n=0,m=f
k[n++]=f;s[f]=t
while(n){let p=k[--n];if(p<m)m=p
for(let j=0;j<4;j++){let q=j?j==1?p+w:j==2?p-1:p+1:p-w
if(!a[q]&&!o[q]&&s[q]!=t){s[q]=t;k[n++]=q}}}
return m}
const W=(l,o,f,t)=>{let{w,a}=l
if(f==t)return''
let p=new Int32Array(a.length).fill(-1),q=[f]
p[f]=-2
for(let i=0;i<q.length;i++){let x=q[i]
if(x==t)break
for(let k=0;k<4;k++){let[dx,dy]=D[k],y=x+dy*w+dx
if(a[y]||o[y]||p[y]!=-1)continue
p[y]=x*4+k;q.push(y)}}
if(p[t]==-1)throw new Error
let s=''
for(let x=t;x!=f;){s='udlr'[p[x]%4]+s;x=(p[x]/4)|0}
return s}
const S=(l,M=25e4)=>{let{w,a,g}=l,s=a.length,G=new Uint8Array(s)
for(let x of g)G[x]=1
let V2=V(l),o=new Uint8Array(s),e=new Int32Array(s),n=new Int32Array(s),k=new Int32Array(s),T=0
let Z=b=>b.every(x=>G[x])
let q=[l.b],u=[l.p],A=[-1],m=new Map
for(let x of l.b)o[x]=1
m.set(l.b+','+H(l,o,l.p,e,++T,k),0)
for(let x of l.b)o[x]=0
let f=Z(l.b)?0:-1
for(let h=0;f<0&&h<q.length;h++){let b=q[h]
for(let x of b)o[x]=1
H(l,o,u[h],e,++T,k)
let Y=T
for(let i=0;i<b.length&&f<0;i++){let x=b[i]
for(let[dx,dy]of D){let d=dy*w+dx,t=x+d
if(e[x-d]!=Y||a[t]||o[t]||!V2[t])continue
o[x]=0;o[t]=1
let z=0,J=-1,N=null
for(let y of[t,t-1,t-w,t-w-1]){let j=y+1,C=y+w,D2=C+1
if((a[y]||o[y])&&(a[j]||o[j])&&(a[C]||o[C])&&(a[D2]||o[D2])&&(o[y]&&!G[y]||o[j]&&!G[j]||o[C]&&!G[C]||o[D2]&&!G[D2])){z=1;break}}
if(!z){N=[...b];N[i]=t;N.sort((x,y)=>x-y);J=N+','+H(l,o,x,n,++T,k)}
o[t]=0;o[x]=1
if(z||m.has(J))continue
if(q.length>=M){for(let x of b)o[x]=0;return null}
m.set(J,q.length);q.push(N);u.push(x);A.push(h)
if(Z(N)){f=q.length-1;break}}}
for(let x of b)o[x]=0}
if(f<0)return null
let P=[]
for(let x=f;x>0;x=A[x])P.push(x)
P.reverse()
let v='',p=l.p,b=l.b
for(let x of P){let N=q[x],f2=b.find(y=>!N.includes(y)),t2=N.find(y=>!b.includes(y)),d=t2-f2,J=D.find(([dx,dy])=>dy*w+dx==d)
for(let y of b)o[y]=1
v+=W(l,o,p,f2-d)
for(let y of b)o[y]=0
v+=J[3];p=f2;b=N}
return{pushes:P.length,moves:v}}
const C=l=>{let{w,a,g,b,p}=l,V2=V(l),r=Math.floor(p/w),c=new Uint8Array(a.length)
for(let i=r*w;i<(r+1)*w;i++)if(!a[i]&&!V2[i])c[i]=1
if(b.some(x=>c[x]))return null
let t=new Int32Array(a.length).fill(-1),R=[]
for(let s=0;s<a.length;s++){if(a[s]||c[s]||t[s]>=0)continue
let Q=[s];t[s]=R.length
for(let i=0;i<Q.length;i++)for(let[dx,dy]of D){let y=Q[i]+dy*w+dx
if(!a[y]&&!c[y]&&t[y]<0){t[y]=R.length;Q.push(y)}}
R.push([[],[]])}
for(let x of b)R[t[x]][0].push(x)
for(let x of g)if(t[x]>=0)R[t[x]][1].push(x)
if(g.some(x=>t[x]<0)||R.some(x=>x[0].length!=x[1].length))return null
return R.filter(x=>x[0].length)}
const B=(l,M=25e4)=>{let R=C(l)
if(!R)return S(l,M)
let p=l.p,u=0,v=''
for(let r of R){let a=l.a.slice()
for(let o of R)if(o!=r)for(let x of o.done?o[1]:o[0])a[x]=1
let s={w:l.w,a,g:r[1].slice().sort((x,y)=>x-y),b:r[0].slice().sort((x,y)=>x-y),p},z=S(s,M)
if(!z)return null
u+=z.pushes;v+=z.moves
for(let c of z.moves.toLowerCase())p+=c=='u'?-l.w:c=='d'?l.w:c=='l'?-1:1
r.done=1}
return{pushes:u,moves:v}}
for(let i=1;i<6;i++){let d='i00'+i,l=P(readFileSync(I+'/'+d+'/level.txt','utf8')),r=B(l),m=r?r.moves:(r=S(l))?r.moves:'';mkdirSync(O+'/'+d,{recursive:true});writeFileSync(O+'/'+d+'/solution.txt',m+'\n')}
