import React, { createContext, useContext, useState } from 'react';

const KeyboardContext = createContext(undefined);

export const KeyboardProvider = ({ children }) => {
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [text, setText] = useState('');
    const [activeInput, setActiveInput] = useState(null);

    const openKeyboard = () => setShowKeyboard(true);
    const closeKeyboard = () => setShowKeyboard(false);


    return (
      <KeyboardContext.Provider value={{
          showKeyboard, text, setText, activeInput, setActiveInput, openKeyboard, closeKeyboard }}>
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
