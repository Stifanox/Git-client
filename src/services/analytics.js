import Hotjar from '@hotjar/browser';
import ReactGA from 'react-ga4';

let gaReady = false;
let hotjarReady = false;

export function initAnalytics() {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    const hotjarSiteId = import.meta.env.VITE_HOTJAR_SITE_ID;
    const hotjarVersion = Number(import.meta.env.VITE_HOTJAR_VERSION ?? 6);

    if (measurementId) {
        ReactGA.initialize(measurementId);
        gaReady = true;
    }

    if (hotjarSiteId) {
        const siteId = Number(hotjarSiteId);
        if (!Number.isNaN(siteId)) {
            hotjarReady = Hotjar.init(siteId, hotjarVersion);
        }
    }

    return { gaReady, hotjarReady };
}

export function trackPageView(path) {
    if (gaReady) {
        ReactGA.send({
            hitType: 'pageview',
            page: path,
        });
    }

    if (hotjarReady) {
        Hotjar.stateChange(path);
    }
}

export function isAnalyticsReady() {
    return gaReady || hotjarReady;
}
