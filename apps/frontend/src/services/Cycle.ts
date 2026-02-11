const BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8080';

export const getCycleConfig = async(userId: string) => {
    const fetchResult = await fetch(`${BASE_URL}/user/${userId}/cycle-config`);

    const jsonResult = await fetchResult.json();

    console.log(jsonResult);
    return jsonResult;
}

export const createNewCycle = async(userId: string, type: 'default' | 'learning') => {
    const fetchResult = await fetch(`${BASE_URL}/user/${userId}/cycle/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type
        })
    });

    const jsonResult = await fetchResult.json();
    console.log(jsonResult);
    return jsonResult;
}

export const registerNewEvent = async(userId: string, cycleId: string, event: 'heartbeat' | 'pause' | 'unpause' | 'end') => {

    const fetchResult = await fetch(`${BASE_URL}/user/${userId}/cycle/${cycleId}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: event
        })
    });

    const jsonResult = await fetchResult.json();
    console.log(jsonResult);
    return jsonResult;
}