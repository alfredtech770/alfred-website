import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function unavailableQuery(){
  var result={data:null,error:{message:"Supabase is not configured for this deployment."}};
  var settled=Promise.resolve(result);
  var query;
  query=new Proxy({}, {
    get:function(_target,property){
      if(property==="then") return settled.then.bind(settled);
      if(property==="catch") return settled.catch.bind(settled);
      if(property==="finally") return settled.finally.bind(settled);
      return function(){return query};
    }
  });
  return query;
}

function unavailableClient(){
  var error={message:"Supabase is not configured for this deployment."};
  return {
    from:function(){return unavailableQuery()},
    rpc:function(){return unavailableQuery()},
    auth:{getSession:function(){return Promise.resolve({data:{session:null},error:error})}},
    storage:{from:function(){return{
      upload:function(){return Promise.resolve({data:null,error:error})},
      getPublicUrl:function(){return{data:{publicUrl:""}}},
    }}},
  };
}

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : unavailableClient();
