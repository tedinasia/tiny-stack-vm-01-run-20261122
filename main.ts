// Tiny stack VM (ISA 32-bit, Node 22): jalankan tiap program di /input/<id>/,
// tulis /output/<id>/stdout.bin + exit.txt. Semua trap ikut ISA.md/vm.mjs.
import{readFileSync as R,writeFileSync as W,mkdirSync as K,readdirSync as L}from"node:fs";
import{join as J}from"node:path";
function V(P,I){
const n=P.length,D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),O=new Uint8Array(65536);
let sp=0,cp=0,ol=0,ip=0,pc=0,st=0;
const E=c=>[c,O.subarray(0,ol)];
for(;;){
if(st===1e6)return E(10);
if(pc<0||pc>=n)return E(9);
const o=P[pc],im=o===1?1:o===2?4:o>47&&o<52?2:0;
if(pc+im>=n)return E(9);
st++;const nx=pc+1+im;pc=nx;
switch(o){
case 0:return E(0);
case 1:if(sp>255)return E(3);D[sp++]=(P[nx-1]<<24)>>24;break;
case 2:if(sp>255)return E(3);D[sp++]=P[nx-4]|P[nx-3]<<8|P[nx-2]<<16|P[nx-1]<<24;break;
case 3:if(!sp)return E(2);sp--;break;
case 4:if(!sp)return E(2);if(sp>255)return E(3);D[sp]=D[sp-1];sp++;break;
case 5:if(sp<2)return E(2);{const t=D[sp-1];D[sp-1]=D[sp-2];D[sp-2]=t}break;
case 6:if(sp<2)return E(2);if(sp>255)return E(3);D[sp]=D[sp-2];sp++;break;
case 7:if(sp<3)return E(2);{const a=D[sp-3];D[sp-3]=D[sp-2];D[sp-2]=D[sp-1];D[sp-1]=a}break;
case 23:if(!sp)return E(2);D[sp-1]=-D[sp-1]|0;break;
case 27:if(!sp)return E(2);D[sp-1]=~D[sp-1];break;
case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
if(sp<2)return E(2);
const b=D[sp-1],a=D[sp-2];let r;
switch(o){
case 16:r=(a+b)|0;break;
case 17:r=(a-b)|0;break;
case 18:r=Math.imul(a,b);break;
case 19:if(!b)return E(4);r=(a/b)|0;break;
case 20:if(!b)return E(4);r=a%b|0;break;
case 21:if(!b)return E(4);r=Math.floor((a>>>0)/(b>>>0))|0;break;
case 22:if(!b)return E(4);r=(a>>>0)%(b>>>0)|0;break;
case 24:r=a&b;break;
case 25:r=a|b;break;
case 26:r=a^b;break;
case 28:r=a<<(b&31);break;
case 29:r=a>>(b&31);break;
case 30:r=(a>>>(b&31))|0;break;
case 32:r=a===b?1:0;break;
case 33:r=a<b?1:0;break;
default:r=a>>>0<b>>>0?1:0;
}
sp-=2;D[sp++]=r;break}
case 48:case 49:case 50:{
const rel=((P[nx-2]|P[nx-1]<<8)<<16)>>16;
let t=1;
if(o!==48){if(!sp)return E(2);const v=D[--sp];t=o===49?v===0:v!==0}
if(t)pc=nx+rel;
break}
case 51:if(cp===64)return E(7);C[cp++]=nx;pc=P[nx-2]|P[nx-1]<<8;break;
case 52:if(!cp)return E(8);pc=C[--cp];break;
case 64:if(!sp)return E(2);{const a=D[sp-1];if(a<0||a>255)return E(6);D[sp-1]=M[a]}break;
case 65:if(sp<2)return E(2);{const a=D[sp-1];if(a<0||a>255)return E(6);M[a]=D[sp-2];sp-=2}break;
case 80:if(!sp)return E(2);{const s=String(D[sp-1]);if(ol+s.length>65536)return E(11);for(let j=0;j<s.length;j++)O[ol++]=s.charCodeAt(j);sp--}break;
case 81:if(!sp)return E(2);if(ol>65535)return E(11);O[ol++]=D[--sp]&255;break;
case 82:if(sp>255)return E(3);D[sp++]=ip<I.length?I[ip++]:-1;break;
case 83:if(!sp)return E(2);return E(D[--sp]&255);
default:return E(5);
}
}
}
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output";
for(const id of L(I).sort()){
const[x,o]=V(R(J(I,id,"program.bin")),R(J(I,id,"input.bin")));
K(J(O,id),{recursive:true});
W(J(O,id,"stdout.bin"),o);
W(J(O,id,"exit.txt"),x+"\n");
}
