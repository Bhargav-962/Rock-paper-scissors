// Style objects for GameArea component
export const styles = {
  emptyStateCard: {
    maxWidth: 600, 
    mx: 'auto', 
    mt: 4,
    background: 'linear-gradient(145deg, #f5f5f5 0%, #e0e0e0 100%)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
  },
  emptyStateContent: {
    textAlign: 'center', 
    py: 6
  },
  emptyStateIcon: {
    fontSize: 64, 
    color: 'primary.main', 
    mb: 2
  },
  mainCard: {
    maxWidth: 700, 
    mx: 'auto', 
    mt: 2,
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
    borderRadius: 3
  },
  cardContent: {
    p: 4
  },
  headerStack: {
    width: '100%'
  },
  title: {
    fontWeight: 'bold', 
    color: 'primary.main'
  },
  rulesButton: {
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 500
  },
  choicesStack: {
    width: '100%'
  },
  progressContainer: {
    width: '100%', 
    maxWidth: 400
  },
  progressBar: {
    height: 8, 
    borderRadius: 4,
    backgroundColor: 'grey.200',
    '& .MuiLinearProgress-bar': {
      borderRadius: 4,
      background: 'linear-gradient(90deg, #4CAF50, #2196F3)'
    }
  },
  playerCard: {
    minWidth: 150, 
    textAlign: 'center'
  },
  myChoiceCard: {
    backgroundColor: 'primary.50',
    border: '2px solid',
    borderColor: 'primary.main'
  },
  oppChoiceCard: {
    backgroundColor: 'secondary.50',
    border: '2px solid',
    borderColor: 'secondary.main'
  },
  noChoiceCard: {
    backgroundColor: 'grey.50',
    border: '1px solid',
    borderColor: 'grey.300'
  },
  emojiText: {
    my: 1
  },
  resultText: {
    fontWeight: 'bold',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    mb: 1
  },
  playAgainButton: {
    borderRadius: 3,
    px: 4,
    py: 1.5,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1.1rem',
    background: 'linear-gradient(45deg, #4CAF50, #45a049)',
    '&:hover': {
      background: 'linear-gradient(45deg, #45a049, #4CAF50)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
    },
    transition: 'all 0.3s ease'
  },
  quitButton: {
    borderRadius: 3,
    px: 4,
    py: 1.5,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1.1rem',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(244, 67, 54, 0.3)'
    },
    transition: 'all 0.3s ease'
  }
};

export const getChoiceButtonStyle = (option, myChoice) => ({
  minWidth: 120,
  minHeight: 80,
  borderRadius: 3,
  flexDirection: 'column',
  gap: 1,
  fontSize: '1.2rem',
  textTransform: 'none',
  fontWeight: 600,
  backgroundColor: myChoice === option.name ? option.color : 'transparent',
  borderColor: option.color,
  color: myChoice === option.name ? 'white' : option.color,
  '&:hover': {
    backgroundColor: myChoice === option.name ? option.color : `${option.color}15`,
    transform: 'scale(1.05)',
    boxShadow: `0 6px 20px ${option.color}40`
  },
  transition: 'all 0.3s ease',
  '&:disabled': {
    backgroundColor: myChoice === option.name ? option.color : 'transparent',
    color: myChoice === option.name ? 'white' : option.color,
    opacity: myChoice === option.name ? 1 : 0.5
  }
});
