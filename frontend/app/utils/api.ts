// export const useApi = () => {

//     const makeRequest = async (endpoint: string, options = {}) => {
//         console.log("makeRequest:", endpoint)
//         const defaultOptions = {
//             headers: {
//                 "Content-Type": "application/json"
//             },
//         }

//         const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
//             ...defaultOptions,
//             ...options,
//         })

//         if (!response.ok) {
//             const errorData = await response.json().catch(() => null)
//             throw new Error(errorData.detail || "API request failed")
//         }

//         return  await response.json()
//     }
//     return {makeRequest}
// }

export async function makeRequest(endpoint: string, options = {}) {
    console.log("makeRequest:", endpoint, options)
    const defaultOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    }

    const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
        ...defaultOptions,
        ...options,
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData.detail || "API request failed")
    }

    return  await response.json()
}
