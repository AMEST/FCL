// @ts-nocheck
import React, { FC, useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Box, CircularProgress } from '@mui/material';
import { getCheckListById, updateCheckList, deleteCheckListItem, createCheckListItem, updateCheckListItem } from '../../utils/apiClient';
import { HubConnectionBuilder, HubConnection, HubConnectionState, HttpTransportType, LogLevel } from '@microsoft/signalr';
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
  const [checklistSnapShot, setChecklistSnapShot] = useState<Checklist | null>(null);
  const checkListSnapShotRef = useRef<Checklist | null>(null);
  const [newItemText, setNewItemText] = useState('');
  const { t } = useTranslation();
  const connectionRef = useRef<HubConnection>(null);

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
      connection.on('CheckListUpdates', async (checkListId: string, checkListItemId?: string) => {
        if (checkListId !== id) return;
        console.log(connectionRef.current);
        console.log(checkListSnapShotRef.current);
          // Update entire checklist
        const response = await getCheckListById(id)
        const data : Checklist = response.data;

        if(areCheckListsEqual(checkListSnapShotRef.current, data))
          return;

        setChecklist({id: data.id, title: `${data.title} `, items: []});
        updateCheckListSnapshot(data);
        setTimeout(() => setChecklist(data), 1);
      
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
        const response = await getCheckListById(id);
        setChecklist(response.data);
        updateCheckListSnapshot(response.data);
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

  const updateCheckListSnapshot = (list: Checklist) => {
    setChecklistSnapShot(list);
    checkListSnapShotRef.current = list;
  }

  const areCheckListsEqual = (a: Checklist | null, b: Checklist | null): boolean => {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.id !== b.id || a.title !== b.title) return false;
    if (a.items.length !== b.items.length) return false;
    
    return a.items.every((itemA, index) => {
      const itemB = b.items[index];
      return itemA.id === itemB.id && 
             itemA.text === itemB.text && 
             itemA.isChecked === itemB.isChecked;
    });
  };

  const handleTitleSave = async (newTitle: string) => {
    if (!checklist || checklistSnapShot.title === newTitle) return;
    
    try {
      await updateCheckList(id, { text: newTitle });
      setChecklist({ ...checklist, title: newTitle });
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleItemSave = async (itemId: string, text: string, isChecked: boolean) => {
    if (!checklist) return;
    
    const item = checklistSnapShot.items.find(i => i.id === itemId);
    if (item && item.text === text && item.isChecked === isChecked) return;
    
    try {
      await updateCheckListItem(id, itemId, { text, isChecked });
      if(connectionRef.current && connectionRef.current.state === HubConnectionState.Connected)
        return;
      // Refresh checklist state
      const response = await getCheckListById(id);
      setChecklist(response.data);
      updateCheckListSnapshot(response.data);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleItemDelete = async (itemId: string) => {
    if (!checklist) return;
    
    try {
      await deleteCheckListItem(id, itemId);
      if(connectionRef.current && connectionRef.current.state === HubConnectionState.Connected)
        return;      
      // Refresh checklist state
      const response = await getCheckListById(id);
      setChecklist(response.data);
      updateCheckListSnapshot(response.data);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCreateItem = async (e: React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!checklist || !newItemText.trim()) return;
    
    try {
      await createCheckListItem(id, { text: newItemText });
      setNewItemText('');
      if(connectionRef.current && connectionRef.current.state === HubConnectionState.Connected)
        return;
      // Refresh checklist state
      const response = await getCheckListById(id);
      setChecklist(response.data);
      updateCheckListSnapshot(response.data);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const navigate = useNavigate();

  if (!checklist) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
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
        paddingTop: { xs: '64px', md: '24px' }
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
