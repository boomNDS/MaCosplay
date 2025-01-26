<script>
    let formData = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
    };
    let errorMessage = '';
    let showAlert = false;

    async function handleSubmit(event) {
        event.preventDefault();
        if (formData.password !== formData.passwordConfirm) {
            errorMessage = 'Passwords do not match.';
            showAlert = true;
            return;
        }

        const form = new FormData();
        form.append('name', formData.name);
        form.append('email', formData.email);
        form.append('password', formData.password);
        form.append('passwordConfirm', formData.passwordConfirm);

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: form,
            });

            if (response.ok) {
                // Redirect or clear the form
                formData = { name: '', email: '', password: '', passwordConfirm: '' };
                showAlert = false;
                alert('ลงทะเบียนสำเร็จโปรดยืนยันอีเมล');
		window.location.href = '/login';  // Redirect after login
            } else {
                const errorData = await response.json();
                if (errorData && errorData.errors) {
                    errorMessage = errorData.errors.general || 'Registration failed. Please try again.';
                    showAlert = true;

                    if (errorData.errors.username) errorMessage = errorData.errors.username;
                    if (errorData.errors.email) errorMessage = errorData.errors.email;
                    if (errorData.errors.password) errorMessage = errorData.errors.password;
                } else {
                    errorMessage = 'An unexpected error occurred. Please try again.';
                    showAlert = true;
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
            errorMessage = 'An unexpected error occurred. Please try again later.';
            showAlert = true;
        }
    }
</script>

<div class="flex items-center justify-center min-h-screen">
    <div class="login-card rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-center mb-6">ลงทะเบียน</h2>
        <form on:submit={handleSubmit} class="space-y-4">
            <div>
                <label for="name" class="block text-gray-700 text-sm font-bold mb-2">ชื่อ</label>
                <input type="text" id="name" bind:value={formData.name} class="input input-bordered w-full" required />
            </div>
            <div>
                <label for="email" class="block text-gray-700 text-sm font-bold mb-2">อีเมล</label>
                <input type="email" id="email" bind:value={formData.email} class="input input-bordered w-full" required />
            </div>
            <div>
                <label for="password" class="block text-gray-700 text-sm font-bold mb-2">รหัสผ่าน</label>
                <input type="password" id="password" bind:value={formData.password} class="input input-bordered w-full" required />
            </div>
            <div>
                <label for="passwordConfirm" class="block text-gray-700 text-sm font-bold mb-2">ยืนยันรหัสผ่าน</label>
                <input type="password" id="passwordConfirm" bind:value={formData.passwordConfirm} class="input input-bordered w-full" required />
            </div>
            <button type="submit" class="btn btn-primary w-full">ลงทะเบียน</button>
        </form>

        {#if showAlert}
            <div role="alert" class="alert alert-error mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
            </div>
        {/if}
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
