String.prototype.splitAfter = function (...needles) {
  for (let needle of needles) {
    let index = this.indexOf(needle);
    if (index > -1) {
      return this.substring(index + needle.length);
    }
  }

  return this;
}

String.prototype.splitUntil = function (...needles) {
  for (let needle of needles) {
    let index = this.indexOf(needle);
    if (index > -1) {
      return this.substring(0, index);
    }
  }

  return this;
}