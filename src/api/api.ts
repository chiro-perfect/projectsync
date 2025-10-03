// src/api/api.ts
// 🟢 CORRECTION: Importer depuis le dossier 'types', le système de module trouvera automatiquement 'index.ts'
import type { User, Todo } from '../types/index'; 

const BASE_URL: string = "https://jsonplaceholder.typicode.com"; 

/** Requête GET générique */
async function apiFetch<T>(endpoint: string): Promise<T> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        // Conversion explicite du JSON en type T
        return (await response.json()) as T;
    } catch (error) {
        console.error(`Erreur d'appel API [${endpoint}]:`, error);
        throw error; 
    }
}

// Les fonctions API sont typées pour garantir ce qu'elles retournent
export async function fetchUsers(): Promise<User[]> { 
    return apiFetch<User[]>("/users"); 
}

export async function fetchUserById(userId: string): Promise<User> { 
    return apiFetch<User>(`/users/${userId}`); 
}

export async function fetchUserTodos(userId: string): Promise<Todo[]> { 
    return apiFetch<Todo[]>(`/todos?userId=${userId}`); 
}

/** POST /todos (Création de tâche) */
export async function postNewTodo(title: string, userId: string): Promise<Todo> {
    try {
        const response = await fetch(`${BASE_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, userId: parseInt(userId), completed: false })
        });
        if (!response.ok) { throw new Error(`Erreur POST: ${response.status}`); }
        return (await response.json()) as Todo;
    } catch (error) { throw error; }
}

/** PATCH /todos/{id} (Mise à jour du statut) */
export async function updateTodoStatus(todoId: number, isCompleted: boolean): Promise<Todo> {
    try {
        const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: isCompleted })
        });
        if (!response.ok) { throw new Error(`Erreur PATCH: ${response.status}`); }
        return (await response.json()) as Todo;
    } catch (error) { throw error; }
}