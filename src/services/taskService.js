// import api from './api';

export const getTasks = async () => {
    // Placeholder fetch
    return new Promise((resolve) => setTimeout(() => resolve([]), 500));
};

export const updateTask = async (id, data) => {
    return new Promise((resolve) => setTimeout(() => resolve({ id, ...data }), 500));
};

export const deleteTask = async (id) => {
    console.log("Deleted task ID: ", id);
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
};
