import mixin from 'lgutil/common/mixin'

export default function (body) {
  return mixin({
    get body () {
      return this._body || {}
    },

    get errmsg () {
      if (this._errors.length > 0) {
        return this._errors.map(m => m[0].toUpperCase() + m.slice(1)).join(', ') + ' is required.'
      }
    },

    validate () {
      const isRequired = val => val != null && val !== ""
      const arrayNotEmpty = val => Array.isArray(val) && val.length > 0

      this._errors = []
      this._body = body.reduce((ret, obj) => {
        const { field, validator } = obj
        const control = this.refs[field]
        if (control) {
          const val = control.value
          if (!validator.bind(this)(val)) this._errors.push(field)
          else ret[field] = val
        }

        return ret
      }, {})
    }
  })
}

export const isRequired = val => val != null && val !== ""
export const arrayNotEmpty = val => Array.isArray(val) && val.length > 0
