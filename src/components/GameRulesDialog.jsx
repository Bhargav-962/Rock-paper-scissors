import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  Divider,
  Box
} from '@mui/material';
import { GAME_OPTIONS } from '../constants';

const GameRulesDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h4" component="div" textAlign="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          🎮 How to Play
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={4} sx={{ py: 2 }}>
          <Stack direction="row" spacing={4} justifyContent="center">
            {GAME_OPTIONS.map((option) => (
              <Card key={option.name} sx={{ 
                textAlign: 'center', 
                minWidth: 120,
                border: '2px solid',
                borderColor: option.color,
                borderRadius: 3,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 6px 20px ${option.color}40`
                },
                transition: 'all 0.3s ease'
              }}>
                <CardContent>
                  <Typography variant="h2" sx={{ mb: 1 }}>{option.emoji}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: option.color, mb: 1 }}>
                    {option.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    beats {option.beats}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
          <Divider />
          <Box textAlign="center">
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                mb: 1 
              }}
            >
              🎯 Game Rules
            </Typography>
            <Typography 
              variant="body1" 
              textAlign="center" 
              sx={{ 
                color: 'text.secondary',
                lineHeight: 1.6
              }}
            >
              Choose your weapon and challenge other players! <br />
              Both players choose simultaneously, and the winner is determined by the classic rules above.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          size="large"
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameRulesDialog;
