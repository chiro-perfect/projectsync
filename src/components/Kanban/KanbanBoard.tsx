// src/components/Kanban/KanbanBoard.tsx
import React, { useState, type DragEvent } from 'react';
import TaskCard from './TaskCard';
import { updateTodoStatus } from '../../api/api';
// 🟢 CORRECTION: Importation depuis le dossier 'types' sans spécifier 'index' ni l'extension
import type { Todo } from '../../types'; 

interface KanbanBoardProps {
    initialTodos: Todo[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialTodos }) => {
    // Utilisation du Hook d'état avec le type Todo[]
    const [todos, setTodos] = useState<Todo[]>(initialTodos);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    const handleDragStart = (e: DragEvent<HTMLDivElement>, todoId: number): void => {
        setDraggedId(todoId);
        e.dataTransfer.setData('text/plain', todoId.toString());
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>, targetColumnId: string): Promise<void> => {
        e.preventDefault();
        
        const dataTransferId: string = e.dataTransfer.getData('text/plain');
        const todoIdString: string | null = draggedId?.toString() || dataTransferId;
        const parsedTodoId: number = parseInt(todoIdString || '0');
        
        if (!parsedTodoId) return;

        const isCompleted: boolean = targetColumnId === 'completed-todos';

        // 1. Mise à jour Optimiste de l'état
        setTodos(prevTodos => 
            prevTodos.map(todo =>
                todo.id === parsedTodoId ? { ...todo, completed: isCompleted } : todo
            )
        );

        // 2. Appel API PATCH
        try {
            await updateTodoStatus(parsedTodoId, isCompleted);
        } catch (error) {
            console.error("Erreur API : Le statut n'a pas été enregistré.", error);
            // Annuler le changement d'état si l'API échoue
            setTodos(prevTodos => 
                prevTodos.map(todo =>
                    todo.id === parsedTodoId ? { ...todo, completed: !isCompleted } : todo
                )
            );
        }
        setDraggedId(null);
    };

    // Filtrage dynamique typé
    const pendingTodos: Todo[] = todos.filter(t => !t.completed);
    const completedTodos: Todo[] = todos.filter(t => t.completed);

    return (
        <div className="kanban-board fade-in">
            <h3 style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>Tableau des Tâches (Kanban)</h3>

            {/* Colonne EN COURS */}
            <div 
                id="pending-todos" 
                className="kanban-column"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e: DragEvent<HTMLDivElement>) => handleDrop(e, 'pending-todos')}
            >
                <h4>Tâches en cours ({pendingTodos.length})</h4>
                {pendingTodos.map((todo) => (
                    <TaskCard 
                        key={todo.id} 
                        todo={todo} 
                        onDragStart={handleDragStart} 
                    />
                ))}
            </div>
            
            {/* Colonne TERMINÉES */}
            <div 
                id="completed-todos" 
                className="kanban-column"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e: DragEvent<HTMLDivElement>) => handleDrop(e, 'completed-todos')}
            >
                <h4>Tâches terminées ({completedTodos.length})</h4>
                {completedTodos.map((todo) => (
                    <TaskCard 
                        key={todo.id} 
                        todo={todo} 
                        onDragStart={handleDragStart} 
                    />
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;