import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    systemInfoState,
    errorState,
    isConnectedState,
    urlAtom,
} from '../src/Components/recoil/atoms';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5초

const useSystemInfoSSE = () => {
    const [, setSystemInfo] = useRecoilState(systemInfoState);
    const [, setIsConnected] = useRecoilState(isConnectedState);
    const [, setError] = useRecoilState(errorState);
    const url = useRecoilValue(urlAtom);

    useEffect(() => {
        let eventSource;
        let retryCount = 0;
        let timerId;

        const createEventSource = () => {
            if (retryCount >= MAX_RETRIES) {
                setError('연결 재시도 횟수 초과. 페이지를 새로고침해주세요.');
                return;
            }

            eventSource = new EventSource(`${url}/api/v1/state/resource`);

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    const formattedData = {
                        ...data,
                        cpuUsage: data.cpuUsage.replace('%', ''),
                    };
                    console.log("eventData", formattedData);
                    setSystemInfo(formattedData);
                    setError(null);
                    setIsConnected(true);
                    retryCount = 0; // 성공하면 재시도 카운트 초기화
                } catch (e) {
                    setError('Error parsing data: ' + e.message);
                }
            };

            eventSource.onerror = () => {
                console.error(`연결 실패. ${retryCount + 1}번째 재시도 중...`);
                setIsConnected(false);
                setError(`서버 연결 실패. ${retryCount + 1}번째 재시도 중...`);
                eventSource.close();
                retryCount++;
                timerId = setTimeout(createEventSource, RETRY_DELAY);
            };

            return eventSource;
        };

        const source = createEventSource();

        return () => {
            if (source) {
                source.close();
            }
            clearTimeout(timerId);
        };
    }, [url]);
};

export default useSystemInfoSSE;