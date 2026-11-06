// Brief state: a new brief starts clean unless the visitor arrived with something chosen for it.
(() => {
 const LOCAL=['rukaBrief','rukaDraft','rukaProduct','rukaProductTech','rukaIdea','rukaIdeaBudget','rukaIdeaMood','rukaSearchIntent','rukaFilterIntent','rukaOccasion','rukaConcept','rukaDirection','rukaHandoff','rukaRefPics'];
 const remove=keys=>keys.forEach(key=>{try{localStorage.removeItem(key)}catch{}});
 window.rukaClearBrief=()=>{remove(LOCAL);try{sessionStorage.removeItem('rukaGiftPlan')}catch{}};
 if(!/\/brief(\.html)?$/.test(location.pathname))return;
 const params=new URLSearchParams(location.search);
 const navType=performance.getEntriesByType('navigation')[0]?.type;
 if(params.get('planner')==='1'||params.get('resume')==='1'||navType==='reload'||navType==='back_forward')return;
 let handoff='';try{handoff=localStorage.getItem('rukaHandoff')||''}catch{}
 const occasion=params.get('occasion');
 if(handoff==='product'){remove(['rukaHandoff','rukaIdea','rukaIdeaBudget','rukaIdeaMood']);return}
 if(handoff==='idea'){remove(['rukaHandoff','rukaBrief','rukaDraft','rukaProduct','rukaProductTech','rukaSearchIntent','rukaFilterIntent']);return}
 if(handoff==='search'){remove(['rukaHandoff','rukaBrief','rukaDraft','rukaProduct','rukaProductTech','rukaIdea','rukaIdeaBudget','rukaIdeaMood','rukaFilterIntent']);return}
 window.rukaClearBrief();
 if(occasion)try{localStorage.setItem('rukaOccasion',occasion)}catch{}
})();
