Object.entries = function (object: any) {
  return Object.keys({ ...object }).map(key => [key, object[key]]) as any;
}

Object.hasKeys = function (object: any, ...keys: string[]) {
  const objectKeys = Object.keys(object);

  keys = [].concat(...keys);

  for (let key of keys) {
    if (objectKeys.indexOf(key) === -1) {
      return false;
    }
  }

  return true;
}

Object.child = function (object: any, ...path: string[]) {
  if (!object || !path.length) {
    return object;
  }

  path = [].concat(...path.map(step => step.split('.')));

  for (let i = 0; object && i < path.length; i++) {
    object = object[path[i]];
  }

  return object !== void 0 ? object : null;
}

Object.walk = function (object: any, callback: (value: any, key: string, parent: any) => void) {
  for (let i in object) {
    callback(object[i], i, object);

    if (object && typeof object[i] == 'object') {
      Object.walk(object[i], callback);
    }
  }
}

Object.values = function (object) {
  return Object.keys(object || {}).map(key => object[key]);
}