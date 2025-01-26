import { redirect } from "@sveltejs/kit";

export const load = ({ locals }) => {
	if (locals.pb?.authStore.isValid) {
		redirect(303, '/');
	}
};

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		try {
			await locals.pb.collection("users").authWithPassword(formData.get('email'), formData.get('password'));

			// Check if the user is verified
			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();
				return {
					status: 401, // Unauthorized
					body: {
						notVerified: true,
						errorMessage: 'Your account is not verified. Please check your email for the verification link.',
					}
				};
			}

			// Successful login, redirect to home
			throw redirect(303, '/'); // Redirect after successful login
		} catch (err) {
			console.error("Error during login:", err?.data?.message);

			// Handle invalid credentials
			if (err?.data?.message) {
				return {
					status: 401, // Unauthorized
					body: {
						invalidCredentials: true,
						errorMessage: err.data.message || 'Invalid email or password.',
					}
				};
			}
			return {
				status: 500, // Internal Server Error
				body: {
					errorMessage: 'An unexpected error occurred. Please try again later.',
				}
			};
		}
	}
};
