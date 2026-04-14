import { apiFetch } from '../../../utils/api';

export const getMajors = async () => {
    return apiFetch('/metadata/majors', {
        method: 'GET',
    });
};

export const getTags = async () => {
    return apiFetch('/metadata/tags', {
        method: 'GET',
    });
};
