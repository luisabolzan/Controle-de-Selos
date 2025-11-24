
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


export const getAllSolicitations = async () => {
    try {
        const response = await fetch(`${API_URL}/solicitations`, {
            method: REQUEST_METHODS.GET,
            headers: DEFAULT_HEADERS,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const result = await response.json();
        
        // O backend retorna um objeto { success: true, data: [...] }
        // É uma boa prática retornar apenas os dados para o componente
        if (result.success) {
            return result.data;
        } else {
            // Se o backend responder com success: false, trata como um erro
            throw new Error(result.message || 'Failed to fetch solicitations');
        }

    } catch (error) {
        console.error('Error fetching solicitations:', error);
        throw error;
    }
};

export const updateSolicitationStatus = async (id: number, approval: boolean) => {

    const parsedId = Number(id);

    const data = { 
        approval: approval,
     };

     console.log(data);
     console.log(`${API_URL}/solicitations/${parsedId}`);

    try {
        const response = await fetch(`${API_URL}/solicitations/${parsedId}`, {
            method: REQUEST_METHODS.PATCH,
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating solicitation status:', error);
        throw error;
    }
};

export const authenticateUser = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await fetch(`${API_URL}/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData, 
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Falha na autenticação');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};