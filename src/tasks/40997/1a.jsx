import React, { useState } from "react";
//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialTasks = {
  stories: [],
  inProgress: [],
  peerReview: [],
  inTesting: [],
  done: [],
};

const colors = {
  stories: 'bg-red-100',
  inProgress: 'bg-blue-100',
  peerReview: 'bg-yellow-100',
  inTesting: 'bg-purple-100',
  done: 'bg-green-100',
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const task = tasks[sourceColumn][source.index];

    if (sourceColumn !== destColumn) {
      const newTasks = { ...tasks };
      newTasks[sourceColumn].splice(source.index, 1);
      newTasks[destColumn].splice(destination.index, 0, { ...task, color: destColumn });
      setTasks(newTasks);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTask({ title: '', description: '' });
  };

  const handleCreateTask = () => {
    if (newTask.title) {
      setTasks(prev => ({
        ...prev,
        stories: [...prev.stories, { ...newTask, id: Date.now().toString(), color: 'stories' }]
      }));
      closeModal();
    }
  };

  const deleteTask = (id) => {
    setTasks(prev => ({
      ...prev,
      stories: prev.stories.filter(task => task.id !== id)
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <Button onClick={openModal}>Create Task</Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
          {Object.keys(tasks).map(column => (
            <Droppable key={column} droppableId={column}>
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className={`p-4 rounded-lg ${colors[column]}`}
                >
                  <h2 className="text-lg font-semibold mb-2">{column.replace(/([A-Z])/g, ' $1').trim()}</h2>
                  {tasks[column].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef} 
                          {...provided.draggableProps} 
                          {...provided.dragHandleProps}
                          className={`mb-2 ${colors[task.color]} p-2 rounded shadow-sm`}
                        >
                          <Card>
                            <CardHeader>
                              <CardTitle>{task.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p>{task.description}</p>
                            </CardContent>
                            {column === 'stories' && (
                              <Button variant="destructive" size="icon" onClick={() => deleteTask(task.id)}>
                                Delete
                              </Button>
                            )}
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;