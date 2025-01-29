import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ locals }) => {
        const { pb } = locals;

        // Check if the user is authenticated
        if (pb.authStore.isValid) {
            return redirect(303, '/'); // Redirect to home if already logged in
        }

        // Handle the OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            try {
                // Exchange the code for a token
                await pb.collection("users").authWithOAuth("facebook", { code });
                return redirect(303, '/'); // Redirect after successful login
            } catch (error) {
                console.error("Error during Facebook login:", error);
                return {
                    status: 500,
                    body: {
                        errorMessage: 'An error occurred during login. Please try again.',
                    }
                };
            }
        }

        return {
            status: 400,
            body: {
                errorMessage: 'Invalid callback from Facebook.',
            }
        };
    }
};
