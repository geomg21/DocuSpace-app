import React, { useState, useEffect } from 'react';
import { Box, Modal, Button, Snackbar, Alert, TextField, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import database from '../Database/FirebaseConfig';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

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

const View = () => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date'); // Sort by date by default

    // Fetch Notes from Firebase
    const fetchCollectionData = async () => {
        setLoading(true);
        const collectionRef = collection(database, 'notes');
        try {
            const snapshot = await getDocs(collectionRef);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotes(data);
        } catch (error) {
            setSnackbarMessage('Error fetching notes.');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollectionData();
    }, []);

    // Filter Notes by search query (title and content)
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.plainText && note.plainText.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sort Notes based on the selected option
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        } else if (sortBy === 'date') {
            return b.timestamp - a.timestamp; // Assuming timestamp exists
        }
        return 0;
    });

    // Open Edit Modal
    const handleOpen = (note) => {
        setCurrentNote(note);
        setContent(note.content || "");
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    // Save Changes to a Note
    const handleNoteSave = async () => {
        if (currentNote) {
            const noteDoc = doc(database, "notes", currentNote.id);
            try {
                await updateDoc(noteDoc, { content });
                setSnackbarMessage('Note updated successfully!');
                fetchCollectionData();
                handleClose();
            } catch (error) {
                setSnackbarMessage('Error updating note.');
            }
            setOpenSnackbar(true);
        }
    };

    // Delete a Note
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            const deleteContent = doc(database, "notes", id);
            try {
                await deleteDoc(deleteContent);
                setSnackbarMessage('Note deleted successfully!');
                fetchCollectionData();
            } catch (error) {
                setSnackbarMessage('Error deleting note.');
            }
            setOpenSnackbar(true);
        }
    };

    return (
        <div>
            {/* Title Bar with Enhanced Styling */}
            <div className="flex justify-between items-center pt-16 px-5 bg-gradient-to-r from-blue-500 to-teal-400 p-5 rounded-lg shadow-lg mb-6">
                <h1 className="text-5xl font-bold text-white">Notes</h1>
            </div>

            {/* Search and Sort Options */}
            <div className="flex justify-between items-center my-5 px-5">
                {/* Search Bar */}
                <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-300 rounded-full shadow-lg p-2 w-2/5">
                    <IconButton aria-label="search">
                        <SearchIcon sx={{ color: '#3b82f6' }} />
                    </IconButton>
                    <TextField
                        label="Search Notes"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="small"
                        sx={{
                            input: {
                                borderRadius: '50px',
                                paddingLeft: '10px',
                                color: '#333',
                            },
                            fieldset: {
                                borderRadius: '50px',
                            },
                        }}
                    />
                </div>

                {/* Sort Dropdown */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Sort By"
                        sx={{
                            borderRadius: '8px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                        }}
                    >
                        <MenuItem value="date">
                            <SortIcon sx={{ marginRight: '10px' }} /> Date
                        </MenuItem>
                        <MenuItem value="title">
                            <SortIcon sx={{ marginRight: '10px' }} /> Title
                        </MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-5">
                {loading ? (
                    <div className="text-center text-xl">Loading notes...</div>
                ) : sortedNotes.length > 0 ? (
                    sortedNotes.map(note => (
                        <div key={note.id} className="rounded-md border shadow-lg p-4 bg-white w-64 h-48 hover:shadow-xl transition">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="font-bold uppercase">{note.title || "Title"}</h2>
                                <div className="w-12 flex justify-between">
                                    <button onClick={() => handleOpen(note)}>
                                        <i className="fa-solid fa-file-pen text-blue-600"></i>
                                    </button>
                                    <button onClick={() => handleDelete(note.id)}>
                                        <i className="fa-solid fa-trash text-red-600"></i>
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                {note.plainText && note.plainText.length > 100
                                    ? `${note.plainText.slice(0, 50)}...`
                                    : note.plainText || "No content available"}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-2xl font-bold text-red-700">No Notes added yet!!!</div>
                )}
            </div>

            {/* Edit Content Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <h2 className="font-bold text-lg mb-2">{currentNote?.title || "Edit Note"}</h2>
                    <ReactQuill theme="snow" value={content} onChange={setContent} />
                    <div className="mt-5 flex justify-between">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNoteSave}
                            sx={{ width: '48%' }}
                        >
                            Save Changes
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleClose}
                            sx={{ width: '48%' }}
                        >
                            Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* Snackbar for Feedback */}
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default View;








