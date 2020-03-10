import { startCase } from 'lodash';
import { createServer } from '../src/index';

createServer({
  getConfigHandler: req => {
    const paths = req.path().split('/');
    const packageServiceName = paths[1].split('.');
    const serviceName = packageServiceName.pop() || '';
    const packageName = packageServiceName.join('.');
    const methodName = startCase(paths[2])
      .split(' ')
      .join('');
    return { packageName, serviceName, methodName };
  },
  responseHandler: (res, data) => {
    res.json({ msg: 'ok', ret: 0, data });
  },
  hackMockTpl: (key, type, random) => {
    key = key.toLowerCase();
    const keyTypeHas = (k: string, t: string) =>
      type === t && key.indexOf(k) > -1;
    if (keyTypeHas('icon', 'string')) return '@image';
    else if (keyTypeHas('image', 'string')) return '@image';
    else if (keyTypeHas('url', 'string')) return '@url';
    else if (keyTypeHas('name', 'string')) return '@name';
    else if (keyTypeHas('title', 'string')) return '@title';
    else if (keyTypeHas('time', 'uint64'))
      return () => `${Math.ceil(+random.date('T') / 1000)}`;
    return '';
  },
}).then(({ start }) => start());
