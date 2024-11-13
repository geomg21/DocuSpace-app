import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import database from '../Database/FirebaseConfig';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
};

const Create = ({ onNoteAdded }) => {
    const [open, setOpen] = useState(false);
    const [note, setNote] = useState({ title: "", content: "" });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const value = collection(database, "notes");

    const handleAddContent = async () => {
        if (!note.title || !note.content) {
            setSnackbarMessage('Please fill in both title and content.');
            setOpenSnackbar(true);
            return;
        }

        try {
            await addDoc(value, note);
            setSnackbarMessage('Note added successfully!');
            setOpenSnackbar(true);
            handleClose();
            onNoteAdded();  // Callback to refresh the notes list
        } catch (error) {
            setSnackbarMessage('Error adding note.');
            setOpenSnackbar(true);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNote({ title: "", content: "" });
    };

    return (
        <>
            <div className="pt-32 p-5">
                <Button
                    onClick={handleOpen}
                    variant="contained"
                    color="primary"
                    className="float-end"
                    sx={{
                        backgroundColor: '#4CAF50',
                        '&:hover': { backgroundColor: '#45a049' },
                    }}
                >
                    <i className="fa-solid fa-file-circle-plus text-2xl"></i> Add Note
                </Button>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" gutterBottom>
                        Add New Note
                    </Typography>
                    <TextField
                        required
                        label="Title"
                        placeholder="Enter your Note Title"
                        fullWidth
                        value={note.title}
                        onChange={(e) => setNote({ ...note, title: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        required
                        label="Content"
                        placeholder="Enter your Note Content"
                        fullWidth
                        multiline
                        rows={4}
                        value={note.content}
                        onChange={(e) => setNote({ ...note, content: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={handleAddContent}
                        sx={{ mt: 2 }}
                    >
                        Add
                    </Button>
                </Box>
            </Modal>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </>
    );
};

export default Create;



