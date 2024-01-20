import { SubnettingInit } from "./ui-subnetting.js";
import { VLSMInit } from "./ui-vlsm.js";

const homepage = document.querySelector('main div').innerHTML;
const siteLogo = document.querySelector('header img');

const contentArea = document.querySelector('main div');
const sidebarsBtn = document.querySelectorAll('aside button');

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