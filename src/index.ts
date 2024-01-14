type LiconOptions = {
  check?: boolean;
  classes?: string;
  target?: string[];
  fallbackIcon?: string; // URL
};


const BAD_GOOGLE_B64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAACiElEQVQ4EaVTzU8TURCf2tJuS7tQtlRb6UKBIkQwkRRSEzkQgyEc6lkOKgcOph78Y+CgjXjDs2i44FXY9AMTlQRUELZapVlouy3d7kKtb0Zr0MSLTvL2zb75eL838xtTvV6H/xELBptMJojeXLCXyobnyog4YhzXYvmCFi6qVSfaeRdXdrfaU1areV5KykmX06rcvzumjY/1ggkR3Jh+bNf1mr8v1D5bLuvR3qDgFbvbBJYIrE1mCIoCrKxsHuzK+Rzvsi29+6DEbTZz9unijEYI8ObBgXOzlcrx9OAlXyDYKUCzwwrDQx1wVDGg089Dt+gR3mxmhcUnaWeoxwMbm/vzDFzmDEKMMNhquRqduT1KwXiGt0vre6iSeAUHNDE0d26NBtAXY9BACQyjFusKuL2Ry+IPb/Y9ZglwuVscdHaknUChqLF/O4jn3V5dP4mhgRJgwSYm+gV0Oi3XrvYB30yvhGa7BS70eGFHPoTJyQHhMK+F0ZesRVVznvXw5Ixv7/C10moEo6OZXbWvlFAF9FVZDOqEABUMRIkMd8GnLwVWg9/RkJF9sA4oDfYQAuzzjqzwvnaRUFxn/X2ZlmGLXAE7AL52B4xHgqAUqrC1nSNuoJkQtLkdqReszz/9aRvq90NOKdOS1nch8TpL555WDp49f3uAMXhACRjD5j4ykuCtf5PP7Fm1b0DIsl/VHGezzP1KwOiZQobFF9YyjSRYQETRENSlVzI8iK9mWlzckpSSCQHVALmN9Az1euDho9Xo8vKGd2rqooA8yBcrwHgCqYR0kMkWci08t/R+W4ljDCanWTg9TJGwGNaNk3vYZ7VUdeKsYJGFNkfSzjXNrSX20s4/h6kB81/271ghG17l+rPTAAAAAElFTkSuQmCC';
const BAD_DDG_B64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkI4OUQxMDdDQTYwMTFFNEJGMThCRkI4NTA4NTkyNkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkI4OUQxMDhDQTYwMTFFNEJGMThCRkI4NTA4NTkyNkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCQjg5RDEwNUNBNjAxMUU0QkYxOEJGQjg1MDg1OTI2RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCQjg5RDEwNkNBNjAxMUU0QkYxOEJGQjg1MDg1OTI2RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjGq5lQAAAI0SURBVHja1Jo9jsIwEIW9Fh17gBxgD0B63EPPBXIBDkAP/Ub0XIAeeuiTA3CAHID061mNkWXlPzN28qQRQojkffZkPEn8dT6fBYFiHSv8jDCqVGBkOnL8HKXFSNNbHUrHsuN/DNwKv5c6HjpuQ2EWA40nlokxAvANBszIpS9IHwAYub2OteARDMivjqeOFFOtVbLjwRWODpd5W2s8l6ICgFE/9shzQZRaRzz3KICDjp0Ipx16GARwwIsrtDZNELIhbaZg3obYdwVQgdOmKZ1UG0DUlnOBdXBXeVmROssJAyzdVJLOCktV51867ozrRFy1EieE5mGU3tYFSK3EtBzS6SapzZ+YZsJ0vh+ALYN5wQyxtQEUEcC75jcOCGUAYqLKs2kpwdQQ4DmWRLkfCmIl7ZI0Q4j/GYh8N2CEEBEXgC+ISApesUNwA7BD+ABglQ+AO44yy52fnLN5A1DM1Tx45wLwYf4DkM3UPCgDgHym5kG5mYFyhuZLMwOgB8EBf3R8ezL/8WwAbkQAaQUE1xO+mw2QEV0LLgSX+dy9qQddiA5uIDifrV6qVmIgehJCcJl/2qXfbSVSoorEpRI91vZCRUspDK2T2znImvJ0naD5a1W5r+tGU8H3bHPoIpn2badPE4FoXOFlh5y7Bk6bxmuyy3viFMsW1HVf7w5KNN7a4nS9I4MDJYTrRFudT7r2Z33e1Bc4C5RbDdz2gHWrgb1iZ2LYZo+qVPG+2cMFESLgdps/AQYA9D2Sc4DqpGYAAAAASUVORK5CYII=';
const FALLBACK_ICON = 'https://icons.duckduckgo.com/ip3/duckduckgo.com.ico' // FIXME - real fallback

const staticGoogleIcons = {
  google_docs: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
  google_sheets: 'https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico',
  google_slides:
    'https://ssl.gstatic.com/docs/presentations/images/favicon5.ico',
  google_mail: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
  google_forms:
    'https://ssl.gstatic.com/docs/spreadsheets/forms/favicon_qp2.png',
};

const isLink = (str: string) =>
  /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(str);

const b64FromUrl = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const toIconUrlAsync = async (url: string, fallback?: string) => {
  const urlObj = new URL(url);
  const { hostname } = urlObj;

  let iUrl = `https://icons.duckduckgo.com/ip3/${hostname}.ico`;

  const asB64 = await b64FromUrl(iUrl);

  if(asB64 === BAD_DDG_B64) {
    iUrl = `https://www.google.com/s2/favicons?domain=${hostname}`;
  }

  const asB64Google = await b64FromUrl(iUrl);

  if(asB64Google === BAD_GOOGLE_B64) {
    if(fallback) {
      return fallback;
    }

    return FALLBACK_ICON;
  }

  return iUrl;
};

const toIconUrl = (url: string) => {
  const urlObj = new URL(url);
  const { hostname } = urlObj;
  return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
};

async function checkLinkAuto(
  url: string,
  element: HTMLElement,
  fallback?: string
) {
  const iconUrl = await toIconUrlAsync(url, fallback);
  return [element, iconUrl] as const;
}

function grabLinks(root?: HTMLElement) {
  const tWalker = document.createTreeWalker(
    root ?? document.body,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        // Skip if not anchor or no text
        const notAnchorNoText = node.nodeName !== 'A' || !node.textContent;
        if (notAnchorNoText) {
          return NodeFilter.FILTER_SKIP;
        }

        if (node.nodeName === 'A') {
          return NodeFilter.FILTER_ACCEPT;
        }

        if (node.textContent) {
          if (isLink(node.textContent)) {
            return NodeFilter.FILTER_ACCEPT;
          }
        }

        return NodeFilter.FILTER_SKIP;
      },
    }
  );

  const linkNodes = [];
  const links: [HTMLElement, string][] = [];
  while (tWalker.nextNode()) {
    linkNodes.push(tWalker.currentNode);
  }

  for (const nd of linkNodes) {
    const ele = nd as HTMLElement;
    const hasHref = ele.hasAttribute('href');

    if (hasHref) {
      const href = ele.getAttribute('href');
      if (href) {
        links.push([ele, href]);
      }
    } else {
      const textContent = ele.textContent;
      if (textContent) {
        if (isLink(textContent)) {
          links.push([ele, textContent]);
        }
      }
    }
  }

  // Filter out relative and anchor links
  links.filter((info) => {
    if (info[1] === '#') {
      return false;
    }
    if (info[1] === '/') {
      return false;
    }
    return true;
  });

  return links;
}

async function licon(opts: LiconOptions) {
  const classes = opts?.classes ?? null;
  const target = opts?.target ?? null;
  const fallbackIcon = opts?.fallbackIcon ?? undefined;
  const check = opts?.check ?? true;

  if (target) {
    const iconLinks = target.map((u) => toIconUrl(u));
    return iconLinks;
    // const iconLinks: string[] = [];
    // if (!check) {
    // }

    // const linkChecks = target.map((url) => toIconUrlAsync(url, fallbackIcon));
    // const results = await Promise.all(linkChecks);
    // for (const res of results) {
    //   iconLinks.push(res);
    // }

    // return iconLinks;
  }

  const links = grabLinks();
  const iconLinks = links.map((info) => {
    const iconUrl = toIconUrl(info[1]);
    return [info[0], iconUrl] as const;
  });

  for (const [ele, href] of iconLinks) {
    const img = document.createElement('img');
    img.src = href;
    img.style.width = '1em';
    img.style.height = '1em';
    img.style.marginRight = '0.5em';
    img.style.verticalAlign = 'middle';
    ele.insertAdjacentElement('afterbegin', img);
  }


  // if (!check) {
  // }

  // // Grab all links from page, replace insert adjacent html with icon
  // const links = grabLinks();
  // const linkChecks = links.map((info) =>
  //   checkLinkAuto(info[1], info[0], fallbackIcon)
  // );
  // const results = await Promise.all(linkChecks);

  // for (const [ele, href] of results) {
  //   const img = document.createElement('img');
  //   img.src = href;
  //   img.style.width = '1em';
  //   img.style.height = '1em';
  //   img.style.marginRight = '0.5em';
  //   img.style.verticalAlign = 'middle';
  //   ele.insertAdjacentElement('afterbegin', img);
  // }
}

export default licon;
