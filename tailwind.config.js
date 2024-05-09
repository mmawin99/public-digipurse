/** @type {import('tailwindcss').Config} */

const { m } = require('framer-motion')
const { fontFamily } = require('tailwindcss/defaultTheme')



module.exports = {
  content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",  
  ],
  darkMode: "class",
  theme: {
    extend: {
      dropShadow: {
        'radialProcess': '2px 4px 6px #ffffff'
      },
      flex:{
        '1_1':"1 1",
      },
      boxShadow:{
        'bottomNav':'-1px 2px 76px 6px rgba(0,0,0,0.66);',
        'bottomNavDark':'-1px 2px 76px 6px rgba(255,255,255,0.66);',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100':'100',
        '110':'110',
        '120':'120',
        '130':'130'
      },
      fontFamily:{
        mont:[ "Montserrat", "Roboto", "Noto Sans Thai", ...fontFamily.sans],
        dmsans:[ "Montserrat", "Roboto", "Noto Sans Thai", ...fontFamily.sans]
      },
      height:{
        income_expense:"calc(100vh - 98px)",
        index_track:"calc(100vh - 150px)",
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        '16': 'repeat(16, 1fr)',
        '24': 'repeat(24, 1fr)',
        '25': 'repeat(25, 1fr)',
        '30': 'repeat(30, 1fr)',
        'appGlass': '11rem auto 20rem',
        'appGlassSemiExtraLarge': '10% 50% auto',
        'appGlassMedium': '1fr',
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
        'span-25': 'span 25 / span 25',
        'span-26': 'span 26 / span 26',
        'span-27': 'span 27 / span 27',
        'span-28': 'span 28 / span 28',
        'span-29': 'span 29 / span 29',
        'span-30': 'span 30 / span 30',
        'span-31': 'span 31 / span 31',
        'span-32': 'span 32 / span 32',
      },
      colors: {
        blackDashboard:"#242d49",
        orangeDashboard:"#fca61f",
        grayDashboard: "#788097",
        pinkDashboard: "#ffb6de",
        purpleDashboard: "#BB67FF",
        larvenderDashboard: "#e689e1",
        glassDashboard: "rgba(255, 255, 255, 0.54)",
        activeItemDashboard: "#f799a354",
        firstColor: {
          100: "#d7dde0",
          200: "#aebbc1",
          300: "#8698a2",
          400: "#5d7683",
          500: "#355464",
          600: "#2a4350",
          700: "#20323c",
          800: "#152228",
          900: "#0b1114"
        },
        firstColorAlt: {
          100: "#fbcdd5",
          200: "#f69caa",
          300: "#f26a80",
          400: "#ed3955",
          500: "#e9072b",
          600: "#ba0622",
          700: "#8c041a",
          800: "#5d0311",
          900: "#2f0109"
},
        firstColorDark: {
          100: "#ccd0d4",
          200: "#99a2a9",
          300: "#66737e",
          400: "#334553",
          500: "#001628",
          600: "#001220",
          700: "#000d18",
          800: "#000910",
          900: "#000408"
        },
        firstColorLight: {
          100: "#e1ecf1",
          200: "#c3dae3",
          300: "#a4c7d5",
          400: "#86b5c7",
          500: "#68a2b9",
          600: "#538294",
          700: "#3e616f",
          800: "#2a414a",
          900: "#152025"
        },
        golden: {
          100: "#fdf2cd",
          200: "#fbe59a",
          300: "#f9d968",
          400: "#f7cc35",
          500: "#f5bf03",
          600: "#c49902",
          700: "#937302",
          800: "#624c01",
          900: "#312601"
        },
      },
      animation:{
        'spin-slow': 'spin 8s linear infinite',
        'blink': 'blinker 1s linear infinite'
      },
      backgroundImage: {
        imageBackgroundPrimary: "url('/background.jpg')",
        gradientL: "linear-gradient(90deg, #f2b705 0%, #c4c4c4 100%);",
        appDashboard: "linear-gradient(106.37deg, #ddc2a1 29.63%,#ce8b8d 51.55%,#e689e1 90.85%)",
        appDashboardDark: "linear-gradient(106deg, rgba(34,61,94,1) 29.63%, rgba(30,77,75,1) 51.55%, rgba(25,118,30,1) 90.85%);",
        yellowDashboardBG: "linear-gradient(180deg, #F8D49A -146.42%, #FAD79D -46.42%);",
        purpleDashboardBG: "linear-gradient(180deg, #BB67FF 0%, #C484F3 100%);"
      
      },
    },
    screens: {
      "4xl":{max : "2348px"},
      "3xl": {max: "1920px"},
      "Extra2xl": { max: "1700px" },
      "2xl": { max: "1535px" },
      "ExtraXL": { max: "1440px" },
      "BeforeExtraXL": { max: "1400px" },
      "AfterXL": { max: "1330px" },
      "BeforeAfterXL": { max: "1300px" },
      xl: { max: "1279px" },
      semiExtraLarge:{max:"1200px"},
      afterLarge:{max:"1100px"},
      lg: { max: "1023px" },
      afterSemiLarge: { max: "980px" },
      beforeAfterSemiLarge: { max: "966px" },
      semiLarge: { max: "924px" },
      AfterExtraMedium: { max: "900px" },
      ExtraMedium: { max: "850px" },
      BeforeExtraMedium: { max: "800px" },
      md: { max: "768px" },
      afterSmall: { max: "700px" },
      sm: { max: "639px" },
      "beforeSM": {max: "621px"},
      "afterAfterMS": {max: "600px"},
      "afterMS": { max: "550px" },
      "beforeAfterMS": { max: "530px" },
      "ms": { max: "510px" },
      xs: { max: "479px" },
      sxs: { max: "440px" },
      "2xs": { max: "400px" },
      "3xs": { max: "379px" }
    }
  },
  plugins: [
    require('tailwindcss-patterns'),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      "pastel",
      "forest",
      {
        "digipurse_darktheme" : {
          "primary": "#fce7f3",
          "secondary": "#fbcfe8",
          "accent": "#f9a8d4",
          "neutral": "#ec4899",
          "base-100": "#111827",
          "info": "#ffe4e6",
          "success": "#9ddd94",
          "warning": "#fda4af",
          "error": "#ff5861",
        },
      },
    ], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "daisy", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
}

