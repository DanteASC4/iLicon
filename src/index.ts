type LiconOptions = {
  id?: string;
  classes?: string;
  target?: string[];
  fallback_icon?: string; // URL
};

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

const toIconUrl = (url: string, fallback = false) => {
  const urlObj = new URL(url);
  const { hostname } = urlObj;
  const iconUrl = fallback
    ? `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${hostname}&size=32
  `
    : `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
  return iconUrl;
};

async function checkLink(url: string, element?: HTMLElement) {
  const res = await fetch(url);

  if (!element) {
    return {
      url,
      ok: res.ok,
    };
  }
  return {
    url,
    ok: res.ok,
    element,
  };
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
  const id = opts?.id ?? null;
  const classes = opts?.classes ?? null;
  const target = opts?.target ?? null;
  const fallback_icon = opts?.fallback_icon ?? null;

  // const { id, classes, target, fallback_icon } = opts;

  if (target) {
    const linkChecks = target.map((url) => checkLink(url));
    const results = await Promise.all(linkChecks);
    const iconLinks: string[] = [];

    for (const { url, ok } of results) {
      if (ok) {
        const iconUrl = toIconUrl(url);
        iconLinks.push(iconUrl);
      } else {
        const iconUrl = toIconUrl(url, true);
        iconLinks.push(iconUrl);
      }
    }

    return iconLinks;
  }

  // Grab all links from page, replace insert adjacent html with icon
  const links = grabLinks();
  const linkChecks = links.map((info) => checkLink(info[1]));
  const results = await Promise.all(linkChecks);
  const fullInfo: [HTMLElement, string][] = [];

  for (const { url, ok, element } of results) {
    if (!element) {
      console.warn('No element found for url', url);
      continue;
    }
    if (ok) {
      const iconUrl = toIconUrl(url);
      fullInfo.push([element, iconUrl]);
    } else {
      const iconUrl = toIconUrl(url, true);
      fullInfo.push([element, iconUrl]);
    }
  }

  for (const [ele, href] of fullInfo) {
    const iconUrl = toIconUrl(href);
    const img = document.createElement('img');
    img.src = iconUrl;
    img.style.width = '1em';
    img.style.height = '1em';
    img.style.marginRight = '0.5em';
    img.style.verticalAlign = 'middle';
    ele.insertAdjacentElement('afterbegin', img);
  }
}

export default licon;
