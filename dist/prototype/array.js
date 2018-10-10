Object.defineProperties(Array.prototype, {
    first: {
        get: function () {
            return this[0];
        }
    },
    last: {
        get: function () {
            return this[this.length - 1];
        }
    },
    firstValid: {
        get: function () {
            let i = -1;
            while (++i < this.length && !this[i])
                ;
            return this[i];
        }
    },
    lastValid: {
        get: function () {
            let i = this.length;
            while (--i > 0 && !this[i])
                ;
            return this[i];
        }
    }
});
Array.prototype.unique = function (...filter) {
    return this.filter((e, i, a) => {
        return a.indexOf(e) === i && filter.indexOf(e) === -1;
    });
};
//# sourceMappingURL=array.js.map