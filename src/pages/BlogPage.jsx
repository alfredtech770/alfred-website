import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { BLOG_POSTS } from "./BlogPost";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gold:"#FFD60A"};

function BlogPage(){
  var navigate=useNavigate();
  var [mob,setMob]=useState(window.innerWidth<768);
  var [selectedCategory,setSelectedCategory]=useState("All");

  useEffect(function(){
    function h(){setMob(window.innerWidth<768)}
    window.addEventListener("resize",h);
    return function(){window.removeEventListener("resize",h)}
  },[]);

  var categories=["All",...new Set(BLOG_POSTS.map(function(p){return p.category}))];
  var filteredPosts=selectedCategory==="All"?BLOG_POSTS:BLOG_POSTS.filter(function(p){return p.category===selectedCategory});

  var seoJsonLd={
    "@context":"https://schema.org",
    "@type":"Blog",
    "headline":"The Alfred Journal — Luxury Lifestyle Insights & Guides",
    "description":"Expert guides on fine dining, luxury travel, exotic cars, private jets, yacht charters, nightlife, and concierge services.",
    "url":"https://alfredconcierge.app/blog",
    "publisher":{"@type":"Organization","name":"Alfred Concierge"},
    "image":"https://alfredconcierge.app/og-image.jpg"
  };

  return(
    <div style={{background:C.bg,minHeight:"100vh"}}>
      <SEOHead
        title="The Alfred Journal — Luxury Lifestyle Insights & Guides"
        description="Expert guides on fine dining, luxury travel, exotic cars, private jets, yacht charters, nightlife, and VIP event access. Curated by Alfred Concierge."
        keywords="luxury lifestyle blog, luxury travel guide, fine dining blog, exotic cars, private jet charter, yacht charter, nightclub guide, luxury concierge"
        path="/blog"
        jsonLd={seoJsonLd}
      />

      {/* Hero Section */}
      <div style={{paddingTop:64,paddingBottom:48,textAlign:"center",borderBottom:"1px solid "+C.bd}}>
        <div style={{maxWidth:"900px",margin:"0 auto",paddingLeft:mob?24:0,paddingRight:mob?24:0}}>
          <h1 style={{...sf(mob?36:56,700),color:C.s1,marginBottom:16,lineHeight:1.2}}>The Alfred Journal</h1>
          <p style={{...sf(mob?16:20),color:C.s5,lineHeight:1.8,maxWidth:"600px",margin:"0 auto"}}>Expert insights into the world of luxury lifestyle. From Michelin-starred dining and exotic supercars to private jet travel and yacht charters—discover how to experience the finest that life has to offer.</p>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{paddingTop:40,paddingBottom:40,borderBottom:"1px solid "+C.bd}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",paddingLeft:mob?24:0,paddingRight:mob?24:0}}>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:mob?"flex-start":"center"}}>
            {categories.map(function(cat){
              var active=selectedCategory===cat;
              return(
                <button key={cat} onClick={function(){setSelectedCategory(cat)}} style={{
                  ...sf(14,active?600:400),
                  padding:"10px 18px",
                  borderRadius:10,
                  background:active?C.gn:"transparent",
                  color:active?C.bg:active?C.s1:C.s5,
                  border:"1px solid "+(active?C.gn:C.bd),
                  cursor:"pointer",
                  transition:"all 0.3s",
                  WebkitTapHighlightColor:"transparent",
                  touchAction:"manipulation"
                }} onMouseEnter={function(e){if(!active){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.color=C.s1}}} onMouseLeave={function(e){if(!active){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s5}}}>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div style={{paddingTop:64,paddingBottom:80}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",paddingLeft:mob?24:0,paddingRight:mob?24:0}}>
          {filteredPosts.length===0?(
            <div style={{textAlign:"center",paddingTop:40,paddingBottom:40}}>
              <p style={{...sf(16),color:C.s5}}>No articles in this category yet.</p>
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":filteredPosts.length===1?"1fr":"repeat(auto-fill, minmax(320px, 1fr))",gap:32}}>
              {filteredPosts.map(function(post,i){
                return(
                  <ArticleCard key={post.slug} post={post} index={i} onClick={function(){navigate("/blog/"+post.slug)}}/>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{background:C.el,borderTop:"1px solid "+C.bd,paddingTop:64,paddingBottom:64}}>
        <div style={{maxWidth:"700px",margin:"0 auto",textAlign:"center",paddingLeft:mob?24:0,paddingRight:mob?24:0}}>
          <h2 style={{...sf(32,700),color:C.s1,marginBottom:16}}>Ready to Experience Luxury?</h2>
          <p style={{...sf(16),color:C.s5,marginBottom:32,lineHeight:1.8}}>Explore our full catalog of luxury experiences. From Michelin-starred dining and VIP nightlife to exotic car rentals and private jet charters, Alfred makes it all effortless.</p>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={function(){window.location.href="/catalog"}} style={{
              ...sf(14,600),
              padding:"14px 32px",
              borderRadius:10,
              background:C.gn,
              color:C.bg,
              border:"none",
              cursor:"pointer",
              transition:"all 0.3s"
            }} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(52,199,89,0.3)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
              Browse Catalog
            </button>
            <button onClick={function(){window.location.href="/"}} style={{
              ...sf(14,600),
              padding:"14px 32px",
              borderRadius:10,
              background:"transparent",
              color:C.s1,
              border:"1px solid "+C.s7,
              cursor:"pointer",
              transition:"all 0.3s"
            }} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s1;e.currentTarget.style.background="rgba(244,244,245,0.05)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.background="transparent"}}>
              Contact Alfred
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleCard(p){
  var [hover,setHover]=useState(false);

  return(
    <div onClick={p.onClick} style={{
      cursor:"pointer",
      borderRadius:16,
      overflow:"hidden",
      background:C.el,
      border:"1px solid "+(hover?C.s7:C.bd),
      transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
      transform:hover?"translateY(-8px)":"translateY(0)",
      boxShadow:hover?"0 12px 40px rgba(0,0,0,0.4)":"0 4px 16px rgba(0,0,0,0.15)"
    }} onMouseEnter={function(){setHover(true)}} onMouseLeave={function(){setHover(false)}}>

      {/* Image */}
      <div style={{height:200,overflow:"hidden",position:"relative"}}>
        <img src={p.post.image} alt={p.post.title} style={{
          width:"100%",
          height:"100%",
          objectFit:"cover",
          transform:hover?"scale(1.06)":"scale(1)",
          transition:"transform 0.6s ease",
          display:"block"
        }}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(10,10,11,0.8) 100%)"}}/>

        {/* Category Badge */}
        <div style={{position:"absolute",top:14,left:14}}>
          <span style={{...sf(10,600),color:C.bg,background:C.gn,padding:"4px 10px",borderRadius:6,textTransform:"uppercase",letterSpacing:0.5,display:"inline-block"}}>{p.post.category}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{padding:24}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span style={{...sf(12),color:C.s5}}>
            {new Date(p.post.date).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}
          </span>
          <span style={{...sf(12),color:C.s6}}>·</span>
          <span style={{...sf(12),color:C.s5}}>{p.post.readingTime} min</span>
        </div>

        <h3 style={{...sf(18,600),color:C.s1,marginBottom:10,lineHeight:1.4,minHeight:56,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.post.title}</h3>

        <p style={{...sf(14),color:C.s5,lineHeight:1.6,marginBottom:16,minHeight:42,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.post.excerpt}</p>

        <div style={{display:"flex",alignItems:"center",gap:6,color:hover?C.s1:C.s5,transition:"color 0.3s"}}>
          <span style={{...sf(13,500)}}>Read Article</span>
          <span style={{fontSize:12}}>→</span>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
