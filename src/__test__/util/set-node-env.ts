import { copyObject } from '../../model/util/copy-object';

type NodeEnvMode = 'development' | 'test' | 'production';

export function setNodeEnv(mode: NodeEnvMode) {
  const originalProcess = copyObject(process.env);
  process.env = {
    ...process.env,
    NODE_ENV: mode,
  };
  const reset = () => (process.env = originalProcess);
  return reset;
}
