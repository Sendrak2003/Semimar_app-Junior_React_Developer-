import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputLabel,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Seminar } from '../seminar';
import { useState, useRef, useEffect } from 'react';

function AddSeminar() {
  const [descLength, setDescLength] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seminarId = useRef<string>(''); 
  
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
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
    const idFromUrl = searchParams.get('id');

    if (idFromUrl) {
      seminarId.current = idFromUrl;
    } else {
      console.warn('No id parameter found in the URL');
      seminarId.current = 'default-id';
    }
  }, [searchParams]);

  const onSubmit = async (data: Seminar) => {
    try {
      const formattedDate = data.date ? data.date.split('-').reverse().join('.') : '';
      const seminarWithId = {
        id: seminarId.current,
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

      await axios.post(apiUrl, seminarWithId);

      alert('Семинар успешно добавлен!');
      reset();
      setDescLength(0);

      seminarId.current = generateNewId();

      navigate('/dashboard');
    } catch (error) {
      console.error('Ошибка при добавлении семинара:', error);
      alert('Ошибка при добавлении семинара.');
    }
  };
  
  const generateNewId = () => {
    let nextId = parseInt(localStorage.getItem('lastSeminarId') || '1', 10);
    nextId++;
    localStorage.setItem('lastSeminarId', nextId.toString());
    return nextId.toString();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          width: '100%',
          p: 4,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(255, 255, 255, 0.05)',
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Добавить семинар
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%' }}
        >
          <InputLabel sx={{ color: 'white', mt: 2 }}>
            Название семинара
          </InputLabel>

          <Controller
            name="title"
            control={control}
            rules={{ required: 'Название обязательно' }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="filled"
                fullWidth
                margin="dense"
                placeholder="Введите название"
                sx={{ input: { color: 'white' } }}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />

          <InputLabel sx={{ color: 'white', mt: 2 }}>
            Описание
          </InputLabel>

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
                  variant="filled"
                  fullWidth
                  multiline
                  rows={4}
                  margin="dense"
                  placeholder="Введите описание"
                  inputProps={{ style: { color: 'white' } }}
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
                  sx={{ color: descLength === 1000 ? 'red' : 'white', mt: 0.5 }}
                >
                  {descLength}/1000
                </Typography>
              </>
            )}
          />

          <InputLabel sx={{ color: 'white', mt: 2 }}>
            Дата
          </InputLabel>

          <Controller
            name="date"
            control={control}
            rules={{
              required: 'Дата обязательна',
              validate: (value) => value >= today || 'Дата не может быть в прошлом',
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                variant="filled"
                fullWidth
                margin="dense"
                sx={{ input: { color: 'white' } }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />

          <InputLabel sx={{ color: 'white', mt: 2 }}>
            Время
          </InputLabel>

          <Controller
            name="time"
            control={control}
            rules={{ required: 'Время обязательно' }}
            render={({ field }) => (
              <TextField
                {...field}
                type="time"
                variant="filled"
                fullWidth
                margin="dense"
                sx={{ input: { color: 'white' } }}
                error={!!errors.time}
                helperText={errors.time?.message}
              />
            )}
          />

          <InputLabel sx={{ color: 'white', mt: 2 }}>
            Ссылка на изображение
          </InputLabel>

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
                variant="filled"
                fullWidth
                margin="dense"
                placeholder="Введите URL изображения"
                sx={{ input: { color: 'white' } }}
                error={!!errors.photo}
                helperText={errors.photo?.message}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Добавить
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddSeminar;