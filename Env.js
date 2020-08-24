// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: terminal;
module.exports =  () => {
  return new(class {
    constructor() {
      this.request = new Request('')
      this.defaultHeaders = {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }

    async get(opts) {
      this.request.url = opts.url
      this.request.headers = {
        ...opts.headers,
        ...this.defaultHeaders
      }
      return await this.request.loadJSON()
    }

    async post(opts) {
      this.request.url = opts.url
      this.request.body = JSON.stringify(body)
      this.request.method = methods.post
      this.request.headers = {
        ...opts.headers,
        ...this.defaultHeaders
      }
      return await request.loadJSON()
    }
    
    async getStr(opts) {
      this.request.url = opts.url
      this.request.headers = {
        ...opts.headers,
        ...this.defaultHeaders
      }
      return await this.request.loadString()
    }
    
  })()
}