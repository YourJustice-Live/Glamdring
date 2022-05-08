export const components = {
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        WebkitFontSmoothing: 'auto',
      },
      body: {
        fontFamily: 'Manrope, monospace',
        letterSpacing: 'normal',
        color: 'text.primary',
      },
    },
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
};
