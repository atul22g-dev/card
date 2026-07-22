import { useEffect, useState, useCallback } from 'react';
import { statusService } from '../appwrite/health';

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
                data: {
                    database: 'disconnected',
                    db_Name: '',
                    ping: 'error',
                    uptime: 0,
                    uptime_hours: '0.00',
                    collections: 0,
                    documents: 0,
                    indexes: 0,
                    data_size: '0.00 MB',
                    storage_size: '0.00 MB',
                },
            });
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return JSON.stringify(jsonData, null, 2);
};

export default ApiStatus;
