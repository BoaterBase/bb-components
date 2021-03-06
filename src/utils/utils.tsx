import { h } from '@stencil/core';
import { HeadInterface } from 'stencil-head';

const imagePath = `https://res.cloudinary.com/boaterbase/`;

export function cdnAsset(info, format = undefined, transform = 't_small_thumbnail') {

  return `${imagePath}${info.resource_type}/upload/${transform}/${info.public_id}${format ? '.' + format : ''}`;
  //f_immutable_cache,c_scale,w_auto,dpr_auto,q_auto,fl_lossy,f_auto/c_limit,w_2000
}

export function formatCurrency(amount, currency = 'USD') {
  return (new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    useGrouping: true,
    minimumFractionDigits: 0
  })).format(amount);
}

export function formatNumber(amount) {
  return (new Intl.NumberFormat('en-US', {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumSignificantDigits: 2
  })).format(amount);
}

/* Remove junk from user entered text */
export function cleanText(text) {
  return text.replace(/[^a-zA-Z0-9\-\s]/g, '');
}

/*
  Mimimal markdown parser
*/
export function markdown(text) {
  let lines = text.trim().split(/[\r?\n|\r]/);
  let out = [];

  lines.forEach((line: string) => {
    if (line.replace(/\w/, '') == '') {
      //out.push(<br />);
    } else if (line.startsWith('## ')) {
      out.push(<h4>{line.slice(3)}</h4>)
    } else if (line.startsWith('# ')) {
      out.push(<h3>{line.slice(2)}</h3>)
    } else if (line.startsWith('- ')) {
      out.push(<li>{line.slice(2)}</li>)
    } else {
      out.push(<p>{line}</p>);
    }
  });
  return out; //text.split(/[\r?\n|\r]\s*[\r?\n|\r]/).map(p => <p>{p} </p>)
}

/*
  Meta Data
*/
export function buildMetaData(title: string, description: string, type = 'website', image?, canonicalRoot = 'https://www.boaterbase.com'): HeadInterface {
  const head: HeadInterface = {
    title,
    metas: [
      // Standard
      {
        name: 'description',
        content: description
      },
      // OpenGraph
      {
        property: 'og:url',
        // TODO - the path needs to be built from the resource not location as we need to work for # type links
        content: canonicalRoot + document.location.pathname
      },
      {
        property: 'og:type',
        content: type
      },
      {
        property: 'og:title',
        content: title
      },
      {
        property: 'og:description',
        content: description
      },
      //Facebook
      {
        property: 'fb:app-id',
        content: '486371204871561'
      },
      // Twitter
      {
        property: 'twitter:title',
        content: title
      },
      {
        property: 'twitter:description',
        content: description
      },
    ]
  };

  if (image) {
    head.metas.push({
      property: 'og:image',
      content: image
    }, {
      property: 'twitter:card',
      content: 'summary_large_image',
    }, {
      property: 'twitter:image',
      content: image
    })
  }

  return head;
}