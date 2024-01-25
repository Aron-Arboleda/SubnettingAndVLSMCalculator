import { SubnettingInit } from "./ui-subnetting.js";
import { VLSMInit } from "./ui-vlsm.js";

const homepage = document.querySelector('main div').innerHTML;
const siteLogo = document.querySelector('header img');

const contentArea = document.querySelector('main div');
const sidebarsBtn = document.querySelectorAll('aside button');

const menuBtn = document.querySelector('nav #nav-button');
const sidebar = document.querySelector('aside');

function windowOnClick(event) {
    if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
      sidebar.style.display = 'none';
      window.removeEventListener('click', windowOnClick);
    }
  }
  
menuBtn.onclick = () => {
    sidebar.style.display = 'flex';
    window.addEventListener('click', windowOnClick);
};

window.addEventListener('resize', function() {
    if (window.innerWidth >= 956){
        sidebar.style.display = 'flex';
    } else {
        sidebar.style.display = 'none';
    }
});

export function unchild(parent) {
    if (parent) {
      let child = parent.firstChild;
      while (child) {
        child.remove();
        child = parent.firstChild;
      }
    }
  }
  
siteLogo.onclick = () => {
    unchild(contentArea);
    contentArea.innerHTML = homepage;
};

sidebarsBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        unchild(contentArea);
    });
});

sidebarsBtn[0].addEventListener('click', SubnettingInit);
sidebarsBtn[1].addEventListener('click', VLSMInit);