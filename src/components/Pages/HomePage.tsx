// src/components/Pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchUserTodos } from '../../api/api';
import UserCard from '../UserBoard';
import Loader from '../Layout/Loader';
import type { User, Todo } from '../../types/index';

const HomePage: React.FC = () => {
    // Typer les Hooks d'état
    const [users, setUsers] = useState<User[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Fonction de normalisation réutilisée de utils.js
    const normalizeText = (text: string) => 
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Hook useEffect pour le fetch asynchrone (ancien loadHomeData)
    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedUsers: User[] = await fetchUsers();
                // Utilisation de Promise.all pour optimiser les appels de todos
                const usersWithCounts: User[] = await Promise.all(
                    fetchedUsers.map(async (user: User) => {
                        const todos: Todo[] = await fetchUserTodos(user.id.toString()) || [];
                        const todoCount: number = todos.filter(todo => !todo.completed).length;
                        return { ...user, todoCount };
                    })
                );
                setUsers(usersWithCounts);
            } catch (error) {
                console.error("Erreur de chargement des utilisateurs:", error);
                setUsers([]); // Afficher un tableau vide en cas d'erreur
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []); 

    // Logique de filtrage (remplace filterUserCards)
    const filteredUsers: User[] = users?.filter((user: User) => {
        const normalizedTerm: string = normalizeText(searchTerm);
        const normalizedUserName: string = normalizeText(user.name);
        return normalizedUserName.includes(normalizedTerm);
    }) || [];
    
    // Affichage conditionnel
    if (isLoading) return <Loader />;
    if (!users || users.length === 0) return <h1 style={{color: 'var(--trello-rouge)'}}>Aucune donnée utilisateur disponible ou erreur de connexion.</h1>;

    return (
        <section id="homepage-content">
            <section id="search-bar" className="card fade-in">
                <form onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="text" 
                        id="search-input" 
                        placeholder="Rechercher des utilisateurs par nom ou projet"
                        aria-label="Rechercher des utilisateurs"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
            </section>

            <section id="liste-projets">
                <h2>Liste des Collaborateurs ({filteredUsers.length} trouvés)</h2>
                
                <div className="user-list" id="users-container">
                    {filteredUsers.map((user: User) => (
                        // todoCount est garanti d'être défini grâce à la logique de Promise.all
                        <UserCard key={user.id} user={user} todoCount={user.todoCount as number} />
                    ))}
                </div>
            </section>
        </section>
    );
};

export default HomePage;