export const useApi = () => {

    const makeRequest = async (endpoint, options = {}) => {
        console.log("makeRequest:", endpoint)
        const defaultOptions = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
            ...defaultOptions,
            ...options,
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            if (response.status === 429) {
                throw new Error("Daily quota exceeded")
            }
            throw new Error(errorData.detail || "API request failed")
        }

        return  response.json()
    }
    return {makeRequest};
}