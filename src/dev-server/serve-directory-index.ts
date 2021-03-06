import * as d from '../declarations';
import { serve404, serve500 } from './serve-error';
import { serveFile } from './serve-file';
import * as http from 'http';
import * as path from 'path';
import * as url from 'url';


export async function serveDirectoryIndex(devServerConfig: d.DevServerConfig, fs: d.FileSystem, req: d.HttpRequest, res: http.ServerResponse) {
  try {
    const indexFilePath = path.join(req.filePath, 'index.html');

    req.stats = await fs.stat(indexFilePath);
    if (req.stats.isFile()) {
      req.filePath = indexFilePath;
      return serveFile(devServerConfig, fs, req, res);
    }

  } catch (e) {}

  if (!req.pathname.endsWith('/')) {
    res.writeHead(302, {
      'location': req.pathname + '/'
    });
    return res.end();
  }

  try {
    const dirItemNames = await fs.readdir(req.filePath);

    try {
      const dirTemplatePath = path.join(devServerConfig.devServerDir, 'templates', 'directory-index.html');
      const dirTemplate = await fs.readFile(dirTemplatePath);
      const files = await getFiles(fs, req.filePath, req.pathname, dirItemNames);

      const templateHtml = dirTemplate
        .replace('{{title}}', getTitle(req.pathname))
        .replace('{{nav}}', getName(req.pathname))
        .replace('{{files}}', files);

      res.writeHead(200, {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Expires': '0',
        'Content-Type': 'text/html',
        'X-Powered-By': 'Stencil Dev Server'
      });

      res.write(templateHtml);
      res.end();

    } catch (e) {
      serve500(res, e);
    }

  } catch (e) {
    serve404(devServerConfig, fs, req, res);
  }
}


async function getFiles(fs: d.FileSystem, filePath: string, urlPathName: string, dirItemNames: string[]) {
  const items = await getDirectoryItems(fs, filePath, urlPathName, dirItemNames);

  if (urlPathName !== '/') {
    items.unshift({
      isDirectory: true,
      pathname: '../',
      name: '..'
    });
  }

  return items
    .map(item => {
      return (`
        <li class="${item.isDirectory ? 'directory' : 'file'}">
          <a href="${item.pathname}">
            <span>${item.name}</span>
          </a>
        </li>`
      );
    })
    .join('');
}


async function getDirectoryItems(fs: d.FileSystem, filePath: string, urlPathName: string, dirItemNames: string[]) {
  return Promise.all(dirItemNames.map(async dirItemName => {
    const absPath = path.join(filePath, dirItemName);

    const stats = await fs.stat(absPath);

    const item: DirectoryItem = {
      name: dirItemName,
      pathname: url.resolve(urlPathName, dirItemName),
      isDirectory: stats.isDirectory()
    };

    return item;
  }));
}


function getTitle(pathName: string) {
  return pathName;
}


function getName(pathName: string) {
  const dirs = pathName.split('/');
  dirs.pop();

  let url = '';

  return dirs.map((dir, index) => {
    url += dir + '/';
    const text = (index === 0 ? `~` : dir);

    return `<a href="${url}">${text}</a>`;

  }).join('<span>/</span>') + '<span>/</span>';
}


interface DirectoryItem {
  name: string;
  pathname: string;
  isDirectory: boolean;
}
