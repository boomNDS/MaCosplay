import { redirect } from "@sveltejs/kit";

export const GET = async ({ url, cookies, locals }) => {
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    if (!state || !code || state !== cookies.get("state")) {
        return {
            status: 400,
            body: { error: "Invalid OAuth state or missing code." }
        };
    }

    try {
        const { token } = await locals.pb.collection("users").authWithOAuth2Code("facebook", code, cookies.get("verifier"));

        cookies.delete("state");
        cookies.delete("verifier");

        throw redirect(303, "/"); // Redirect on successful login
    } catch (err) {
        console.error("OAuth login error:", err);
        return {
            status: 500,
            body: { error: "Failed to authenticate with Facebook." }
        };
    }
};
