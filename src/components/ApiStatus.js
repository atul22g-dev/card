import { useEffect, useState, useCallback } from 'react';
import { statusService, EMPTY_STATUS_DATA } from '../appwrite/health';

const ApiStatus = () => {
    const [jsonData, setJsonData] = useState(null);

    const fetchStatus = useCallback(async () => {
        try {
            const result = await statusService.getStatus();
            setJsonData(result);
        } catch (err) {
            setJsonData({
                status: 'error',
                message: err.message || 'Failed to fetch status',
                data: { ...EMPTY_STATUS_DATA },
            });
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return JSON.stringify(jsonData, null, 2);
};

export default ApiStatus;
