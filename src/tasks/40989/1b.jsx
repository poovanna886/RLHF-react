import React, { useState } from 'react';
//import { Button, Modal, Input, Card, CardHeader, CardContent, CardFooter } from "@/components/ui";
//import { PlusIcon, TrashIcon, ArrowLeftIcon } from "@heroicons/react/solid";

const colors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-pink-200', 'bg-purple-200'];

function Album({ album, onBack, onDeletePhoto, onAddNote }) {
  const [isNoteModalOpen, setNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const handleOpenNoteModal = () => setNoteModalOpen(true);
  const handleCloseNoteModal = () => setNoteModalOpen(false);
  const handleSubmitNote = () => {
    onAddNote(noteContent);
    handleCloseNoteModal();
    setNoteContent('');
  };

  return (
    <div className="p-4">
      <Button onClick={onBack} className="mb-4"><ArrowLeftIcon className="h-4 w-4 mr-2" />Back</Button>
      <Card>
        <CardHeader>
          <CardTitle>{album.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {album.photos.map((photo, index) => (
            <div key={index} className="relative">
              <img src={photo.src} alt={`Photo ${index}`} className="w-full h-40 object-cover rounded-lg" />
              <Button variant="destructive" className="absolute top-2 right-2" onClick={() => onDeletePhoto(index)}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {album.notes.map((note, index) => (
            <div key={index} className={`p-2 rounded-lg ${note.color}`}>
              <p>{note.text}</p>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <input 
            type="file" 
            multiple 
            onChange={onAddPhoto} 
            className="hidden" 
            id="photoUpload" 
          />
          <label htmlFor="photoUpload">
            <Button component="span"><PlusIcon className="h-4 w-4 mr-2" />Add Photos</Button>
          </label>
          <Button onClick={handleOpenNoteModal}><PlusIcon className="h-4 w-4 mr-2" />Create Note</Button>
        </CardFooter>
      </Card>
      <Modal isOpen={isNoteModalOpen} onClose={handleCloseNoteModal}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Create Note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input type="text" value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="Enter your note" />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmitNote}>Add Note</Button>
            <Button variant="secondary" onClick={handleCloseNoteModal}>Cancel</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default function App() {
  const [albums, setAlbums] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  const handleCreateAlbum = () => {
    if (newAlbumName) {
      setAlbums([...albums, { name: newAlbumName, photos: [], notes: [] }]);
      setIsModalOpen(false);
      setNewAlbumName('');
    }
  };

  const handleAddPhoto = (event) => {
    const files = Array.from(event.target.files);
    setCurrentAlbum(prev => ({
      ...prev,
      photos: [...prev.photos, ...files.map(file => ({ src: URL.createObjectURL(file) }))]
    }));
  };

  const handleDeletePhoto = (index) => {
    setCurrentAlbum(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleAddNote = (text) => {
    setCurrentAlbum(prev => ({
      ...prev,
      notes: [...prev.notes, { text, color: colors[Math.floor(Math.random() * colors.length)] }]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {currentAlbum ? (
        <Album 
          album={currentAlbum} 
          onBack={() => setCurrentAlbum(null)}
          onDeletePhoto={handleDeletePhoto}
          onAddPhoto={handleAddPhoto}
          onAddNote={handleAddNote}
        />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsModalOpen(true)}><PlusIcon className="h-4 w-4 mr-2" />Create Album</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map((album, index) => (
              <Card key={index} onClick={() => setCurrentAlbum(album)}>
                <CardHeader>
                  <CardTitle>{album.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {album.photos[0] && <img src={album.photos[0].src} alt="Album Thumbnail" className="h-40 w-full object-cover rounded-lg" />}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Create New Album</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input 
              value={newAlbumName} 
              onChange={(e) => setNewAlbumName(e.target.value)} 
              placeholder="Album Name" 
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCreateAlbum}>Create</Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}