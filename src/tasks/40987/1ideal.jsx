import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";

const WordCard = ({ word, onDelete }) => (
  <Card className="w-full shadow-md border border-gray-300 hover:border-blue-500 transition-colors rounded-lg">
    <CardContent className="p-4">
      <h3 className="font-bold text-xl text-blue-700">Word: {word.foreign}</h3>
      <p className="text-gray-800">English Translation: {word.english}</p>
      <p className="text-sm text-gray-500 italic">Pronunciation: {word.pronunciation}</p>
    </CardContent>
    <CardFooter>
      <Button variant="destructive" className="w-full" onClick={() => onDelete(word.id)}>Delete</Button>
    </CardFooter>
  </Card>
);

const AddWordModal = ({ isOpen, onClose, onAdd }) => {
  const [newWord, setNewWord] = useState({ foreign: '', english: '', pronunciation: '' });

  const handleAdd = () => {
    onAdd({ ...newWord, id: Date.now() });
    setNewWord({ foreign: '', english: '', pronunciation: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-lg shadow-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Add New Word</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Foreign Word"
            value={newWord.foreign}
            onChange={(e) => setNewWord({ ...newWord, foreign: e.target.value })}
          />
          <Input
            placeholder="English Translation"
            value={newWord.english}
            onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
          />
          <Input
            placeholder="Pronunciation"
            value={newWord.pronunciation}
            onChange={(e) => setNewWord({ ...newWord, pronunciation: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" onClick={handleAdd}>Add Word</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SearchBar = ({ onSearch }) => (
  <div className="w-full max-w-sm mb-4">
    <Input
      type="text"
      placeholder="Search English words..."
      className="rounded-lg shadow-sm focus:ring focus:ring-blue-200"
      onChange={(e) => onSearch(e.target.value)}
    />
  </div>
);

const exportToCSV = (words) => {
  const csvContent = "data:text/csv;charset=utf-8," + 
    "Foreign,English,Pronunciation\n" +
    words.map(w => `${w.foreign},${w.english},${w.pronunciation}`).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "language_words.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function App() {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const wordsPerPage = 10;

  useEffect(() => {
    const filtered = words.filter(word => 
      word.english.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWords(filtered);
    setCurrentPage(1);
  }, [words, searchTerm]);

  const addWord = (newWord) => {
    setWords([...words, newWord]);
  };

  const deleteWord = (id) => {
    setWords(words.filter(word => word.id !== id));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const paginatedWords = filteredWords.slice(
    (currentPage - 1) * wordsPerPage,
    currentPage * wordsPerPage
  );

  const ExportButton = () => (
    <Button className="bg-green-600 text-white hover:bg-green-700" onClick={() => exportToCSV(words)}>Export CSV</Button>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Language Learning Word Tracker</h1>
      <div className="flex justify-between items-center mb-4">
        <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setIsAddModalOpen(true)}>Add Word</Button>
        <div className="sm:block hidden">
          <ExportButton />
        </div>
        <div className="sm:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4 text-blue-600" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-gray-100 p-4">
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                <ExportButton />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedWords.map(word => (
          <WordCard key={word.id} word={word} onDelete={deleteWord} />
        ))}
      </div>
      <div className="mt-4 flex justify-center space-x-2">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage * wordsPerPage >= filteredWords.length}
        >
          Next
        </Button>
      </div>
      <AddWordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addWord}
      />
    </div>
  );
}
