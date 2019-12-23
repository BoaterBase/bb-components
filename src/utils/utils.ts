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
