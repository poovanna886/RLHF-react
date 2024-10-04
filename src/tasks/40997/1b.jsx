import React, { useState } from 'react';
//import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const COLORS = {
  'stories': 'bg-red-100',
  'in progress': 'bg-blue-100',
  'peer review': 'bg-yellow-100',
  'in testing': 'bg-purple-100',
  'done': 'bg-green-100'
};

function TaskCard({ task, column, onMove, onDelete }) {
  const [isDragging, setIsDragging] = useState(false);
  const startDrag = (e) => {
    e.dataTransfer.setData('text', JSON.stringify({ id: task.id, from: column }));
    setIsDragging(true);
  };

  const endDrag = () => setIsDragging(false);

  return (
    <Card className={`${COLORS[column]} ${isDragging ? 'opacity-50' : ''} mb-2 p-2 cursor-move`} draggable onDragStart={startDrag} onDragEnd={endDrag}>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{task.description}</CardDescription>
      </CardContent>
      {column === 'stories' && <CardFooter><Button onClick={() => onDelete(task.id)} variant="destructive">Delete</Button></CardFooter>}
    </Card>
  );
}

function Column({ name, tasks, onDrop, onDelete }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text'));
    onDrop(data, name);
  };

  return (
    <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="flex-1 min-w-0 p-2">
      <h2 className="text-lg font-bold mb-2">{name}</h2>
      {tasks.map(task => <TaskCard key={task.id} task={task} column={name} onMove={onDrop} onDelete={onDelete} />)}
    </div>
  );
}

function TaskModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="mb-2" />
        <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <DialogFooter>
          <Button type="submit" onClick={() => { onSubmit({ title, description }); onClose(); }}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [tasks, setTasks] = useState({
    'stories': [],
    'in progress': [],
    'peer review': [],
    'in testing': [],
    'done': []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = (task) => {
    setTasks(prev => ({
      ...prev,
      'stories': [...prev['stories'], { id: Date.now(), ...task }]
    }));
  };

  const handleMoveTask = ({ id, from }, to) => {
    setTasks(prev => {
      const taskToMove = prev[from].find(task => task.id === id);
      return {
        ...prev,
        [from]: prev[from].filter(task => task.id !== id),
        [to]: [...prev[to], taskToMove]
      };
    });
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => ({
      ...prev,
      'stories': prev['stories'].filter(task => task.id !== id)
    }));
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <Button asChild>
        <DialogTrigger onClick={() => setIsModalOpen(true)}>Create Task</DialogTrigger>
      </Button>
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateTask} />
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        {Object.keys(tasks).map(column => (
          <Column 
            key={column} 
            name={column} 
            tasks={tasks[column]} 
            onDrop={handleMoveTask} 
            onDelete={handleDeleteTask} 
          />
        ))}
      </div>
    </div>
  );
}