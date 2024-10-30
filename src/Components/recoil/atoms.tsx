// recoil/atoms.ts
import { atom } from 'recoil';

export const activeInputAtom = atom<string | null>({
    key: 'activeInput',
    default: null,
});


export const showKeyboardAtom = atom({
    key: 'showKeyboardAtom',
    default: true,
});