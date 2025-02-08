import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import { Seminar } from '../seminar';

interface SeminarDetailsDialogProps {
  open: boolean;
  seminar: Seminar | null;
  onClose: () => void;
  onEdit: () => void;
}

const SeminarDetailsDialog: React.FC<SeminarDetailsDialogProps> = ({
  open,
  seminar,
  onClose,
  onEdit,
}) => {
  if (!seminar) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <InfoIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Подробности о семинаре</div>
          <div>
            <Tooltip title="Редактировать">
              <IconButton color="primary" onClick={onEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <div>
          <p>
            <strong>Название:</strong> {seminar.title}
          </p>
          <p>
            <strong>Описание:</strong> {seminar.description}
          </p>
          <p>
            <strong>Дата:</strong> {seminar.date}
          </p>
          <p>
            <strong>Время:</strong> {seminar.time}
          </p>
          <img
            src={seminar.photo}
            alt="Фото семинара"
            style={{ width: '100%', height: 'auto', marginTop: '10px', maxWidth: '100%' }} // Добавили maxWidth
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SeminarDetailsDialog;