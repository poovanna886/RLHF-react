import React, { useState } from "react";
import { X, Plus, ArrowLeft, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const colorOptions = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
];

function AlbumCard({ album, onOpen }) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onOpen(album.id)}
    >
      <CardContent className="p-4">
        {album.photos.length > 0 ? (
          <img
            src={URL.createObjectURL(album.photos[0])}
            alt={album.name}
            className="w-full h-40 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md">
            <ImageIcon size={48} className="text-gray-400" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 text-center">{album.name}</CardFooter>
    </Card>
  );
}

function PhotoItem({ photo, onDelete }) {
  return (
    <div className="relative group">
      <img
        src={URL.createObjectURL(photo)}
        alt="Album photo"
        className="w-full h-40 object-cover rounded-md"
      />
      <button
        onClick={() => onDelete(photo)}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function NoteItem({ note, color }) {
  return (
    <div className={`p-4 rounded-md ${color}`}>
      <p className="text-sm">{note}</p>
    </div>
  );
}

function AlbumView({ album, onBack, onAddPhotos, onDeletePhoto, onAddNote }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" className="p-2">
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-2xl font-bold">{album.name}</h2>
        <div className="space-x-2">
          <Button onClick={() => onAddPhotos(album.id)}>Add Photos</Button>
          <Button onClick={() => onAddNote(album.id)}>Create Note</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {album.photos.map((photo, index) => (
          <PhotoItem key={index} photo={photo} onDelete={onDeletePhoto} />
        ))}
        {album.notes.map((note, index) => (
          <NoteItem
            key={index}
            note={note.text}
            color={note.color}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [albums, setAlbums] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newNote, setNewNote] = useState("");

  const createAlbum = () => {
    if (newAlbumName.trim()) {
      setAlbums([
        ...albums,
        { id: Date.now(), name: newAlbumName, photos: [], notes: [] },
      ]);
      setNewAlbumName("");
      setIsCreateAlbumOpen(false);
    }
  };

  const openAlbum = (id) => {
    setCurrentAlbum(albums.find((album) => album.id === id));
  };

  const addPhotos = (albumId) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      setAlbums(
        albums.map((album) =>
          album.id === albumId
            ? { ...album, photos: [...album.photos, ...files] }
            : album
        )
      );
      setCurrentAlbum((prev) => ({
        ...prev,
        photos: [...prev.photos, ...files],
      }));
    };
    input.click();
  };

  const deletePhoto = (photoToDelete) => {
    setAlbums(
      albums.map((album) =>
        album.id === currentAlbum.id
          ? {
            ...album,
            photos: album.photos.filter((photo) => photo !== photoToDelete),
          }
          : album
      )
    );
    setCurrentAlbum((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo !== photoToDelete),
    }));
  };

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        text: newNote,
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      };
      setAlbums(
        albums.map((album) =>
          album.id === currentAlbum.id
            ? { ...album, notes: [...album.notes, note] }
            : album
        )
      );
      setCurrentAlbum((prev) => ({
        ...prev,
        notes: [...prev.notes, note],
      }));
      setNewNote("");
      setIsCreateNoteOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {currentAlbum ? (
        <AlbumView
          album={currentAlbum}
          onBack={() => setCurrentAlbum(null)}
          onAddPhotos={addPhotos}
          onDeletePhoto={deletePhoto}
          onAddNote={() => setIsCreateNoteOpen(true)}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Photo Albums</h1>
            <Button onClick={() => setIsCreateAlbumOpen(true)}>
              Create Album
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} onOpen={openAlbum} />
            ))}
          </div>
        </>
      )}

      <Dialog open={isCreateAlbumOpen} onOpenChange={setIsCreateAlbumOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Album</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Album Name"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={createAlbum}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateNoteOpen} onOpenChange={setIsCreateNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter your note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={addNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}