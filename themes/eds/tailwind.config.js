module.exports = {
  theme: {
    extend: {
      colors: {
        edsgreen: '#008A8B',
        edsdarkgreen: '#08505D',
        edsgray: '#F0EFEF',
        edsyellow: '#fbd236'

      },
      fontSize: {
        '7xl': '5.5rem',
        '9xl': '7rem'
      }
    },
    height: {
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      '1/1': '100%'
    }
  },
  variants: {},
  plugins: [
    function({ addVariant, e }) {
      addVariant('after', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`after${separator}${className}`)}:after`
        })
      })
    }
  ]
}
