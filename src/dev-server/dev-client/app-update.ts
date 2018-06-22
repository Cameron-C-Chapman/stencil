import  * as d from '../../declarations';
import { appError, clearDevServerModal } from './app-error';
import { hmrComponents } from './hmr-components';
import { hmrExternalStyles } from './hmr-external-styles';
import { hmrImages } from './hmr-images';
import { hmrInlineStyles } from './hmr-inline-styles';


export function appUpdate(ctx: d.DevServerClientContext, win: d.DevClientWindow, doc: Document, buildResults: d.BuildResults) {
  try {
    // remove any app errors that may already be showing
    clearDevServerModal(doc);

    if (buildResults.hasError) {
      // looks like we've got an error
      // let's show the error all pretty like
      appError(doc, buildResults);
      return;
    }

    if (ctx.isInitialDevServerLoad) {
      // this page is the initial dev server loading page
      // and the build has finished without errors
      // let's make sure the url is at the root
      // and we've unregistered any existing service workers
      // then let's refresh the page from the root of the server
      appReset(win).then(() => {
        win.location.reload(true);
      });
      return;
    }

    if (buildResults.hmr) {
      appHmr(win, doc, buildResults.hmr);
    }

  } catch (e) {
    console.error(e);
  }
}


function appHmr(win: Window, doc: Document, hmr: d.HotModuleReplacement) {
  // let's do some hot module replacement shall we
  if (hmr.windowReload) {
    win.location.reload(true);
    return;
  }

  if (hmr.componentsUpdated) {
    if (!supportsComponentHmr()) {
      win.location.reload(true);
      return;
    }

    hmrComponents(doc.documentElement, hmr.versionId, hmr.componentsUpdated);
  }

  if (hmr.inlineStylesUpdated) {
    hmrInlineStyles(doc.documentElement, hmr.versionId, hmr.inlineStylesUpdated);
  }

  if (hmr.externalStylesUpdated) {
    hmrExternalStyles(doc.documentElement, hmr.versionId, hmr.externalStylesUpdated);
  }

  if (hmr.imagesUpdated) {
    hmrImages(win, doc, hmr.versionId, hmr.imagesUpdated);
  }
}


export function appReset(win: d.DevClientWindow) {
  // we're probably at some ugly url
  // let's update the url to be the expect root url: /
  win.history.replaceState({}, 'App', '/');

  if (!win.navigator.serviceWorker) {
    return Promise.resolve();
  }

  // it's possible a service worker is already registered
  // for this localhost url from some other app's development
  // let's ensure we entirely remove the service worker for this domain
  return win.navigator.serviceWorker.getRegistration().then(swRegistration => {
    if (swRegistration) {
      return swRegistration.unregister().then(hasUnregistered => {
        if (hasUnregistered) {
          console.log(`unregistered service worker`);
        }
      });
    }
    return Promise.resolve();
  });
}


function supportsComponentHmr() {
  try {
    new Function('import("")');
    return true;
  } catch (e) {}
  return false;
}
