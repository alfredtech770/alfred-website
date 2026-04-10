import { createContext, useContext, useState, useEffect } from "react";

var ProposalContext = createContext();

export function ProposalProvider(props){
  var [items, setItems] = useState(function(){
    try { return JSON.parse(localStorage.getItem("alfred_proposal") || "[]"); } catch(e){ return []; }
  });
  var [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(function(){
    localStorage.setItem("alfred_proposal", JSON.stringify(items));
  }, [items]);

  function addItem(item){
    setItems(function(prev){
      /* prevent duplicates by category+id */
      if(prev.some(function(p){ return p.category === item.category && p.id === item.id; })) return prev;
      return prev.concat([item]);
    });
    setDrawerOpen(true);
  }

  function removeItem(category, id){
    setItems(function(prev){ return prev.filter(function(p){ return !(p.category === category && p.id === id); }); });
  }

  function clearAll(){ setItems([]); }

  function isInProposal(category, id){
    return items.some(function(p){ return p.category === category && p.id === id; });
  }

  return (
    <ProposalContext.Provider value={{items:items, addItem:addItem, removeItem:removeItem, clearAll:clearAll, isInProposal:isInProposal, drawerOpen:drawerOpen, setDrawerOpen:setDrawerOpen}}>
      {props.children}
    </ProposalContext.Provider>
  );
}

export function useProposal(){ return useContext(ProposalContext); }

export default ProposalContext;
