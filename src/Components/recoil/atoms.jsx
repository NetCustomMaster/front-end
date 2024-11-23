// recoil/atoms.ts
import { atom, selector } from 'recoil';

export const activeInputAtom = atom({
    key: 'activeInput',
    default: {
        fieldName: null,
        value: '',
        setValue: null,
    },
});

export const showKeyboardAtom = atom({
    key: 'showKeyboardAtom',
    default: true,
});

export const urlAtom = atom({
    key:"urlAtom",
    default:import.meta.env.VITE_APP_URL
})




// 시스템 정보 상태 atom
export const systemInfoState = atom({
    key: 'systemInfoState',
    default: {
        cpuUsage: '',
        memoryUsage: '',
        connectedDevices: [],
    },
});

// 인터넷 연결 상태 atom
export const isConnectedState = atom({
    key: 'isConnectedState',
    default: true,
});

// 에러 상태 atom
export const errorState = atom({
    key: 'errorState',
    default: null,
});

// 인터넷 속도 상태 atom
export const internetSpeedState = atom({
    key: 'internetSpeedState',
    default: '',
});

// EventSource를 통해 시스템 리소스 정보를 받아오는 selector
export const systemInfoSelector = selector({
    key: 'systemInfoSelector',
    get: async ({ get }) => {
        try {
            const eventSource = new EventSource(`${import.meta.env.VITE_APP_URL}/api/v1/state/resource`);
            return new Promise((resolve, reject) => {
                eventSource.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        resolve({
                            cpuUsage: data.cpuUsage,
                            memoryUsage: data.memoryUsage,
                            connectedDevices: data.connectedDevices,
                        });
                    } catch (error) {
                        reject(`Error parsing data: ${error.message}`);
                    }
                };

                eventSource.onerror = () => {
                    reject('Connection error');
                };
            });
        } catch (error) {
            throw new Error(`Error fetching system info: ${error.message}`);
        }
    },
});

// 인터넷 속도 데이터를 가져오는 selector
export const internetSpeedSelector = selector({
    key: 'internetSpeedSelector',
    get: async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/v1/state/speed`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.internetSpeed;
        } catch (error) {
            throw new Error(`Error fetching internet speed: ${error.message}`);
        }
    },
});
