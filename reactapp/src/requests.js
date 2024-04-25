import axios from "axios";
import settings from "./settings";

const requests = axios.create();
requests.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'
requests.defaults.headers.post['Content-Type'] = 'application/json'
requests.interceptors.request.use(
    async config => {
        config.headers = {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json',
        }
        config.baseURL = settings.base_url;
        return config;
    },
    error => {
        Promise.reject(error)
    });
requests.interceptors.response.use((response) => {
    return response
}, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        var access_token = await refreshAccessToken();

        if (access_token === true) {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('access');
            return requests(originalRequest);
        }
    }
    return Promise.reject(error);
});

async function refreshAccessToken() {
    let answer = false;
    let url = settings.base_url + "/api/users/login/token-refresh/";
    const data = {
        refresh: localStorage.getItem('refresh')
    };
    const instatnce = axios.create({
        headers: {
            'Accept': 'application/json',
        }
    });

    instatnce.post(url, data)
        .then((result) => {
            localStorage.setItem('access', result.data.access);
            answer = true;
        })
        .catch((error) => {
            localStorage.setItem('access', '')
            localStorage.setItem('refresh', '')
        })
    return answer
}

export default requests