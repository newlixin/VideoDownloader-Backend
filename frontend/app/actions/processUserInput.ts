'use server'

import {redirect} from 'next/navigation'

export async function processUserInput(formData: FormData) {
    const userInput = formData.get('userInput')?.toString() || ''
    console.log("userInput:", userInput)
    
    // Encode the URL to make it safe for use in a URL path
    const encodedUrl = encodeURIComponent(userInput);
    
    // Redirect to the download page with the URL as a parameter
    return redirect(`/download/${encodedUrl}`);
}