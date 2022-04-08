export const components = {
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        WebkitFontSmoothing: 'auto',
      },
      body: {
        fontFamily: 'Manrope, monospace',
        letterSpacing: 'normal',
      },
    },
  },
  MuiButton: {
    variants: [
      {
        props: { variant: 'primary' },
        style: {
          borderRadius: '12px',
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
          borderRadius: '12px',
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
        props: { variant: 'text' },
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
