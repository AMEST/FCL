// @ts-nocheck
import React, { FC, useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Box, Button } from '@mui/material';
import { HubConnectionBuilder, HubConnectionState, HttpTransportType, LogLevel } from '@microsoft/signalr';
import CheckListItem from './CheckListItem';

interface Checklist {
  id: string;
  title: string;
  items: {
    id: string;
    text: string;
    isChecked: boolean;
  }[];
}

const CheckList: FC = () => {
  const { id } = useParams();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [newItemText, setNewItemText] = useState('');
  const { t } = useTranslation();
  const connectionRef = useRef(null);

  useEffect(() => {
    // Initialize SignalR connection
    const initConnection = async () => {
      if(connectionRef.current !== null)
        return;
      const connection = new HubConnectionBuilder()
        .withUrl('/api/hubs/checklists', {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withKeepAliveInterval(15000)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connectionRef.current = connection;

      // Handle checklist updates
      connection.on('CheckListUpdates', (checkListId: string, checkListItemId?: string) => {
        if (checkListId !== id) return;
          // Update entire checklist
          fetch(`/api/checklist/${id}`)
            .then(res => res.json())
            .then(data => {
              setChecklist({id: data.id, title: `${data.title} `, items: []});
              setTimeout(() => setChecklist(data), 1);
            });
      });

      connection.onreconnected(connectionId => {
        connection.invoke('SubscribeToCheckList', id);
      });

      try {
        await connection.start();
        await connection.invoke('SubscribeToCheckList', id);
      } catch (error) {
        console.error('Error starting SignalR connection:', error);
      }
    };

    // Fetch checklist data and initialize connection
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/checklist/${id}`);
        const data = await response.json();
        setChecklist(data);
        await initConnection();
      } catch (error) {
        console.error('Error fetching checklist:', error);
      }
    };

    fetchData();

    // Cleanup on unmount or id change
    return () => {
      if (connectionRef.current?.state === HubConnectionState.Connected) {
        connectionRef.current.invoke('UnsubscribeFromCheckList', id)
          .catch(console.error);
        connectionRef.current.stop();
      }
    };
  }, [id]);

  const handleTitleSave = async (newTitle: string) => {
    if (!checklist) return;
    
    try {
      await fetch(`/api/checklist/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTitle }),
      });
      setChecklist({ ...checklist, title: newTitle });
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleItemSave = async (itemId: string, text: string, isChecked: boolean) => {
    if (!checklist) return;
    
    try {
      await fetch(`/api/checklist/${id}/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, isChecked }),
      });
      
      // Refresh checklist state
      const response = await fetch(`/api/checklist/${id}`);
      const data = await response.json();
      setChecklist(data);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleItemDelete = async (itemId: string) => {
    if (!checklist) return;
    
    try {
      await fetch(`/api/checklist/${id}/${itemId}`, {
        method: 'DELETE',
      });
      
      // Refresh checklist state
      const response = await fetch(`/api/checklist/${id}`);
      const data = await response.json();
      setChecklist(data);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCreateItem = async (e: React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!checklist || !newItemText.trim()) return;
    
    try {
      await fetch(`/api/checklist/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newItemText }),
      });
      
      // Refresh checklist state
      const response = await fetch(`/api/checklist/${id}`);
      const data = await response.json();
      setChecklist(data);
      setNewItemText('');
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const navigate = useNavigate();

  if (!checklist) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <Box
        component="span"
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          fontSize: '1.5rem',
          fontWeight: 300,
          color: 'text.secondary',
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8
          }
        }}
      >
        FCL
      </Box>
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
        paddingTop: { xs: '64px', sm: '24px' }
      }}
    >
      <TextField
        value={checklist.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setChecklist({ ...checklist, title: e.target.value })
        }
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => 
          handleTitleSave(e.target.value)
        }
        variant="standard"
        fullWidth
        InputProps={{
          disableUnderline: true,
          style: {
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '24px'
          }
        }}
      />

      {checklist.items.map(item => (
        <CheckListItem
          key={item.id}
          id={item.id}
          text={item.text}
          isChecked={item.isChecked}
          onSave={handleItemSave}
          onDelete={handleItemDelete}
        />
      ))}

      <Box sx={{ width: '100%', mt: 2 }}>
        <TextField
          value={newItemText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setNewItemText(e.target.value)
          }
          placeholder={t('checklist.addNewItem')}
          multiline
          fullWidth
          variant="standard"
          onKeyPress={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
              handleCreateItem(e);
            }
          }}
        />
      </Box>
    </Box>
    </React.Fragment>
  );
};

export default CheckList;
