module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      backgroundOpacity: ['dark'],
      backgroundImage: theme => ({
        'clouds': "url(/img/pexels-eberhard-grossgasteiger-844297.jpg)"
      }),
      zIndex: {
        '-10': '-10'
      }
    },
  },
  variants: {
    extend: {
      backgroundOpacity: ['dark']
    },
  },
  plugins: [],
}
