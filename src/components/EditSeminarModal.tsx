import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Seminar } from '../seminar';
import axios from 'axios';

interface EditSeminarModalProps {
  open: boolean;
  onClose: () => void;
  seminar: Seminar | null;
  onUpdate: (seminar: Seminar) => void;
}

const EditSeminarModal: React.FC<EditSeminarModalProps> = ({
  open,
  onClose,
  seminar,
  onUpdate,
}) => {
  const [descLength, setDescLength] = useState(0);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Seminar>({
    defaultValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      photo: '',
    },
  });

  useEffect(() => {
    if (seminar) {
      const formattedDate = seminar.date.includes('.') 
        ? seminar.date.split('.').reverse().join('-') 
        : seminar.date;
  
      Object.keys(seminar).forEach((key) => {
        if (key === 'date') {
          setValue(key as keyof Seminar, formattedDate);
        } else {
          setValue(key as keyof Seminar, seminar[key as keyof Seminar]);
        }
      });
  
      setDescLength(seminar.description.length);
    }
  }, [seminar, setValue]);
  
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data: Seminar) => {
    try {
      if (!seminar) {
        console.error('Seminar is null, cannot update.');
        return;
      }

      const formattedDate = data.date.split('-').reverse().join('.');

      const updatedSeminar = {
        id: seminar.id,
        title: data.title,
        description: data.description,
        date: formattedDate,
        time: data.time,
        photo: data.photo,
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error("VITE_API_URL is not defined in the environment variables.");
      }

      await axios.put(`${apiUrl}/${seminar.id}`, updatedSeminar);

      onUpdate(updatedSeminar);
      onClose();
      reset();
    } catch (error) {
      console.error('Ошибка при обновлении семинара:', error);
      alert('Ошибка при обновлении семинара.');
    }
  };

  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Редактировать семинар</DialogTitle>
      <DialogContent>
        {seminar && (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <InputLabel sx={{ mt: 2 }}>Название семинара</InputLabel>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Название обязательно' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  placeholder="Введите название"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <InputLabel sx={{ mt: 2 }}>Описание</InputLabel>
            <Controller
              name="description"
              control={control}
              rules={{
                required: 'Описание обязательно',
                maxLength: {
                  value: 1000,
                  message: 'Описание не должно превышать 1000 символов',
                },
              }}
              render={({ field }) => (
                <>
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    margin="dense"
                    placeholder="Введите описание"
                    onChange={(e) => {
                      setDescLength(e.target.value.length);
                      field.onChange(e);
                    }}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                  <Typography
                    variant="body2"
                    align="right"
                    sx={{ color: descLength === 1000 ? 'red' : 'textSecondary', mt: 0.5 }}
                  >
                    {descLength}/1000
                  </Typography>
                </>
              )}
            />

            <InputLabel sx={{ mt: 2 }}>Дата</InputLabel>
            <Controller
              name="date"
              control={control}
              rules={{
                required: 'Дата обязательна',
                validate: (value) => {
                  if (!seminar || seminar.date.split('.').reverse().join('-') === value) {
                    return true; // Если дата не изменилась, пропустить проверку
                  }
                  return value >= today || 'Дата не может быть в прошлом';
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              )}
            />

            <InputLabel sx={{ mt: 2 }}>Время</InputLabel>
            <Controller
              name="time"
              control={control}
              rules={{ required: 'Время обязательно' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="time"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  error={!!errors.time}
                  helperText={errors.time?.message}
                />
              )}
            />

            <InputLabel sx={{ mt: 2 }}>Ссылка на изображение</InputLabel>
            <Controller
              name="photo"
              control={control}
              rules={{
                required: 'Ссылка на изображение обязательна',
                pattern: {
                  value: /^(https?:\/\/[^\s]+)$/i,
                  message: 'Введите корректную ссылку, начинающуюся с http:// или https://',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  placeholder="Введите URL изображения"
                  error={!!errors.photo}
                  helperText={errors.photo?.message}
                />
              )}
            />
            <DialogActions>
              <Button onClick={onClose}>Отмена</Button>
              <Button type="submit" variant="contained" color="primary">
                Сохранить
              </Button>
            </DialogActions>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditSeminarModal;