import { BuildCtx, CompilerCtx, Config, HydrateOptions, HydrateResults, OutputTarget, PrerenderLocation } from '../../declarations';
import { catchError } from '../util';
import { Renderer } from '../../server/index';


export async function prerenderPath(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, outputTarget: OutputTarget, indexSrcHtml: string, prerenderLocation: PrerenderLocation) {
  const msg = outputTarget.prerender.hydrateComponents ? 'prerender' : 'optimize html';
  const timeSpan = config.logger.createTimeSpan(`${msg}, started: ${prerenderLocation.path}`);

  const results: HydrateResults = {
    diagnostics: []
  };

  try {
    // create the renderer config
    const rendererConfig = Object.assign({}, config);

    // create the hydrate options from the prerender config
    const hydrateOpts: HydrateOptions = Object.assign({}, outputTarget.prerender) as HydrateOptions;
    hydrateOpts.url = prerenderLocation.url;
    hydrateOpts.isPrerender = true;

    // set the input html which we just read from the src index html file
    hydrateOpts.html = indexSrcHtml;

    // create a server-side renderer
    const renderer = new Renderer(rendererConfig, null, compilerCtx);

    // parse the html to dom nodes, hydrate the components, then
    // serialize the hydrated dom nodes back to into html
    const hydratedResults = await renderer.hydrate(hydrateOpts);

    // hydrating to string is done!!
    // let's use this updated html for the index content now
    Object.assign(results, hydratedResults);

  } catch (e) {
    // ahh man! what happened!
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`${msg}, finished: ${prerenderLocation.path}`);

  return results;
}
