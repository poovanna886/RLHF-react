import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Drawer } from "@/components/ui/drawer";

export default function App() {
  const [words, setWords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const wordsPerPage = 10;

  const addWord = (newWord) => {
    setWords([...words, newWord]);
    setIsModalOpen(false);
  };

  const deleteWord = (index) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const filteredWords = words.filter(word => 
    word.english.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastWord = currentPage * wordsPerPage;
  const indexOfFirstWord = indexOfLastWord - wordsPerPage;
  const currentWords = filteredWords.slice(indexOfFirstWord, indexOfLastWord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const exportToCSV = () => {
    const csvRows = [];
    csvRows.push(['Foreign Word', 'English', 'Pronunciation']);
    words.forEach(word => {
      csvRows.push([word.foreign, word.english, word.pronunciation]);
    });
    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_words.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Input 
          placeholder="Search for English word" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full max-w-md"
        />
        <Button onClick={() => setIsModalOpen(true)} className="ml-2">Add Word</Button>
        <Button onClick={exportToCSV} className="ml-2">Export CSV</Button>
        <Drawer>
          <Button onClick={exportToCSV}>Export CSV</Button>
        </Drawer>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentWords.map((word, index) => (
          <WordCard key={index} word={word} onDelete={() => deleteWord(index)} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(filteredWords.length / wordsPerPage) }, (_, i) => (
          <Button key={i} onClick={() => paginate(i + 1)}>{i + 1}</Button>
        ))}
      </div>
      <AddWordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddWord={addWord} />
    </div>
  );
}

function WordCard({ word, onDelete }) {
  return (
    <Card>
      <CardHeader>
        <h3>{word.foreign}</h3>
      </CardHeader>
      <CardContent>
        <p>English: {word.english}</p>
        <p>Pronunciation: {word.pronunciation}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onDelete}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

function AddWordModal({ isOpen, onClose, onAddWord }) {
  const [word, setWord] = useState({ foreign: '', english: '', pronunciation: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddWord(word);
    setWord({ foreign: '', english: '', pronunciation: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add New Word</ModalHeader>
          <ModalBody>
            <Input value={word.foreign} onChange={e => setWord({...word, foreign: e.target.value})} placeholder="Foreign Word" />
            <Input value={word.english} onChange={e => setWord({...word, english: e.target.value})} placeholder="English Translation" />
            <Input value={word.pronunciation} onChange={e => setWord({...word, pronunciation: e.target.value})} placeholder="Pronunciation" />
          </ModalBody>
          <ModalFooter>
            <Button type="submit">Add</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}