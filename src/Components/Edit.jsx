import React, { useState, useEffect } from 'react';
import { Box, Modal, Button, Snackbar, Alert } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import database from '../Database/FirebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
};

const Edit = ({ currentNote, onNoteUpdated }) => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState(currentNote?.content || "");
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => {
        setContent(currentNote?.content || "");
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleNoteSave = async () => {
        const noteDoc = doc(database, "notes", currentNote.id);
        const parser = new DOMParser();
        const plainText = parser.parseFromString(content, "text/html").body.textContent;

        try {
            await updateDoc(noteDoc, { content, plainText });
            setSnackbarMessage('Note updated successfully!');
            setOpenSnackbar(true);
            onNoteUpdated();
            handleClose();
        } catch (error) {
            setSnackbarMessage('Error updating note.');
            setOpenSnackbar(true);
        }
    };

    return (
        <div>
            {/* Edit Button, Show when note is selected */}
            <Button variant="outlined" color="primary" onClick={handleOpen} disabled={!currentNote}>
                Edit Note
            </Button>

            {/* Edit Note Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <h2 className="font-bold text-lg mb-2">{currentNote?.title || "Edit Note"}</h2>
                    <ReactQuill theme="snow" className="ql-editor" value={content} onChange={setContent} />
                    <button
                        className="mt-5 bg-blue-500 rounded px-5 py-1 text-lg font-bold text-white hover:bg-blue-600"
                        onClick={handleNoteSave}
                    >
                        Save
                    </button>
                </Box>
            </Modal>

            {/* Snackbar for feedback */}
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert severity={snackbarMessage.includes('Error') ? 'error' : 'success'}>{snackbarMessage}</Alert>
            </Snackbar>
        </div>
    );
};

export default Edit;
