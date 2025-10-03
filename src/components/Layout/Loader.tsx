// src/components/Layout/Loader.tsx
import React from 'react';

// Définition des props
interface LoaderProps {
    message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Chargement des données..." }) => (
    <div id="loader" className="loader">
        {message}
    </div>
);

export default Loader;