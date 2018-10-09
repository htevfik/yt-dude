import { Parser } from "../crawler/parser";
import cheerio = require('cheerio');

function runExtractor(body: string) {
  return group(
    Array().concat(
      ...extract(body).map(data => {
        return walk(data);
      }).filter(Boolean)
    ).map(item => {
      return scalarData(item);
    })
  ).map(merge);
}

function merge(group) {
  const o = {};

  for (let item of group) {
    for (let [k, v] of entries(item)) {
      let a = o[k];

      if (!a) {
        o[k] = v;
      } else {
        if (a instanceof Array) {
          if (v instanceof Array) {
            o[k] = [...a, ...v];
          } else {
            o[k].push(v);
          }
        } else if (v) {
          o[k] = v;
        }
      }
    }
  }

  return o;
}

function scalarData(item) {
  let output = {};

  for (let [k, v] of entries(item)) {
    let dived = dive(k, v);

    if (dived == null) {
      continue;
    }

    if (typeof dived === 'object') {
      output = { ...output, ...dived };
    } else {
      output[k] = dived;
    }
  }

  return output;
}

function group(array) {
  const output = {};

  for (let item of array) {
    output[item.videoId] = output[item.videoId] || [];
    output[item.videoId].push(item);
  }

  return Object.keys(output).map(k => output[k]);
}

function unique(array, ...exclude) {
  return array.filter((e, i, a) => a.indexOf(e) === i && exclude.indexOf(e) === -1);
}

function dive(name, value) {
  if (!value) {
    return value;
  }

  switch (name) {
    case 'ownerBadges':
      value = value.find(badge => child(badge, 'metadataBadgeRenderer.style'));
      return { channelVerified: /_VERIFIED$/.test(value) };

    case 'thumbnailOverlays':
      let overlay = value.map(overlay => child(overlay, 'thumbnailOverlayTimeStatusRenderer.text')).filter(Boolean)[0];
      let { durationText, durationTextLong } = dive('durationText', overlay) || {} as any;

      if (durationText && durationTextLong) {
        return { duration: Parser.videoLength({ simpleText: durationText }), durationText, durationTextLong };
      }

      break;

    case 'richThumbnail':
      return dive(name, child(value, 'movingThumbnailRenderer.movingThumbnailDetails'));
    case 'thumbnailRenderer':
      return dive(name, child(value, 'playlistVideoThumbnailRenderer.thumbnail'));

    case 'shortBylineText':
      try {
        let
          channelUrl = child(value, 'runs.0.navigationEndpoint.commandMetadata.webCommandMetadata.url') || "",
          channelId = channelUrl.split(/\/+/).reverse().filter(Boolean)[0],
          channelName = runOver(value);

        if (channelId) {
          return { channelUrl, channelId, channelName };
        } else {
          console.log(JSON.stringify(value, null, 2));
        }
      } catch (err) { }
  }

  if (/string|number|boolean/.test(typeof value)) {
    return { [name]: value };
  } else if (value) {
    if (value.runs instanceof Array) {
      return { [name]: runOver(value) };
    }

    if (value.simpleText) {
      let _label = label(value);
      return {
        [name]: value.simpleText,
        ..._label ? { [name + 'Long']: _label } : {},
        .../count/i.test(name) ? { [name.replace(/text$/i, '')]: +value.simpleText.replace(/\D+/g, '') } : {}
      };
    }

    if (value.thumbnails instanceof Array) {
      let
        thumbnails = value.thumbnails.map(thumbnail => thumbnail.url),
        thumbnail = thumbnails[0] || null;

      thumbnails = unique(thumbnails, thumbnail);

      return thumbnails.length > 1 ? { [name + 's']: thumbnails, [name]: thumbnail } : { [name]: thumbnail };
    }

    if (value instanceof Array) {
      let simplified = value.map(item => {
        let keys = Object.keys(item);

        if (keys.length === 1) {
          let dived = dive(keys[0], item[keys[0]]);
          return entries(dived, true)[0];
        }
      }).filter(Boolean);
      simplified = unique(simplified);

      if (simplified.length > 0) {
        return { [name]: simplified }
      }
    }
  }
}

function runOver(runpack) {
  return runpack.runs.map(run => run.text).join(' ').replace(/\s+/g, ' ').trim();
}

function label(value) {
  return child(value.accessibility || value, 'accessibilityData.label');
}

function text(view) {
  return child(view, 'simpleText');
}

function walk(chunk) {
  const output = [];

  function inner(object) {
    for (let [k, v] of entries(object)) {
      if (typeof v == 'object') {
        if (
          hasKeys(v, ['videoId', 'thumbnail', 'title']) ||
          hasKeys(v, ['playlistId', 'thumbnail', 'title'])
        ) {
          output.push(v);
          continue;
        } else {
          inner(v);
        }
      }
    }
  }

  inner(chunk);

  return output;
}

// function walk(root, path?) {
//   const object = child(root, path);

//   if (hasKeys(object, ["videoId", "thumbnail", "title"])) {
//     return true;
//   }

//   for (let [k, v] of entries(object)) {
//     if (typeof v == 'object') {
//       let tmp = walk(root, (path || "") + (path ? "." : "") + k);

//       if (tmp) {
//         if (!path && tmp instanceof Array) {
//           tmp = tmp.map(removeBridge);
//         }

//         if (tmp === true && object instanceof Array) {
//           return object;
//         } else {
//           return tmp;
//         }
//       }
//     }
//   }

//   return null;
// }

function child(object, path, def = null) {
  if (!object || !path) return object || def;

  for (let step of String(path).split('.')) {
    if (object && object[step]) {
      object = object[step];
    } else {
      return def;
    }
  }

  return object || def;
}

function hasKeys(object, keys) {
  let objectKeys = Object.keys(object);
  keys = keys instanceof Array ? keys : String(keys).split(/\W+/);

  for (let key of keys) {
    if (objectKeys.indexOf(key) === -1) {
      return false;
    }
  }

  return true;
}

function entries(object, values = false) {
  return Object.keys(object || {}).map(k => values ? object[k] : [k, object[k]]);
}

// function removeBridge(object) {
//   for (let [, v] of entries(object)) {
//     if (typeof v == 'object') {
//       if (
//         hasKeys(v, ["videoId", "thumbnail", "title"])
//       ) {
//         return v;
//       } else {
//         return removeBridge(v);
//       }
//     }
//   }

//   return null;
// }

function extract(body) {
  const
    $ = cheerio.load(body),
    output = [];

  $('script').each((...args) => {
    const html = $(args[1]).html();
    locate(html).map(result => {
      if (typeof result == 'object') {
        output.push(result);
      }
    });
  });


  return output;
}

function locate(text) {
  if (text.indexOf('videoId') > -1 || text.indexOf('playlistId') > -1) {
    let
      active = false,
      escaping = false,
      start = 0,
      indent = 0,
      output = [];

    for (let i = text.indexOf('{'); i < text.length; i++) {
      let char = text[i];
      switch (char) {
        case '"':
          if (active) {
            if (escaping && text[i - 1] != '\\') {
              escaping = !escaping;
            }
          }
          break;
        case '{':
          if (!escaping) {
            indent++;

            if (indent == 1) {
              start = i;
              active = true;
            }
          }
          break;
        case '}':
          if (!escaping && active) {
            indent--;

            if (indent == 0) {
              let json = text.substring(start, i + 1),
                data;

              if (json != "{}") {
                try {
                  data = JSON.parse(json);
                  output.push(data);
                } catch (err) { }

                json = null;
                data = null;
              }


              active = false;
              escaping = false;
            }
          }
          break;
      }
    }
    return output;
  }

  return [];
}

export { runExtractor };