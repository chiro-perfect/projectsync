// src/components/Pages/AboutPage.tsx
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <section id="about-page">
      <header className="page-header">
        <h1>À Propos de ProjectSync E2 (Migration React/TS)</h1>
        <p className="subtitle">Détails de la mise en œuvre de l'interface professionnelle.</p>
      </header>

      <div className="about-content">
        <section className="card fade-in">
          <h2>Contexte et Objectifs (E2)</h2>
          <p>
            Cette application est la refonte de l'interface E1 en utilisant un framework JavaScript moderne (React) et TypeScript pour garantir la qualité et la maintenabilité du code, conformément aux critères de l'Épreuve E2.
          </p>
        </section>
        
        <section className="card fade-in">
          <h2>Architecture Technique</h2>
          <ul>
            <li><strong>Framework:</strong> React (avec Hooks: useState, useEffect, useParams).</li>
            <li><strong>Langage:</strong> TypeScript (TSX) pour un typage fort et une meilleure gestion des erreurs.</li>
            <li><strong>Routage:</strong> React Router v6 pour une navigation fonctionnelle entre les pages (HomePage, UserBoard, AboutPage).</li>
            <li><strong>Données:</strong> Logique API isolée et typée (`api.ts`).</li>
            <li><strong>Composants:</strong> Le code est entièrement découpé en composants réutilisables (Header, Footer, UserCard, KanbanBoard, TaskCard).</li>
          </ul>
        </section>

        <section className="card fade-in">
          <h2>Fonctionnalités Clés</h2>
          <ul>
            <li>Navigation par **React Router**.</li>
            <li>Gestion d'état centralisée par les **Hooks React** (fin de la manipulation directe du DOM).</li>
            <li>**Drag and Drop** du Kanban Board géré par la mise à jour de l'état (Hook `useState`).</li>
            <li>Filtrage des utilisateurs en temps réel.</li>
          </ul>
        </section>
      </div>
    </section>
  );
};

export default AboutPage;