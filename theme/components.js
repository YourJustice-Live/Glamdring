export const components = {
  MuiCssBaseline: {
    styleOverrides: `
      /* manrope-200 - latin */
      @font-face {
        font-family: 'Manrope';
        font-style: normal;
        font-weight: 200;
        src: url('../fonts/manrope-v12-latin-200.eot'); /* IE9 Compat Modes */
        src: local(''),
            url('../fonts/manrope-v12-latin-200.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
            url('../fonts/manrope-v12-latin-200.woff2') format('woff2'), /* Super Modern Browsers */
            url('../fonts/manrope-v12-latin-200.woff') format('woff'), /* Modern Browsers */
            url('../fonts/manrope-v12-latin-200.ttf') format('truetype'), /* Safari, Android, iOS */
            url('../fonts/manrope-v12-latin-200.svg#Manrope') format('svg'); /* Legacy iOS */
      }
      /* manrope-300 - latin */
      @font-face {
        font-family: 'Manrope';
        font-style: normal;
        font-weight: 300;
        src: url('../fonts/manrope-v12-latin-300.eot'); /* IE9 Compat Modes */
        src: local(''),
            url('../fonts/manrope-v12-latin-300.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
            url('../fonts/manrope-v12-latin-300.woff2') format('woff2'), /* Super Modern Browsers */
            url('../fonts/manrope-v12-latin-300.woff') format('woff'), /* Modern Browsers */
            url('../fonts/manrope-v12-latin-300.ttf') format('truetype'), /* Safari, Android, iOS */
            url('../fonts/manrope-v12-latin-300.svg#Manrope') format('svg'); /* Legacy iOS */
      }
      /* manrope-regular - latin */
      @font-face {
        font-family: 'Manrope';
        font-style: normal;
        font-weight: 400;
        src: url('../fonts/manrope-v12-latin-regular.eot'); /* IE9 Compat Modes */
        src: local(''),
            url('../fonts/manrope-v12-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
            url('../fonts/manrope-v12-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
            url('../fonts/manrope-v12-latin-regular.woff') format('woff'), /* Modern Browsers */
            url('../fonts/manrope-v12-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
            url('../fonts/manrope-v12-latin-regular.svg#Manrope') format('svg'); /* Legacy iOS */
      }
      /* manrope-500 - latin */
      @font-face {
        font-family: 'Manrope';
        font-style: normal;
        font-weight: 500;
        src: url('../fonts/manrope-v12-latin-500.eot'); /* IE9 Compat Modes */
        src: local(''),
            url('../fonts/manrope-v12-latin-500.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
            url('../fonts/manrope-v12-latin-500.woff2') format('woff2'), /* Super Modern Browsers */
            url('../fonts/manrope-v12-latin-500.woff') format('woff'), /* Modern Browsers */
            url('../fonts/manrope-v12-latin-500.ttf') format('truetype'), /* Safari, Android, iOS */
            url('../fonts/manrope-v12-latin-500.svg#Manrope') format('svg'); /* Legacy iOS */
      }
      /* manrope-600 - latin */
      @font-face {
        font-family: 'Manrope';
        font-style: normal;
        font-weight: 600;
        src: url('../fonts/manrope-v12-latin-600.eot'); /* IE9 Compat Modes */
        src: local(''),
            url('../fonts/manrope-v12-latin-600.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
            url('../fonts/manrope-v12-latin-600.woff2') format('woff2'), /* Super Modern Browsers */
            url('../fonts/manrope-v12-latin-600.woff') format('woff'), /* Modern Browsers */
            url('../fonts/manrope-v12-latin-600.ttf') format('truetype'), /* Safari, Android, iOS */
            url('../fonts/manrope-v12-latin-600.svg#Manrope') format('svg'); /* Legacy iOS */
      }
      /* manrope-700 - latin */
      @font-face {
        font-family: 'Manrope';
        font-style: normal;
        font-weight: 700;
        src: url('../fonts/manrope-v12-latin-700.eot'); /* IE9 Compat Modes */
        src: local(''),
            url('../fonts/manrope-v12-latin-700.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
            url('../fonts/manrope-v12-latin-700.woff2') format('woff2'), /* Super Modern Browsers */
            url('../fonts/manrope-v12-latin-700.woff') format('woff'), /* Modern Browsers */
            url('../fonts/manrope-v12-latin-700.ttf') format('truetype'), /* Safari, Android, iOS */
            url('../fonts/manrope-v12-latin-700.svg#Manrope') format('svg'); /* Legacy iOS */
      }
      /* manrope-800 - latin */
      @font-face {
        font-family: 'Manrope';
        font-style: normal;
        font-weight: 800;
        src: url('../fonts/manrope-v12-latin-800.eot'); /* IE9 Compat Modes */
        src: local(''),
            url('../fonts/manrope-v12-latin-800.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
            url('../fonts/manrope-v12-latin-800.woff2') format('woff2'), /* Super Modern Browsers */
            url('../fonts/manrope-v12-latin-800.woff') format('woff'), /* Modern Browsers */
            url('../fonts/manrope-v12-latin-800.ttf') format('truetype'), /* Safari, Android, iOS */
            url('../fonts/manrope-v12-latin-800.svg#Manrope') format('svg'); /* Legacy iOS */
      }
    `,
  },
  MuiPaper: {
    styleOverrides: {
      rounded: {
        borderRadius: '22px',
      },
      elevation: {
        boxShadow: '0px 6px 18px rgba(118, 139, 160, 0.24)',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'initial',
        fontSize: '1em',
        borderRadius: '12px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
    variants: [
      {
        props: { variant: 'primary' },
        style: {
          color: '#FFFFFF',
          background: '#AD9BF5',
          '& .MuiButton-startIcon svg path': {
            stroke: '#FFFFFF',
          },
          '&:hover': {
            background: '#A163F8',
          },
          '&:active': {
            backgroundColor: '#5E42CC',
          },
        },
      },
      {
        props: { variant: 'secondary' },
        style: {
          textTransform: 'none',
          color: '#5E42CC',
          backgroundColor: 'rgba(173, 155, 245, 0.08)',
          '&:hover': {
            color: '#A163F8',
            '& .MuiButton-startIcon svg path': {
              stroke: '#A163F8',
            },
          },
          '&:active': {
            backgroundColor: '#5E42CC',
            color: '#FFFFFF',
            '& .MuiButton-startIcon svg path': {
              stroke: '#FFFFFF',
            },
          },
        },
      },
      {
        props: { variant: 'ghost' },
        style: {
          color: '#5E42CC',
          '&:hover': {
            color: '#A163F8',
            background: 'none',
          },
          '&:active': {
            color: '#fff',
            backgroundColor: '#5E42CC',
          },
        },
      },
    ],
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'initial',
      },
    },
  },
};
