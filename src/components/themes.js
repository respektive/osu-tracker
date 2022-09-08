function getOsuPalette(hue) {
    const palette = {
        palette: {
            mode: "dark",
            background: {
              default: `hsl(${hue}, 10%, 15%)`,
              paper: `hsl(${hue}, 10%, 10%)`,
              header: `hsl(${hue}, 20%, 20%)`,
            },
            primary: {
                main: `hsl(${hue}, 100%, 70%)`,
                dark: `hsl(${hue}, 100%, 60%)`
            }
          },
          shape: {
            borderRadius: 5,
          },
          typography: {
            fontFamily: "Comfortaa",
          }
    }

    return palette;
}


const themes = {
    dark: {
        palette: {
            mode: "dark",
            background: {
              default: "#202020",
              header: "#272727"
            }
          },
          shape: {
            borderRadius: 5,
          },
          typography: {
            fontFamily: "Comfortaa",
          }
    },
    light: {
        palette: {
            background: {
              paper: "#efefef",
            }
          },
          shape: {
            borderRadius: 5,
          },
          typography: {
            fontFamily: "Comfortaa",
          }
    },
    osuPink: getOsuPalette(333),
    osuPurple: getOsuPalette(255),
    osuBlue: getOsuPalette(200),
    osuGreen: getOsuPalette(125),
    osuLime: getOsuPalette(90),
    osuOrange: getOsuPalette(45),
    osuRed: getOsuPalette(360),
    osuDarkOrange: getOsuPalette(20),
}

export default themes