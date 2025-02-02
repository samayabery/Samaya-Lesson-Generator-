const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Combine darkMode configurations
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,ts,tsx}", // Merge content paths
  ],
  theme: {
    extend: {
      // Keyframes
      keyframes: {
		moveHorizontal: {
			"0%": {
			  transform: "translateX(-50%) translateY(-10%)",
			},
			"50%": {
			  transform: "translateX(50%) translateY(10%)",
			},
			"100%": {
			  transform: "translateX(-50%) translateY(-10%)",
			},
		  },
		  moveInCircle: {
			"0%": {
			  transform: "rotate(0deg)",
			},
			"50%": {
			  transform: "rotate(180deg)",
			},
			"100%": {
			  transform: "rotate(360deg)",
			},
		  },
		  moveVertical: {
			"0%": {
			  transform: "translateY(-50%)",
			},
			"50%": {
			  transform: "translateY(50%)",
			},
			"100%": {
			  transform: "translateY(-50%)",
			},
		  },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        "scroll-animation": {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-100%)",
          },
        },
      },
      // Animations
      animation: {
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        "scroll-animation":
          "scroll-animation var(--animation-duration) linear infinite var(--animation-direction)",
		  first: "moveVertical 30s ease infinite",
		  second: "moveInCircle 20s reverse infinite",
		  third: "moveInCircle 40s linear infinite",
		  fourth: "moveHorizontal 40s ease infinite",
		  fifth: "moveInCircle 20s ease infinite",
      },
      // Border Radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Colors
      colors: {
        ...colors,
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
  ],
};

// Custom plugin function
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
