import React, { useState } from 'react';
import { Checkbox, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface CheckListItemProps {
  id: string;
  text: string;
  isChecked: boolean;
  onSave: (id: string, text: string, isChecked: boolean) => void;
  onDelete: (id: string) => void;
}

const CheckListItem: React.FC<CheckListItemProps> = ({ 
  id, 
  text, 
  isChecked, 
  onSave, 
  onDelete 
}) => {
  const [itemText, setItemText] = useState(text);
  const [checked, setChecked] = useState(isChecked);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setItemText(e.target.value);
  };

  const handleTextSave = () => {
    onSave(id, itemText, checked);
  };

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    onSave(id, itemText, newChecked);
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: '8px', 
      width: '100%'
    }}>
      <Checkbox
        checked={checked}
        onChange={handleCheckChange}
        color="primary"
      />
      <TextField
        value={itemText}
        onChange={handleTextChange}
        onBlur={handleTextSave}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
            handleTextSave();
          }
        }}
        multiline
        fullWidth
        variant="standard"
        InputProps={{
          disableUnderline: true,
          style: { 
            fontSize: '1rem',
            padding: '4px 8px'
          }
        }}
      />
      <IconButton 
        onClick={() => onDelete(id)}
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default CheckListItem;
