/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      jersey20: ['"Jersey 20 Charted", sans-serif'],
      sedanSC: ['"Sedan SC", serif'],
      protestRiotRegular: ['"Protest Riot", sans-serif'],
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
      addVariant("child-active", "&>*:active");
    },
  ],
};
