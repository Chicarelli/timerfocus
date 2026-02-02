const BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8080';

export const CycleConfig = async(userId: string) => {
    const fetchResult = await fetch(`${BASE_URL}/user/${userId}/cycle-config`);

    const jsonResult = await fetchResult.json();

    console.log(jsonResult);
    return jsonResult;
}