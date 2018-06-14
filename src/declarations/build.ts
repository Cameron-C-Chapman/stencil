import * as d from './index';


export interface BuildCtx {
  aborted: boolean;
  appFileBuildCount: number;
  buildId: number;
  buildResults: d.BuildResults;
  timestamp: string;
  bundleBuildCount: number;
  collections: d.Collection[];
  components: string[];
  createTimeSpan(msg: string, debug?: boolean): d.LoggerTimeSpan;
  data: any;
  diagnostics: d.Diagnostic[];
  dirsAdded: string[];
  dirsDeleted: string[];
  entryModules: d.EntryModule[];
  entryPoints: d.EntryPoint[];
  externalStylesUpdated: string[];
  filesAdded: string[];
  filesChanged: string[];
  filesDeleted: string[];
  filesUpdated: string[];
  filesWritten: string[];
  finish(): Promise<BuildResults>;
  global: d.ModuleFile;
  graphData: GraphData;
  hasFinished: boolean;
  hasSlot: boolean;
  hasSvg: boolean;
  indexBuildCount: number;
  requiresFullBuild: boolean;
  shouldAbort(): boolean;
  startTime: number;
  stylesUpdated: { [styleId: string]: string };
  timeSpan: d.LoggerTimeSpan;
  transpileBuildCount: number;
  validateTypesHandler?: (diagnostics: d.Diagnostic[]) => void;
  validateTypesPromise?: Promise<d.Diagnostic[]>;
  validateTypesBuild?(): Promise<void>;
}


export type GraphData = Map<string, string[]>;


export interface BuildResults {
  aborted?: boolean;
  buildId: number;
  bundleBuildCount: number;
  components: BuildComponent[];
  diagnostics: d.Diagnostic[];
  dirsAdded: string[];
  dirsDeleted: string[];
  duration: number;
  entries: BuildEntry[];
  filesAdded: string[];
  filesChanged: string[];
  filesDeleted: string[];
  filesUpdated: string[];
  filesWritten: string[];
  hasError: boolean;
  hasSuccessfulBuild: boolean;
  hmr?: HotReplacement;
  isRebuild: boolean;
  transpileBuildCount: number;
}


export interface HotReplacement {
  componentsUpdated?: string[];
  externalStylesUpdated?: string[];
  stylesUpdated?: { [styleId: string]: string };
  windowReload?: boolean;
}


export interface BuildStats {
  compiler: {
    name: string;
    version: string;
  };
  app: {
    namespace: string;
    fsNamespace: string;
    components: number;
    entries: number;
    bundles: number;
  };
  options: {
    minifyJs: boolean;
    minifyCss: boolean;
    hashFileNames: boolean;
    hashedFileNameLength: number;
    buildEs5: boolean;
  };
  components: BuildComponent[];
  entries: BuildEntry[];
  sourceGraph: BuildSourceGraph;
  collections: {
    name: string;
    source: string;
    tags: string[];
  }[];
}


export interface BuildEntry {
  entryId: string;
  components: BuildComponent[];
  bundles: BuildBundle[];
  inputs: string[];
  modes?: string[];
  encapsulations: string[];
}


export interface BuildBundle {
  fileName: string;
  outputs: string[];
  size?: number;
  gzip?: number;
  mode?: string;
  scopedStyles?: boolean;
  target?: string;
}


export interface BuildSourceGraph {
  [filePath: string]: string[];
}


export interface BuildComponent {
  tag: string;
  dependencyOf?: string[];
  dependencies?: string[];
}


export interface FilesMap {
  [filePath: string]: string;
}


export type CompilerEventName = 'fileUpdate' | 'fileAdd' | 'fileDelete' | 'dirAdd' | 'dirDelete' | 'build' | 'rebuild';


export interface JSModuleList {
  [key: string]: { code: string };
}

export interface JSModuleMap {
  esm?: JSModuleList;
  es5?: JSModuleList;
  esmEs5?: JSModuleList;
}


export type SourceTarget = 'es5' | 'es2017';
