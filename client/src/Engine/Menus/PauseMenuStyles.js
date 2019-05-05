// modal styling adapted from Modals tutorial
export default {
  '@global': {
    body: {
      overflow: 'hidden'
    }
  },

  // Modal wrapper
  modalOverlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: '9999',
    opacity: 1,
    animation: 'show .5s ease',
    overflowX: 'hidden',
    overflowY: 'auto'
  },

  // Fade in
  '@keyframes show': {
    '0%': {
      display: 'none',
      opacity: 0
    },
    '1%': {
      display: 'flex',
      opacity: 0
    },
    '100%': {
      opacity: 1
    }
  },

  // Modal itself
  modal: {
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: [0, 0, '0.625rem', 'rgba(0, 0, 0, 0.2)'],

    '@media (min-width: 576px)': {
      width: '32rem'
    }
  },

  modalContent: {
    backgroundColor: 'gray',
    padding: '6rem',
    alignItems: 'center'
  }
};
