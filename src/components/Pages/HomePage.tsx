// src/components/Pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchUserTodos } from '../../api/api';
// 🟢 CORRECTION: Assurez-vous que le chemin d'importation pointe vers le composant UserCard réel.
// Je suppose qu'il se trouve dans '../../components/UserCard'. Ajustez si nécessaire.
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
                        // L'API JSONPlaceholder simule 200 tâches, en choisir 10 est plus réaliste
                        // On garde l'appel API pour la logique
                        const todos: Todo[] = await fetchUserTodos(user.id.toString()) || [];
                        const todoCount: number = todos.filter(todo => !todo.completed).length;
                        // On ajoute la propriété 'todoCount' qui n'est pas dans le type 'User' original.
                        // Il faut s'assurer que le type 'User' dans 'types/index.ts' inclut `todoCount?: number;`
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
    if (!users || users.length === 0) return <h1 style={{color: 'var(--color-accent-teal)'}}>Aucune donnée utilisateur disponible ou erreur de connexion.</h1>;

    return (
        // 🟢 La classe 'container' est gérée par le composant <main> ou <div> parent dans App.tsx
        // Ce composant interne peut donc se concentrer sur sa structure.
        <section id="homepage-content">
            
            {/* 1. Barre de Recherche */}
            <section id="search-bar" className="card fade-in">
                <form onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="text" 
                        id="search-input" 
                        placeholder="Rechercher des utilisateurs par nom ou projet"
                        aria-label="Rechercher des utilisateurs"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm} // 💡 Bonnes pratiques : lier la valeur à l'état
                    />
                </form>
            </section>

            {/* 2. Liste des Collaborateurs */}
            <section id="liste-projets">
                <h2>Liste des Collaborateurs ({filteredUsers.length} trouvés)</h2>
                
                {/* La classe 'user-list' active la grille responsive définie dans responsive.css */}
                <div className="user-list" id="users-container">
                    {filteredUsers.map((user: User) => (
                        <UserCard 
                            key={user.id} 
                            user={user} 
                            // 💡 S'assurer que todoCount est bien un nombre (la logique ci-dessus le garantit)
                            todoCount={user.todoCount as number} 
                        />
                    ))}
                </div>
            </section>
        </section>
    );
};

export default HomePage;