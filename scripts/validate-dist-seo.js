#!/usr/bin/env node

const fs=require("fs");
const path=require("path");
const root=path.join(__dirname,"..");
const dist=path.join(root,"dist");
const base="https://alfredconcierge.app";
const sitemap=fs.readFileSync(path.join(root,"public/sitemap.xml"),"utf8");
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(function(m){return m[1]});
const failures=[];

for(const url of urls){
  const pathname=new URL(url).pathname;
  const file=pathname==="/"?path.join(dist,"index.html"):path.join(dist,pathname.replace(/^\//,""),"index.html");
  if(!fs.existsSync(file)){failures.push(`missing ${pathname}`);continue}
  const html=fs.readFileSync(file,"utf8");
  const canonicals=html.match(/<link rel="canonical" href="([^"]+)"/g)||[];
  if(canonicals.length!==1)failures.push(`${pathname}: ${canonicals.length} canonicals`);
  const canonicalMatch=html.match(/<link rel="canonical" href="([^"]+)"/);
  const expected=(base+pathname).replace(/\/$/,"");
  if(!canonicalMatch||canonicalMatch[1].replace(/\/$/,"")!==expected)failures.push(`${pathname}: wrong canonical`);
  if((html.match(/<title>/g)||[]).length!==1)failures.push(`${pathname}: wrong title count`);
  if((html.match(/<h1(?:\s|>)/g)||[]).length!==1)failures.push(`${pathname}: wrong H1 count`);
  if(!/<meta name="description" content="[^"]+"/.test(html))failures.push(`${pathname}: missing description`);
  if(/hreflang=/.test(html))failures.push(`${pathname}: unsupported hreflang`);
  if(failures.length>=30)break;
}

if(failures.length){console.error(failures.map(function(f){return `- ${f}`}).join("\n"));process.exit(1)}
console.log(`Built SEO validation passed (${urls.length} pages)`);
