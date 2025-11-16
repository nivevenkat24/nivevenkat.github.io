export default {
  content: [
    './public/**/*.{html,js}',
    './public/scripts/**/*.{js,mjs}',
    './scripts/**/*.{js,mjs}',
    './content/**/*.{txt,json}',
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
