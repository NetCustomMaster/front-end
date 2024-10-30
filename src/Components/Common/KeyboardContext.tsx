// KeyboardContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface KeyboardContextType {
    showKeyboard: boolean;
    text: string;
    activeInput: string | null;
    setText: (value: string) => void;
    setActiveInput: (input: string | null) => void;
    openKeyboard: () => void;
    closeKeyboard: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [text, setText] = useState('');
    const [activeInput, setActiveInput] = useState<string | null>(null);

    const openKeyboard = () => setShowKeyboard(true);
    const closeKeyboard = () => setShowKeyboard(false);

    return (
        <KeyboardContext.Provider value={{ showKeyboard, text, setText, activeInput, setActiveInput, openKeyboard, closeKeyboard }}>
            {children}
        </KeyboardContext.Provider>
    );
};

export const useKeyboard = () => {
    const context = useContext(KeyboardContext);
    if (!context) {
        throw new Error('useKeyboard must be used within a KeyboardProvider');
    }
    return context;
};
