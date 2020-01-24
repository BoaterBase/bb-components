import { h } from '@stencil/core';
import firebase from 'firebase/app';
import 'firebase/firestore';

export const fb = firebase.initializeApp({
  apiKey: "AIzaSyDkBS1qwcm0DT0vyMDea8DkLB-adsA8xzk",
  projectId: "boaterbase-v2",
  appId: "1:790141979706:web:3a818ed389e9773a45b903"
}, "boaterbase-v2");



const imagePath = `https://res.cloudinary.com/boaterbase/`;

export function cdnAsset(info, format = undefined, transform = 't_small_thumbnail') {

  return `${imagePath}${info.resource_type}/upload/${transform}/${info.public_id}${format ? '.' + format : ''}`;
  //f_immutable_cache,c_scale,w_auto,dpr_auto,q_auto,fl_lossy,f_auto/c_limit,w_2000
}

export function formatCurrency(amount, currency = 'USD') {
  return (new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
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