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
