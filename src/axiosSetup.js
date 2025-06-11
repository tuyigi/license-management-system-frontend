import axios from "axios";

export function setupAxiosGlobalInterceptor(history) {
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.log("Redirecting to / due to 401"); // Optional debug
                localStorage.removeItem('accountData'); // Optional cleanup
                history.push('/'); // ✅ redirect to login at /
            }
            return Promise.reject(error);
        }
    );
}