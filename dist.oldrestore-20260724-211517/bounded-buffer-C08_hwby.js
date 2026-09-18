//#region src/shared/bounded-buffer.ts
var BoundedBuffer = class {
  constructor(capacity, overflow, measure = () => 1) {
    this.capacity = capacity;
    this.overflow = overflow;
    this.measure = measure;
    this.values = [];
    this.size = 0;
    this.closed = false;
  }
  push(value) {
    if (this.closed) return false;
    const valueSize = this.measure(value);
    if (this.size + valueSize <= this.capacity) {
      this.values.push(value);
      this.size += valueSize;
      return true;
    }
    if (this.overflow.mode === "latch") {
      this.closed = true;
      return false;
    }
    if (this.overflow.mode === "fail-closed") {
      this.values = [];
      this.size = 0;
      this.closed = true;
      this.overflow.onOverflow();
      return false;
    }
    this.values.push(value);
    this.size += valueSize;
    while (this.size > this.capacity && this.values.length > 1)
      this.size -= this.measure(this.values.shift());
    if (this.size > this.capacity) {
      const fitted = this.overflow.fit?.(value, this.capacity);
      this.values = fitted === void 0 ? [] : [fitted];
      this.size = fitted === void 0 ? 0 : this.measure(fitted);
    }
    return true;
  }
  drain() {
    const values = this.values;
    this.values = [];
    this.size = 0;
    return values;
  }
};
//#endregion
export { BoundedBuffer as t };
