(function(){const header=document.querySelector(".search-header");const match=window.location.href.match(/\?q=([^&]+)/);if(!match){header.innerText="";return;}
const query=decodeURIComponent(match[1].replace(/\+/g," "));header.innerText="Searching for "+query+"....";const pattern=new RegExp(query.toLowerCase().replace(/[.*+\-?^${}()|[\]\\]/g,'\\$&'));const keys=["title","permalink","tags","categories","contents"];function search(item){for(let i=0;i<keys.length;i++){const key=keys[i];if(!item[key]){continue;}
if(key==="tags"){if(item[key].some(tag=>pattern.test(tag.toLowerCase()))){return true;}}else if(key==="categories"){if(item[key].some(category=>pattern.test(category.toLowerCase()))){return true;}}else if(pattern.test(item[key].toLowerCase())){return true;}}
return false;}
let httpRequest=new XMLHttpRequest();httpRequest.onreadystatechange=function(){if(httpRequest.readyState===4&&httpRequest.status===200){let results=JSON.parse(httpRequest.responseText).filter(search);results=results.filter((obj,pos,arr)=>{return arr.map(mapObj=>mapObj.permalink).indexOf(obj.permalink)==pos;});const numResults=results.length;if(numResults===0){header.innerText="No results found for "+query+".";return;}
header.innerText="Found "+numResults+" result"+
(numResults>1?"s":"")+" for "+query+".";let searchItems="";for(let i=0;i<numResults;i++){searchItems+='<li class="list-item"><a href="'+results[i].permalink+'">'+results[i].title+'</a> ('+'<time datetime="'+
results[i].date+
'">'+
new Date(results[i].date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})+
"</time>"+')</li>';}
document.getElementById("search-results").innerHTML=searchItems;}else{if(httpRequest.readyState===4&&httpRequest.status!==200){header.innerText="Something went wrong while searching."}
return;}};httpRequest.open("GET","/js/search_base.json");httpRequest.send();})();