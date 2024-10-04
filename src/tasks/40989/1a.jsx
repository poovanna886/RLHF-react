// App.jsx
import React, { useState } from 'react';
//import { Button, Modal, Input, Card, CardContent, CardHeader, CardFooter } from "@/components/ui";
//import { PlusIcon, TrashIcon, ArrowLeftIcon } from "@radix-ui/react-icons";

const colors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-red-200', 'bg-purple-200'];

function App() {
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [albumName, setAlbumName] = useState('');

  const openCreateAlbum = () => {
    setShowModal(true);
  };

  const createAlbum = () => {
    if (albumName) {
      setAlbums([...albums, { name: albumName, photos: [], notes: [] }]);
      setShowModal(false);
      setAlbumName('');
    }
  };

  const AlbumView = ({ album, goBack }) => {
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [photos, setPhotos] = useState(album.photos);

    const handleFileUpload = (e) => {
      const files = Array.from(e.target.files);
      const newPhotos = files.map(file => ({
        url: URL.createObjectURL(file),
        id: Date.now() + Math.random()
      }));
      setPhotos([...newPhotos, ...photos]);
      if (!album.photos.length && newPhotos.length) {
        // Set first photo as thumbnail
        album.thumbnail = newPhotos[0].url;
      }
    };

    const addNote = () => {
      const newNote = {
        text: noteText,
        color: colors[Math.floor(Math.random() * colors.length)],
        id: Date.now()
      };
      album.notes.push(newNote);
      setShowNoteModal(false);
      setNoteText('');
    };

    const deletePhoto = (id) => {
      setPhotos(photos.filter(p => p.id !== id));
    };

    return (
      <div className="p-4">
        <Button onClick={goBack} className="mb-4"><ArrowLeftIcon /> Back</Button>
        <input type="file" multiple onChange={handleFileUpload} className="mb-4" />
        <Button onClick={() => setShowNoteModal(true)}>Create Note</Button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map(photo => (
            <Card key={photo.id} className="relative">
              <CardHeader>
                <img src={photo.url} alt="Album" className="w-full h-48 object-cover" />
              </CardHeader>
              <CardFooter>
                <Button variant="destructive" onClick={() => deletePhoto(photo.id)}>
                  <TrashIcon /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
          {album.notes.map(note => (
            <div key={note.id} className={`p-4 rounded ${note.color}`}>
              {note.text}
            </div>
          ))}
        </div>
        <Modal open={showNoteModal} onOpenChange={setShowNoteModal}>
          <Modal.Content>
            <Input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Enter your note" />
            <Button onClick={addNote}>Add Note</Button>
          </Modal.Content>
        </Modal>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      {currentAlbum === null ? (
        <>
          <Button onClick={openCreateAlbum}>Create Album</Button>
          {albums.map((album, idx) => (
            <Card key={idx} className="my-4 cursor-pointer" onClick={() => setCurrentAlbum(album)}>
              <CardContent>
                <h3>{album.name}</h3>
                {album.thumbnail && <img src={album.thumbnail} alt="Thumbnail" className="mt-2 w-24 h-24 object-cover" />}
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <AlbumView album={currentAlbum} goBack={() => setCurrentAlbum(null)} />
      )}
      <Modal open={showModal} onOpenChange={setShowModal}>
        <Modal.Content>
          <Input value={albumName} onChange={(e) => setAlbumName(e.target.value)} placeholder="Album Name" />
          <Button onClick={createAlbum}>Create</Button>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default App;