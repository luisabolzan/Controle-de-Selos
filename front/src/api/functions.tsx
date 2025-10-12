
const API_URL = 'http://127.0.0.1:8000/api';

const REQUEST_METHODS ={
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
}

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
};

export const createServiceTagRequest = async (data: { startDate: string; endDate: string; userId: number }) => {

    // Use the correct field names expected by the backend
    const requestData = {
        start_date: data.startDate,
        end_date: data.endDate,
        user_id: data.userId,
    }

    try {
        console.log("Verificando a URL da API:", API_URL);
        console.log(JSON.stringify(requestData));
        const response = await fetch(`${API_URL}/solicitations/service`, {
            method: REQUEST_METHODS.POST,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating service tag request:', error);
        throw error;
    }
};
