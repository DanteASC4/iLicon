type LiconOptions = {
  wrapperClass?: string;
  imgClass?: string;
  target?: string[];
  setIcons?: { domain: string; icon: string }[]; // URL
  injectLiconStyles?: boolean;
  position?: 'start' | 'end';
  root?: HTMLElement;
  skipIDs?: string[];
  skipClasses?: string[];
  transformer?: (
    originalElement: HTMLElement,
    url: string,
    pos: 'start' | 'end',
    wrapperClass?: string,
    imgClass?: string
  ) => void;
};

const BAD_GOOGLE_B64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAACiElEQVQ4EaVTzU8TURCf2tJuS7tQtlRb6UKBIkQwkRRSEzkQgyEc6lkOKgcOph78Y+CgjXjDs2i44FXY9AMTlQRUELZapVlouy3d7kKtb0Zr0MSLTvL2zb75eL838xtTvV6H/xELBptMJojeXLCXyobnyog4YhzXYvmCFi6qVSfaeRdXdrfaU1areV5KykmX06rcvzumjY/1ggkR3Jh+bNf1mr8v1D5bLuvR3qDgFbvbBJYIrE1mCIoCrKxsHuzK+Rzvsi29+6DEbTZz9unijEYI8ObBgXOzlcrx9OAlXyDYKUCzwwrDQx1wVDGg089Dt+gR3mxmhcUnaWeoxwMbm/vzDFzmDEKMMNhquRqduT1KwXiGt0vre6iSeAUHNDE0d26NBtAXY9BACQyjFusKuL2Ry+IPb/Y9ZglwuVscdHaknUChqLF/O4jn3V5dP4mhgRJgwSYm+gV0Oi3XrvYB30yvhGa7BS70eGFHPoTJyQHhMK+F0ZesRVVznvXw5Ixv7/C10moEo6OZXbWvlFAF9FVZDOqEABUMRIkMd8GnLwVWg9/RkJF9sA4oDfYQAuzzjqzwvnaRUFxn/X2ZlmGLXAE7AL52B4xHgqAUqrC1nSNuoJkQtLkdqReszz/9aRvq90NOKdOS1nch8TpL555WDp49f3uAMXhACRjD5j4ykuCtf5PP7Fm1b0DIsl/VHGezzP1KwOiZQobFF9YyjSRYQETRENSlVzI8iK9mWlzckpSSCQHVALmN9Az1euDho9Xo8vKGd2rqooA8yBcrwHgCqYR0kMkWci08t/R+W4ljDCanWTg9TJGwGNaNk3vYZ7VUdeKsYJGFNkfSzjXNrSX20s4/h6kB81/271ghG17l+rPTAAAAAElFTkSuQmCC';
const BAD_DDG_B64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkI4OUQxMDdDQTYwMTFFNEJGMThCRkI4NTA4NTkyNkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkI4OUQxMDhDQTYwMTFFNEJGMThCRkI4NTA4NTkyNkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCQjg5RDEwNUNBNjAxMUU0QkYxOEJGQjg1MDg1OTI2RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCQjg5RDEwNkNBNjAxMUU0QkYxOEJGQjg1MDg1OTI2RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjGq5lQAAAI0SURBVHja1Jo9jsIwEIW9Fh17gBxgD0B63EPPBXIBDkAP/Ub0XIAeeuiTA3CAHID061mNkWXlPzN28qQRQojkffZkPEn8dT6fBYFiHSv8jDCqVGBkOnL8HKXFSNNbHUrHsuN/DNwKv5c6HjpuQ2EWA40nlokxAvANBszIpS9IHwAYub2OteARDMivjqeOFFOtVbLjwRWODpd5W2s8l6ICgFE/9shzQZRaRzz3KICDjp0Ipx16GARwwIsrtDZNELIhbaZg3obYdwVQgdOmKZ1UG0DUlnOBdXBXeVmROssJAyzdVJLOCktV51867ozrRFy1EieE5mGU3tYFSK3EtBzS6SapzZ+YZsJ0vh+ALYN5wQyxtQEUEcC75jcOCGUAYqLKs2kpwdQQ4DmWRLkfCmIl7ZI0Q4j/GYh8N2CEEBEXgC+ISApesUNwA7BD+ABglQ+AO44yy52fnLN5A1DM1Tx45wLwYf4DkM3UPCgDgHym5kG5mYFyhuZLMwOgB8EBf3R8ezL/8WwAbkQAaQUE1xO+mw2QEV0LLgSX+dy9qQddiA5uIDifrV6qVmIgehJCcJl/2qXfbSVSoorEpRI91vZCRUspDK2T2znImvJ0naD5a1W5r+tGU8H3bHPoIpn2badPE4FoXOFlh5y7Bk6bxmuyy3viFMsW1HVf7w5KNN7a4nS9I4MDJYTrRFudT7r2Z33e1Bc4C5RbDdz2gHWrgb1iZ2LYZo+qVPG+2cMFESLgdps/AQYA9D2Sc4DqpGYAAAAASUVORK5CYII=';
// FIXME - real fallback
const FALLBACK_ICON = 'https://icons.duckduckgo.com/ip3/duckduckgo.com.ico';

const staticGoogleIcons = {
  google_docs: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
  google_sheets: 'https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico',
  google_slides:
    'https://ssl.gstatic.com/docs/presentations/images/favicon5.ico',
  google_mail: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
  google_forms:
    'https://ssl.gstatic.com/docs/spreadsheets/forms/favicon_qp2.png',
  google_maps:
    'https://www.google.com/images/branding/product/ico/maps_32dp.ico',
  google_custom_map: '//www.gstatic.com/mapspro/images/favicon-001.ico',
  google_drive:
    'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png',
};

const isLink = (str: string) =>
  /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(str);

const b64FromUrl = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Request-Method': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': '*',
    },
  });
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
};

const toIconUrlAsync = async (url: string, fallback?: string) => {
  const urlObj = new URL(url);
  const { hostname } = urlObj;

  let iUrl = `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
  const asB64 = await b64FromUrl(iUrl);
  if (asB64 === BAD_DDG_B64) {
    iUrl = `https://www.google.com/s2/favicons?domain=${hostname}`;
  }

  const asB64Google = await b64FromUrl(iUrl);
  if (asB64Google === BAD_GOOGLE_B64) {
    if (fallback) {
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

function defaultTransformer(
  element: HTMLElement,
  url: string,
  pos = 'start',
  wrapperClass = 'ilicon_wrapper',
  imgClass = 'ilicon_img'
) {
  const isAnchor = element.nodeName === 'A';
  if (isAnchor) {
    // If we're working with an anchor tag, we will insert an image and add the wrapper class to the anchor tag
    element.classList.add(wrapperClass);
    const img = document.createElement('img');
    img.classList.add(imgClass);
    img.src = url;
    if (pos === 'start') {
      element.insertAdjacentElement('afterbegin', img);
    } else {
      element.insertAdjacentElement('beforeend', img);
    }
    return;
  }

  //* FIXME Non-anchor tags will be a bit more complex. For now commenting this out.
  // const wrapper = document.createElement('span');
  // wrapper.classList.add(wrapperClass);
  // const img = document.createElement('img');
  // img.classList.add(imgClass);
  // img.src = url;
  // if (pos === 'start') {
  //   wrapper.appendChild(img);
  //   wrapper.appendChild(element);
  // } else {
  //   wrapper.appendChild(element);
  //   wrapper.appendChild(img);
  // }
  // element.replaceWith(wrapper);
}

function injectStyles() {
  // Check if styles are already injected
  const existingStyles = document.getElementById('ilicon-styles');
  if (existingStyles) {
    return;
  }
  const style = document.createElement('style');
  style.id = 'ilicon-styles';
  style.innerHTML = `
  .ilicon_wrapper {
    display: inline-flex;
    align-items: center;
    height: 1cqmax;
  }
  .ilicon_img {
    width: 100%;
    height: 100%;
    margin: 0 0.25rem;
  }
  `;
  document.head.appendChild(style);
}

/**
 * Grab all links under the given root element, defauls to document.body if not provided. Returns an array of tuples containing the element and the link.
 * @param {HTMLElement} [root] - The root element to search for links in
 * @param {{classes: string[], ids: string[]}} [skip] - An object containing classes and ids to skip. {classes: ['class1', 'class2'], ids: ['id1', 'id2']
 * @returns {[HTMLElement, string][]} - An array of tuples containing the element and the link
 *
 * ## Example Usage
 * ```ts
 * // Grab all links on the page from `document.body` checking every element on the page
 * const links = grabLinks();
 *
 * // Grab all links from the given root element
 * const links = grabLinks(document.querySelector('#my-root'));
 *
 * // Grab all links from the given root element, skipping elements with the given classes and ids
 * const links = grabLinks(document.querySelector('#my-root'), {classes: ['class1', 'class2'], ids: ['id1', 'id2']});
 * ```
 */
function grabLinks(
  root?: HTMLElement,
  skip?: { classes: string[]; ids: string[] }
): [HTMLElement, string][] {
  const tWalker = document.createTreeWalker(
    root ?? document.body,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        if (node.nodeType === 1 && skip) {
          const ele = node as HTMLElement;
          if (skip.ids.length > 0) {
            if (skip.ids.includes(ele.id)) {
              return NodeFilter.FILTER_REJECT;
            }
          }
          if (skip.classes) {
            for (const c of skip.classes) {
              if (ele.classList.contains(c)) {
                return NodeFilter.FILTER_REJECT;
              }
            }
          }
        }

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

export async function iLicon(opts: LiconOptions) {
  // const classes = opts?.classes ?? null;
  const root = opts?.root ?? document.body;
  const skipIDs = opts?.skipIDs ?? [];
  const skipClasses = opts?.skipClasses ?? [];
  const injectiLiconStyles = opts?.injectLiconStyles ?? true;
  const wrapperClass = opts?.wrapperClass ?? 'ilicon_wrapper';
  const imgClass = opts?.imgClass ?? 'ilicon_img';
  const setIcons = opts?.setIcons ?? undefined;
  const transformer = opts?.transformer ?? defaultTransformer;
  const position = opts?.position ?? 'start';
  const target = opts?.target ?? undefined;
  const skipObj =
    (opts?.skipIDs && skipIDs.length > 0) ||
    (opts?.skipClasses && skipClasses.length > 0)
      ? { ids: skipIDs, classes: skipClasses }
      : undefined;

  if (injectiLiconStyles) {
    injectStyles();
  }

  if (target) {
    const iconLinks = target.map((u) => toIconUrl(u));
    return iconLinks;
  }

  const links = grabLinks(root, skipObj);
  console.log(links);

  const iconLinks = links.map((info) => {
    const url = info[1];
    if (setIcons) {
      const urlObj = new URL(url);
      const { hostname } = urlObj;
      const found = setIcons.find((i) => i.domain === hostname);
      if (found) {
        return [info[0], found.icon] as const;
      }
    } else if (url.includes('google.com')) {
      if (url.includes('mail.google.com')) {
        return [info[0], staticGoogleIcons.google_mail] as const;
      }
      if (url.includes('docs.google.com/spreadsheets')) {
        return [info[0], staticGoogleIcons.google_sheets] as const;
      }
      if (url.includes('docs.google.com/document')) {
        return [info[0], staticGoogleIcons.google_docs] as const;
      }
      if (url.includes('docs.google.com/presentation')) {
        return [info[0], staticGoogleIcons.google_slides] as const;
      }
      if (url.includes('docs.google.com/forms')) {
        return [info[0], staticGoogleIcons.google_forms] as const;
      }
      if (url.includes('drive.google.com')) {
        return [info[0], staticGoogleIcons.google_drive] as const;
      }
      if (url.includes('maps.google.com')) {
        return [info[0], staticGoogleIcons.google_maps] as const;
      }
      if (url.includes('google.com/maps')) {
        return [info[0], staticGoogleIcons.google_custom_map] as const;
      }
    }
    const iconUrl = toIconUrl(info[1]);
    return [info[0], iconUrl] as const;
  });

  for (const [ele, url] of iconLinks) {
    transformer(ele, url, position, wrapperClass, imgClass);
  }
}
