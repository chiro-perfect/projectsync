// src/components/Kanban/TaskCard.tsx
import React, { DragEvent } from 'react';
import { Todo } from '../../types';

interface TaskCardProps {
    todo: Todo;
    // Typer la fonction onDragStart (nécessaire pour le D&D)
    onDragStart: (e: DragEvent<HTMLDivElement>, todoId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ todo, onDragStart }) => {
    const isCompleted: boolean = todo.completed;
    const statusText: string = isCompleted ? 'TERMINÉE' : 'EN COURS';
    const statusClass: string = isCompleted ? 'status-completed' : 'status-pending';

    return (
        <div 
            className="kanban-task fade-in"
            data-todo-id={todo.id.toString()} 
            draggable 
            // Appel de la prop onDragStart avec l'événement et l'ID typés
            onDragStart={(e: DragEvent<HTMLDivElement>) => onDragStart(e, todo.id)}
        >
            <p className="task-title">{todo.title}</p>
            <span className={`status-label ${statusClass}`}>
                {statusText}
            </span>
            <p className="task-info">ID Trello: {todo.id}</p>
        </div>
    );
};

export default TaskCard;