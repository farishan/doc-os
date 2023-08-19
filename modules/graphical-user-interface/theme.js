const darkTheme = {
  name: 'dark',
  backgroundColor: '#222222',
  borderWidth: 1, //px
  borderStyle: 'solid',
  style: {
    body: {
      backgroundColor: '#222222',
      color: '#ffffff',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    },
    button: {
      cursor: 'pointer',
    },
  }
}

const lightTheme = {
  name: 'light',
  backgroundColor: '#ffffff',
  borderWidth: 1, //px
  borderStyle: 'solid',
  style: {
    body: {
      backgroundColor: '#ffffff',
      color: '#222222',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    },
    button: {
      cursor: 'pointer',
    },
  }
}

export const themeMap = {
  dark: darkTheme,
  light: lightTheme
}
