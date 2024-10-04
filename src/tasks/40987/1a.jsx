import React, { useState, useEffect } from 'react';
//import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
//import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";

const App = () => {
  const [words, setWords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWord, setNewWord] = useState({ foreign: '', english: '', pronunciation: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedWords = JSON.parse(localStorage.getItem('languageWords')) || [];
    setWords(storedWords);
  }, []);

  useEffect(() => {
    localStorage.setItem('languageWords', JSON.stringify(words));
  }, [words]);

  const addWord = () => {
    if (newWord.foreign && newWord.english) {
      setWords([...words, newWord]);
      setIsModalOpen(false);
      setNewWord({ foreign: '', english: '', pronunciation: '' });
    }
  };

  const deleteWord = (index) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + words.map(w => `${w.foreign},${w.english},${w.pronunciation}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_words.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredWords = words.filter(word => 
    word.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const wordsPerPage = 10;
  const indexOfLastWord = currentPage * wordsPerPage;
  const indexOfFirstWord = indexOfLastWord - wordsPerPage;
  const currentWords = filteredWords.slice(indexOfFirstWord, indexOfLastWord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Input 
          placeholder="Search for English words..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-xs"
        />
        <div className="sm:hidden">
          <Menu>
            <MenuTrigger><Button>Menu</Button></MenuTrigger>
            <MenuContent>
              <MenuItem onClick={exportToCSV}>Export CSV</MenuItem>
            </MenuContent>
          </Menu>
        </div>
        <Button onClick={exportToCSV} className="hidden sm:inline-block">Export CSV</Button>
        <Button onClick={() => setIsModalOpen(true)}>Add Word</Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentWords.map((word, index) => (
          <WordCard 
            key={index} 
            word={word} 
            onDelete={() => deleteWord(index)} 
          />
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        {Array.from({length: Math.ceil(filteredWords.length / wordsPerPage)}, (_, i) => (
          <Button key={i} onClick={() => paginate(i + 1)} className="mx-1">
            {i + 1}
          </Button>
        ))}
      </div>

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>Add New Word</ModalHeader>
          <ModalBody>
            <Input 
              value={newWord.foreign} 
              onChange={(e) => setNewWord({...newWord, foreign: e.target.value})} 
              placeholder="Foreign Word"
            />
            <Input 
              value={newWord.english} 
              onChange={(e) => setNewWord({...newWord, english: e.target.value})} 
              placeholder="English Translation"
              className="mt-2"
            />
            <Input 
              value={newWord.pronunciation} 
              onChange={(e) => setNewWord({...newWord, pronunciation: e.target.value})} 
              placeholder="Pronunciation"
              className="mt-2"
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={addWord}>Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

const WordCard = ({ word, onDelete }) => (
  <Card>
    <CardHeader>
      <CardTitle>{word.foreign}</CardTitle>
      <CardDescription>{word.pronunciation}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>{word.english}</p>
    </CardContent>
    <CardFooter>
      <Button onClick={onDelete}>Delete</Button>
    </CardFooter>
  </Card>
);

export default App;