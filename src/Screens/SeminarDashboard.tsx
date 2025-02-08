import { useState, useEffect } from 'react';
import {
  DataGrid,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddAltIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { Seminar } from '../seminar';
import '../App.css';
import SeminarDetailsDialog from '../components/SeminarDetailsDialog';
import EditSeminarModal from '../components/EditSeminarModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: '#b0bec5' },
  },
});

function SeminarDashboard() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [idCounter, setIdCounter] = useState<number>(1);

  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error("VITE_API_URL is not defined in the environment variables.");
  }
  

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Seminar[]>(apiUrl)
      .then((response) => {
        setSeminars(response.data);
        setLoading(false);
        const maxId = response.data.reduce((max, seminar) => Math.max(max, seminar.id), 0);
        setIdCounter(maxId + 1);
      })
      .catch((error) => {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      });
  }, [apiUrl]);

  const handleAddSeminar = () => {
    navigate(`/seminar/post?id=${idCounter}`);
  };

  const handleRowClick = (params: GridRowParams<Seminar>) => {
    setOpenEditDialog(false);
    setSelectedSeminar(params.row);
    setOpenDetailsDialog(true);
  };

  const handleOpenEditDialog = (seminar: Seminar) => {
    setOpenDetailsDialog(false);
    setSelectedSeminar(seminar);
    setOpenEditDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenDetailsDialog(false);
    setOpenEditDialog(false);
    setSelectedSeminar(null);
  };

  const handleSeminarUpdate = (updatedSeminar: Seminar) => {
    setSeminars((prevSeminars) =>
      prevSeminars.map((seminar) =>
        seminar.id === updatedSeminar.id ? updatedSeminar : seminar
      )
    );
    handleCloseDialogs();
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    const confirmDelete = window.confirm('Вы уверены, что хотите удалить выбранные семинары?');
    if (!confirmDelete) {
      setSelectedRows([]);
      return;
    }

    try {
      await Promise.all(
        selectedRows.map((id) => axios.delete(`${apiUrl}/${id}`))
      );

      setSeminars((prev) => prev.filter((seminar) => !selectedRows.includes(seminar.id)));
      setSelectedRows([]);
      alert('Семинар(ы) успешно удалены!');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении семинаров!');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'photo',
      headerName: 'Фото',
      width: 150,
      renderCell: (params: GridRenderCellParams<Seminar, string>) => (
        <img src={params.value} alt="Семинар" className="seminar-photo" loading="lazy" />
      ),
    },
    { field: 'title', headerName: 'Название', width: 200 },
    { field: 'description', headerName: 'Описание', width: 300 },
    { field: 'date', headerName: 'Дата', width: 150 },
    { field: 'time', headerName: 'Время', width: 100 },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="container">
        {loading ? (
          <div className="loading-container">
            <CircularProgress />
          </div>
        ) : (
          <DataGrid
            className="custom-data-grid"
            rows={seminars}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            onRowSelectionModelChange={(newSelection) =>
              setSelectedRows(newSelection as number[])
            }
            rowSelectionModel={selectedRows}
          />
        )}

        <Button
          variant="contained"
          color={selectedRows.length > 0 ? 'error' : 'primary'}
          sx={{
            position: 'fixed',
            bottom: 60,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: '50%',
            minWidth: 'unset',
            boxShadow: 3,
          }}
          onClick={selectedRows.length > 0 ? handleDelete : handleAddSeminar}
        >
          {selectedRows.length > 0 ? (
            <DeleteIcon fontSize="large" sx={{ color: '#fff' }} />
          ) : (
            <PersonAddAltIcon fontSize="large" sx={{ color: '#fafafa' }} />
          )}
        </Button>
      </div>

      {selectedSeminar && openDetailsDialog && (
        <SeminarDetailsDialog
          key={selectedSeminar.id}
          open={openDetailsDialog}
          seminar={selectedSeminar}
          onClose={handleCloseDialogs}
          onEdit={() => {
            if (selectedSeminar) {
              handleOpenEditDialog(selectedSeminar);
            }
          }}
        />
      )}

      {selectedSeminar && openEditDialog && (
        <EditSeminarModal
          key={selectedSeminar.id}
          open={openEditDialog}
          seminar={selectedSeminar}
          onClose={handleCloseDialogs}
          onUpdate={handleSeminarUpdate}
        />
      )}
    </ThemeProvider>
  );
}

export default SeminarDashboard;
