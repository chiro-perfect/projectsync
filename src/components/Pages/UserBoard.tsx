// src/components/Pages/UserBoard.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUserById, fetchUserTodos, postNewTodo } from '../../api/api';
import KanbanBoard from '../Kanban/KanbanBoard';
import Loader from '../Layout/Loader';
import type { User, Todo } from '../../types/index';

const UserBoard: React.FC = () => {
    // Typer le résultat de useParams (doit être un string ou undefined)
    const { id: userId } = useParams<{ id: string }>(); 
    
    // Typer l'état des données
    const [user, setUser] = useState<User | null>(null);
    const [todos, setTodos] = useState<Todo[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Typer l'état du formulaire
    const [newTodoTitle, setNewTodoTitle] = useState<string>('');
    const [formMessage, setFormMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Hook useEffect pour le fetch (remplace loadUserDetails)
    useEffect(() => {
        const loadUserData = async () => {
            if (!userId) { 
                setIsLoading(false); 
                return; 
            }
            try {
                const [userData, todosData] = await Promise.all([
                    fetchUserById(userId),
                    fetchUserTodos(userId)
                ]);
                setUser(userData);
                setTodos(todosData);
            } catch (error) {
                console.error("Erreur lors du chargement des données utilisateur:", error);
                setTodos([]); // Afficher un tableau vide en cas d'erreur
            } finally {
                setIsLoading(false);
            }
        };
        loadUserData();
    }, [userId]); 

    // Gestion de l'ajout de tâche (remplace handleNewTodoSubmit, typer l'événement)
    const handleNewTodoSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (newTodoTitle.trim().length < 5) {
            setFormMessage('Le titre doit contenir au moins 5 caractères.');
            return;
        }
        if (!userId) return; // Sécurité

        setIsSubmitting(true);
        setFormMessage('Envoi en cours...');

        try {
            const newTodo: Todo = await postNewTodo(newTodoTitle, userId); 
            
            // Met la nouvelle tâche en haut de la liste EN COURS
            setTodos(prevTodos => [
                { ...newTodo, id: newTodo.id || Date.now() }, 
                ...(prevTodos || [])
            ]);
            
            setNewTodoTitle('');
            setFormMessage(`Tâche ajoutée avec succès! (ID simulé: ${newTodo.id})`);

        } catch (error) {
            setFormMessage("Échec de l'ajout de la tâche.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) return <Loader />;
    if (!user || !todos) return <h1 style={{color: 'var(--trello-rouge)'}}>Utilisateur non trouvé ou erreur de données.</h1>;

    return (
        <>
            <Link to="/" className="btn-back">← Retour aux équipes</Link>

            <div className="user-content-wrapper">
                {/* Carte d'information utilisateur */}
                <div id="user-info-card" className="card fade-in">
                    <h2 id="user-name">{user.name}</h2>
                    <div className="info-line">
                        <span className="label">Email :</span>
                        <span id="user-email" className="value-highlight">{user.email}</span>
                    </div>
                    <div className="info-line">
                        <span className="label">Entreprise :</span>
                        <span id="user-company" className="value-highlight">{user.company.name}</span>
                    </div>
                </div>

                {/* Formulaire d'ajout de tâche */}
                <div id="add-todo" className="card fade-in">
                    <h3>Ajouter une nouvelle Tâche</h3>
                    <form id="new-todo-form" onSubmit={handleNewTodoSubmit}>
                        <input 
                            type="text" 
                            id="todo-title" 
                            placeholder="Tâche à ajouter (max. 50 caractères)" 
                            required 
                            maxLength={50}
                            value={newTodoTitle}
                            onChange={(e) => setNewTodoTitle(e.target.value)}
                        />
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Ajout...' : 'Ajouter la Tâche'}
                        </button>
                    </form>
                    {formMessage && <p className="post-message">{formMessage}</p>}
                </div>

                {/* Tableau Kanban */}
                <KanbanBoard initialTodos={todos} />
            </div>
        </>
    );
};

export default UserBoard;