export interface ApiResponse<T> {
  data: T;
  status: number;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return {
    data,
    status: response.status
  };
}

export const getCheckLists = async (): Promise<ApiResponse<any>> => {
  const response = await fetch(`/api/checklist`);
  return handleResponse(response);
};

export const getCheckListById = async (id: string): Promise<ApiResponse<any>> => {
  const response = await fetch(`/api/checklist/${id}`);
  return handleResponse(response);
};

export const createCheckList = async (): Promise<ApiResponse<any>> => {
  const response = await fetch(`/api/checklist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

export const updateCheckList = async (id: string, checkListData: any): Promise<ApiResponse<any>> => {
  const response = await fetch(`/api/checklist/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(checkListData)
  });
  return {
    data: null,
    status: response.status
  };
};

export const createCheckListItem = async (id: string, checkListData: any): Promise<ApiResponse<any>> => {
  const response = await fetch(`/api/checklist/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(checkListData)
  });
  return handleResponse(response);
};

export const updateCheckListItem = async (id: string, itemId: string, checkListData: any): Promise<ApiResponse<any>> => {
  const response = await fetch(`/api/checklist/${id}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(checkListData)
  });
  return {
    data: null,
    status: response.status
  };
};

export const deleteCheckListItem = async (id: string, itemId: string): Promise<ApiResponse<any>> => {
  const response = await fetch(`/api/checklist/${id}/${itemId}`, {
    method: 'DELETE'
  });
  return {
    data: null,
    status: response.status
  };
};
