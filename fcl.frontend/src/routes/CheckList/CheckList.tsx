import React, { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TextField, Box, Button } from '@mui/material';
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

  useEffect(() => {
    // TODO: Fetch checklist data from API
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/checklist/${id}`);
        const data = await response.json();
        setChecklist(data);
      } catch (error) {
        console.error('Error fetching checklist:', error);
      }
    };

    fetchData();
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

  if (!checklist) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px'
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
          placeholder="Add new item..."
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
  );
};

export default CheckList;
