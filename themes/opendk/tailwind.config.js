const { spacing } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      spacing: {
        gutter: spacing[6]
      }
    },
    colors: {
      primary: '#4E4E4F',
      secondary: '#EF4123',
      white: '#fff',
      'white-75': 'rgba(255,255,255,0.75)',
      gray: {
        '100': '#F8F8F8',
        '200': '#F1F2F2',
        '500': '#6D6E71',
        '900': '#4E4E4F',
      }
    },
    fontFamily: {
      'sans': ['Poppins', 'sans-serif']
    }
  }
}
