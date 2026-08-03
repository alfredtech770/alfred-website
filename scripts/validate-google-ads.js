#!/usr/bin/env node

const fs=require("fs");
const path=require("path");
const root=path.join(__dirname,"..");
const failures=[];

function parseLine(line){
  const fields=[];
  let field="";
  let quoted=false;
  for(let i=0;i<line.length;i++){
    const char=line[i];
    if(char==='"'){
      if(quoted&&line[i+1]==='"'){field+='"';i++}else{quoted=!quoted}
    }else if(char===","&&!quoted){fields.push(field);field=""}else{field+=char}
  }
  fields.push(field);
  return fields;
}

function readCsv(file){
  const lines=fs.readFileSync(path.join(root,file),"utf8").trim().split(/\r?\n/);
  const headers=parseLine(lines.shift());
  return lines.map((line,index)=>{
    const values=parseLine(line);
    if(values.length!==headers.length) failures.push(`${file}:${index+2} has ${values.length} columns; expected ${headers.length}`);
    return Object.fromEntries(headers.map((header,i)=>[header,values[i]||""]));
  });
}

const ads=readCsv("marketing/google-ads/responsive-search-ads.csv");
const keywords=readCsv("marketing/google-ads/search-keywords.csv");
const negatives=readCsv("marketing/google-ads/negative-keywords.csv");

for(const [index,ad] of ads.entries()){
  for(let number=1;number<=5;number++){
    const headline=ad[`Headline ${number}`];
    if(!headline) failures.push(`ad ${index+1} is missing Headline ${number}`);
    if(headline.length>30) failures.push(`ad ${index+1} Headline ${number} exceeds 30 characters (${headline.length})`);
  }
  for(let number=1;number<=2;number++){
    const description=ad[`Description ${number}`];
    if(!description) failures.push(`ad ${index+1} is missing Description ${number}`);
    if(description.length>90) failures.push(`ad ${index+1} Description ${number} exceeds 90 characters (${description.length})`);
  }
  if(!/^https:\/\/alfredconcierge\.app\//.test(ad["Final URL"])) failures.push(`ad ${index+1} has an invalid final URL`);
}

for(const [index,keyword] of keywords.entries()){
  if(!["Exact","Phrase"].includes(keyword["Match type"])) failures.push(`keyword ${index+1} must use Exact or Phrase match for the pilot`);
  if(!/^https:\/\/alfredconcierge\.app\//.test(keyword["Final URL"])) failures.push(`keyword ${index+1} has an invalid final URL`);
}

if(negatives.length<20) failures.push("the pilot needs at least 20 negative keywords");

if(failures.length){
  console.error(failures.map((failure)=>`- ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`Google Ads validation passed (${ads.length} ads, ${keywords.length} keywords, ${negatives.length} negatives)`);
