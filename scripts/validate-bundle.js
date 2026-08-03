#!/usr/bin/env node

const fs=require("fs");
const path=require("path");
const zlib=require("zlib");
const root=path.join(__dirname,"..");
const index=fs.readFileSync(path.join(root,"dist/index.html"),"utf8");
const match=index.match(/<script[^>]+type="module"[^>]+src="([^"]+index-[^"]+\.js)"/);
const failures=[];

if(!match){
  failures.push("could not locate the main entry bundle");
}else{
  const relative=match[1].replace(/^\//,"");
  const source=fs.readFileSync(path.join(root,"dist",relative));
  const gzipBytes=zlib.gzipSync(source).length;
  if(source.length>600*1024) failures.push(`main bundle exceeds 600 KiB raw (${Math.round(source.length/1024)} KiB)`);
  if(gzipBytes>180*1024) failures.push(`main bundle exceeds 180 KiB gzip (${Math.round(gzipBytes/1024)} KiB)`);
  if(source.includes(Buffer.from("phc_kJpL4"))) failures.push("retired hardcoded PostHog key remains in the main bundle");
  console.log(`main bundle: ${Math.round(source.length/1024)} KiB raw / ${Math.round(gzipBytes/1024)} KiB gzip`);
}

const activeJs=fs.readdirSync(path.join(root,"dist/assets")).filter((file)=>file.endsWith(".js")).map((file)=>fs.readFileSync(path.join(root,"dist/assets",file),"utf8")).join("\n");
if(/guaranteed VIP table placement|Full insurance is always included|Alfred Lounge · pool-side chicane view|Bruce Wayne|responds in seconds|Every door open|waived advance payment requirement|VIP flag in venue systems|direct relationships at every venue|booking confirmations in under 15 minutes|200\+ Michelin restaurants/i.test(activeJs)) failures.push("unsupported legacy marketing claims remain in active bundles");

if(failures.length){
  console.error(failures.map((failure)=>`- ${failure}`).join("\n"));
  process.exit(1);
}
console.log("Bundle validation passed");
