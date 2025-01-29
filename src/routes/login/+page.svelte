<script>
	import { createEventDispatcher } from 'svelte';
	export let form;
	const dispatch = createEventDispatcher();
	let loading = false;
	let errorMessage = '';
	let showAlert = false;

	let email = '';
	let password = '';

	async function handleLogin(event) {
		event.preventDefault();
		loading = true;
		errorMessage = '';
		showAlert = false;
		const form = new FormData();
		form.append('email', email);
		form.append('password', password);

		try {
			const response = await fetch('/login?/login', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
				},
				body: form
			});

			const result = await response.json();

			if (response.ok) {
				const data = result;
				console.log('Login successful:', data);
				dispatch('loginSuccess', { user: data.user });
				window.location.href = '/login';
			} else {
				errorMessage = result.errorMessage || 'Invalid email or password.';
				showAlert = true;
			}
		} catch (error) {
			console.error('Error during login:', error);
			errorMessage = 'An unexpected error occurred. Please try again later.';
			showAlert = true;
		} finally {
			loading = false;
		}
	}

	const redirectToFacebook = () => {
		window.location.href = `${import.meta.env.VITE_PB_URL}/api/collections/users/auth/facebook`;
	};
</script>

<div class="flex items-center justify-center min-h-screen">
	<div class="login-card rounded-lg shadow-lg p-8">
		<h2 class="text-2xl font-bold text-center mb-6">เข้าสู่ระบบ</h2>
		<form on:submit={handleLogin}>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="email"> Email </label>
				<input
					type="email"
					id="email"
					bind:value={email}
					placeholder="ใส่อีเมล"
					class="input input-bordered w-full"
					required
				/>
			</div>
			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="password"> Password </label>
				<input
					type="password"
					id="password"
					bind:value={password}
					placeholder="ใส่รหัสผ่าน"
					class="input input-bordered w-full"
					required
				/>
			</div>
			{#if showAlert}
				<div role="alert" class="alert alert-error mt-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 shrink-0 stroke-current"
						fill="none"
						viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span>{errorMessage || 'Error! Task failed successfully.'}</span>
				</div>
			{/if}
			<div class="flex items-center justify-between">
				<button type="submit" class="btn btn-primary w-full" disabled={loading}>
					{#if loading}
						Loading...
					{:else}
						เข้าสู่ระบบ
					{/if}
				</button>
			</div>
			<div class="flex items-center justify-between mt-4">
				<a href="/" class="link text-sm text-blue-500 hover:underline"> ลืมรหัสผ่าน </a>
				<a href="/register" class="link text-sm text-blue-500 hover:underline"> ลงทะเบียน </a>
			</div>
			
			
		</form>
		<form class="flex flex-col items-center space-y-6 w-full max-w-sm pt-6" method="post" action="?/OAuth">
			<button type="submit" class="btn btn-secondary mb-4">
				Login with Facebook
			</button>
		</form>
	</div>
</div>

<style>
	.login-card {
		max-width: 400px;
		margin: 0 auto;
	}

	.alert {
		padding: 10px;
		border-radius: 5px;
	}

	.alert-error {
		background-color: #f8d7da;
		color: #721c24;
		border-color: #f5c6cb;
	}
</style>
