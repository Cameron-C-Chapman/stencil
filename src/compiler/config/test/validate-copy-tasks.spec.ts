import { Config } from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { setProcessEnvironment, validateConfig } from '../validate-config';


describe('copy tasks', () => {

  it('should disable copy task with null', () => {
    config.copy = null;
    validateConfig(config);
    expect(config.copy).toBe(null);
  });

  it('should disable copy task with false', () => {
    (config.copy as any) = false;
    validateConfig(config);
    expect(config.copy).toBe(null);
  });

  it('should remove default copy task', () => {
    config.copy = {
      assets: null
    };
    validateConfig(config);
    expect(config.copy.assets).toBe(null);
    expect(config.copy.manifestJson.src).toBe('manifest.json');
  });

  it('should add copy task and keep defaults', () => {
    config.copy = {
      someTask: { src: 'some-dir' }
    };
    validateConfig(config);
    expect(config.copy.someTask.src).toBe('some-dir');
    expect(config.copy.assets.src).toBe('assets');
    expect(config.copy.manifestJson.src).toBe('manifest.json');
  });

  it('should override "assets" copy task default', () => {
    config.copy = {
      assets: { src: 'my-assets', dest: 'some-assets' }
    };
    validateConfig(config);
    expect(config.copy.assets.src).toBe('my-assets');
    expect(config.copy.assets.dest).toBe('some-assets');
  });

  it('should set "assets" copy task default', () => {
    validateConfig(config);
    expect(config.copy.assets.src).toBe('assets');
    expect(config.copy.assets.dest).toBeUndefined();
  });

  it('should override "manifestJson" copy task default', () => {
    config.copy = {
      manifestJson: { src: 'my-manifestJson', dest: 'some-manifestJson' }
    };
    validateConfig(config);
    expect(config.copy.manifestJson.src).toBe('my-manifestJson');
    expect(config.copy.manifestJson.dest).toBe('some-manifestJson');
  });

  it('should set "manifestJson" copy task default', () => {
    validateConfig(config);
    expect(config.copy.manifestJson.src).toBe('manifest.json');
    expect(config.copy.manifestJson.dest).toBeUndefined();
  });

  var config: Config;
  const sys = mockStencilSystem();
  const logger = mockLogger();

  beforeEach(() => {
    config = {
      sys: sys,
      logger: logger,
      rootDir: '/User/some/path/',
      suppressTypeScriptErrors: true
    };
  });

});
