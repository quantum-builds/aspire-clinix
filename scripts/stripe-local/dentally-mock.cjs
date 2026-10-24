// Minimal Dentally stand-in. POST /appointments -> 201, unless $S/dentally-fail exists -> 500.
const http=require("http"),fs=require("fs");
const FAIL=__dirname+"/dentally-fail"; let n=0;
http.createServer((req,res)=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>{
  console.log(new Date().toISOString(),req.method,req.url,b);
  if(req.method==="POST"&&req.url.startsWith("/appointments")){
    if(fs.existsSync(FAIL)){res.writeHead(500,{"content-type":"application/json"});return res.end('{"error":{"type":"api_error","message":"mock outage"}}');}
    n++;res.writeHead(201,{"content-type":"application/json"});return res.end(JSON.stringify({appointment:{id:900000+n,start_time:"x"}}));}
  res.writeHead(404);res.end("{}");});}).listen(4010,"127.0.0.1",()=>console.log("dentally mock on 4010"));
