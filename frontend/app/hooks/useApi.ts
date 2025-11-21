import api from "../api/axios";

export function useApi() {
    return {
        get: api.get,
        post: api.post,
        put: api.put,
        delete: api.delete,
    };
}