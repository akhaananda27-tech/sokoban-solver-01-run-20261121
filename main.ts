import fs from'fs'
const{MAKEFUN_INPUT_DIR:I='/input',MAKEFUN_OUTPUT_DIR:O='/output'}=process.env
const P=t=>{let w=t.indexOf('\n'),a=new Uint8Array(t.length).fill(1),g=[],b=[],p=-1,j=0
for(let c of t){if(c=='\n')continue;if(c!='#'){a[j]=0;'.*+'.includes(c)&&g.push(j);'$*'.includes(c)&&b.push(j);'@+'.includes(c)&&(p=j)}j++}
return{w,a,g,b,p,D:[-w,w,-1,1]}}
const W=(l,o,f,t)=>{let{a,D}=l,s=new Uint8Array(a.length),r=''
let F=x=>x==t||(s[x]=1,D.some((d,k)=>{let y=x+d;return!(a[y]|o[y])&&!s[y]&&F(y)?(r='udlr'[k]+r,1):0}))
F(f);return r}
const S=l=>{let{w,a,g,D}=l,s=a.length
let o=new Uint8Array(s),e=new Int32Array(s),T=0
let O=(b,v)=>b.forEach(x=>o[x]=v),K=x=>a[x]|o[x]
let Z=b=>b.every(x=>g.includes(x))
let q=[l.b,l.p,-1,0,0],m=new Set
for(let x of l.b)o[x]=1
m.add(l.b+','+l.p)
let f=Z(l.b)?0:-1
for(let h=0;f<0&&h<q.length;h+=5){let b=q[h]
O(b,1)
let Y=++T,F=p=>{e[p]=Y;for(let d of D){let y=p+d;!K(y)&&e[y]!=Y&&F(y)}};F(q[h+1])
for(let i=0;i<b.length&&f<0;i++){let x=b[i]
for(let k=0;k<4;k++){let d=D[k],t=x+d
if(e[x-d]!=Y||K(t))continue
let J,N
N=[...b];N[i]=t;N.sort((x,y)=>x-y);J=N+','+x
if(m.has(J))continue
if(q.length>=250e4)return null
m.add(J);q.push(N,x,h,d,k)
if(Z(N)){f=q.length-5;break}}}
O(b,0)}
if(f<0)return null
let P=[]
for(let x=f;x>0;x=q[x+2])P.unshift(x)
let v='',p=l.p,b=l.b
for(let x of P){let N=q[x],f2=q[x+1],d=q[x+3]
O(b,1)
v+=W(l,o,p,f2-d)
O(b,0)
v+='UDLR'[q[x+4]];p=f2;b=N}
return[P.length,v,p]}
const B=l=>{let{w,a,g,b,p,D}=l,r=(p/w)|0,c=new Uint8Array(a.length)
c.fill(1,r*w,r*w+w)
if(b.some(x=>c[x]))return null
let t=[],R=[]
for(let s=0;s<a.length;s++){if(a[s]||c[s]||t[s]>=0)continue
let F=q=>{t[q]=R.length;for(let d of D){let y=q+d;!(a[y]|c[y])&&t[y]==null&&F(y)}};F(s)
R.push([[],[]])}
for(let x of b)R[t[x]][0].push(x)
for(let x of g)if(t[x]>=0)R[t[x]][1].push(x)
if(g.some(x=>t[x]==null)||R.some(x=>x[0].length!=x[1].length))return null
R=R.filter(x=>x[0].length)
let u=0,v=''
for(let q of R){let A=a.slice()
for(let o of R)if(o!=q)for(let x of o[0])A[x]=1
let z=S({w,a:A,g:q[1],b:q[0],p,D})
if(!z)return null
u+=z[0];v+=z[1];p=z[2]
q[0]=q[1]}
return[u,v]}
for(let i=1;i<6;i++){let l=P(fs.readFileSync(I+'/i00'+i+'/level.txt')+''),m=(B(l)||S(l)||[,''])[1];fs.mkdirSync(O+'/i00'+i,{recursive:!0});fs.writeFileSync(O+'/i00'+i+'/solution.txt',m+'\n')}
