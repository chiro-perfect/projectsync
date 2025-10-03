// src/components/UserCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types/index';

// Typer les props attendues
interface UserCardProps {
    user: User;
    todoCount: number;
}

const UserCard: React.FC<UserCardProps> = ({ user, todoCount }) => {
    const statusColor: string = todoCount > 0 ? 'var(--status-pending-bg)' : 'var(--status-completed-bg)';
    const todoMessage: string = todoCount === 0 ? 'Toutes les tâches terminées!' : `Tâches en cours: ${todoCount}`;

    return (
        <article className="card user-card" data-user-id={user.id}>
            <h3>{user.name}</h3>
            <p>Entreprise: {user.company.name}</p>
            <p style={{ fontWeight: 700, color: statusColor }}>
                {todoMessage}
            </p>
            
            <Link to={`/user/${user.id}`} className="btn">
                Voir le board Kanban
            </Link>
        </article>
    );
};

export default UserCard;