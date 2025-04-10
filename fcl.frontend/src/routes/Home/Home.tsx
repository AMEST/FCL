// @ts-nocheck
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Container, Box, Button } from '@mui/material';
import { createCheckList } from '../../utils/apiClient';

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCreateChecklist = async () => {
    setIsLoading(true);
    try {
      const result = await createCheckList();
      navigate(`/list/${result.data.id}`);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters
      sx={{
        height: '100vh',
        //background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button 
          variant="contained"
          size="large"
          onClick={handleCreateChecklist}
          disabled={isLoading}
          sx={{
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            textTransform: 'none',
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark'
            }
          }}
        >
          {isLoading ? t('home.creatingButton') : t('home.createButton')}
        </Button>
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          gap: 2
        }}
      >
        <Button 
          onClick={() => i18n.changeLanguage('en')}
          sx={{
            minWidth: 'auto',
            p: 0,
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          🇺🇸
        </Button>
        <Button 
          onClick={() => i18n.changeLanguage('ru')}
          sx={{
            minWidth: 'auto',
            p: 0,
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          🇷🇺
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
