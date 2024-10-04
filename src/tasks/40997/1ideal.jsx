import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const columns = [
    { id: "stories", title: "Stories", color: "bg-red-200" },
    { id: "in-progress", title: "In Progress", color: "bg-blue-200" },
    { id: "peer-review", title: "Peer Review", color: "bg-yellow-200" },
    { id: "in-testing", title: "In Testing", color: "bg-purple-200" },
    { id: "done", title: "Done", color: "bg-green-200" },
];

function Task({ task, onDragStart, onTouchStart, onDelete }) {
    return (
        <Card
            className={`mb-2 cursor-move transition-all duration-300 ${columns.find((col) => col.id === task.status).color
                }`}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            onTouchStart={(e) => onTouchStart(e, task.id)}
        >
            <CardHeader>
                <CardTitle>{task.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{task.description}</CardDescription>
            </CardContent>
            {task.status === "stories" && (
                <CardFooter>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(task.id)}
                    >
                        Delete
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

function Column({ title, tasks, status, onDragOver, onDrop, onDragStart, onTouchStart, onDelete }) {
    return (
        <div
            className="bg-gray-100 p-4 rounded-lg shadow-md flex-1 min-w-[250px]"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
        >
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {tasks.map((task) => (
                <Task
                    key={task.id}
                    task={task}
                    onDragStart={onDragStart}
                    onTouchStart={onTouchStart}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [loaded, setLoaded] = useState(false);
    const [draggedTask, setDraggedTask] = useState(null);

    useEffect(() => {
        setLoaded(true);
    }, []);

    const onDragStart = (e, id) => {
        e.dataTransfer.setData("text/plain", id);
        setDraggedTask(id);
    };

    const onTouchStart = (e, id) => {
        setDraggedTask(id);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = (e, newStatus) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text") || draggedTask;
        if (id) {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id.toString() === id.toString() ? { ...task, status: newStatus } : task
                )
            );
            setDraggedTask(null);
        }
    };

    const createTask = () => {
        if (newTask.title && newTask.description) {
            setTasks([
                ...tasks,
                { id: Date.now(), ...newTask, status: "stories" },
            ]);
            setNewTask({ title: "", description: "" });
            setIsOpen(false);
        }
    };

    const onDelete = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    useEffect(() => {
        const handleTouchMove = (e) => {
            e.preventDefault();
            if (draggedTask) {
                const touch = e.touches[0];
                const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
                const columnElement = elementsAtPoint.find(el => el.classList.contains('bg-gray-100'));
                if (columnElement) {
                    const newStatus = columns.find(col => columnElement.textContent.includes(col.title))?.id;
                    if (newStatus) {
                        setTasks((prevTasks) =>
                            prevTasks.map((task) =>
                                task.id.toString() === draggedTask.toString() ? { ...task, status: newStatus } : task
                            )
                        );
                    }
                }
            }
        };

        const handleTouchEnd = () => {
            setDraggedTask(null);
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [draggedTask]);

    return (
        <div className={`container mx-auto p-4 ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
            <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button className="mb-6">Create Task</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                        <DialogDescription>
                            Add a new task to the Stories column.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={newTask.title}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, title: e.target.value })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={newTask.description}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, description: e.target.value })
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={createTask}>Create Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto pb-4">
                {columns.map((column) => (
                    <Column
                        key={column.id}
                        title={column.title}
                        tasks={tasks.filter((task) => task.status === column.id)}
                        status={column.id}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        onDragStart={onDragStart}
                        onTouchStart={onTouchStart}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}