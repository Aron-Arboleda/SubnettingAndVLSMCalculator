(()=>{"use strict";const e=document.querySelector("main div"),n=document.querySelector("main div"),t=document.querySelector("main div").innerHTML,i=document.querySelector("header img"),s=document.querySelector("main div"),a=document.querySelectorAll("aside button");function r(e){if(e){let n=e.firstChild;for(;n;)n.remove(),n=e.firstChild}}i.onclick=()=>{r(s),s.innerHTML=t},a.forEach((e=>{e.addEventListener("click",(()=>{r(s)}))})),a[0].addEventListener("click",(function(){e.innerHTML="\n        <h2>Subnetting</h2>\n        <p>Subnetting is a crucial aspect of IP network design achieved by dividing a larger network into smaller subnets. This process involves redistributing host bits within an IP address through binary operations. The subnet mask delineates the network and host portions of the IP address, and administrators choose mask lengths based on specific subnet requirements. Subnetting enables efficient address space utilization and enhances network organization by creating smaller, manageable segments.</p>\n\n        \n\n    "})),a[1].addEventListener("click",(function(){n.innerHTML="\n        <h2>Variable Length Subnet Masking (VLSM)</h2>\n        <p>Variable Length Subnet Masking (VLSM) is an extension of subnetting that allows for the use of different subnet masks within the same network. Unlike standard subnetting, VLSM offers flexibility by permitting variable subnet mask lengths. This means that administrators can allocate larger subnets with longer masks to segments requiring more hosts, and smaller subnets with shorter masks to segments with fewer hosts. VLSM is instrumental in optimizing IP address allocation, especially in hierarchical network designs, ensuring efficient utilization of available address space.</p>\n\n        \n\n    "}))})();