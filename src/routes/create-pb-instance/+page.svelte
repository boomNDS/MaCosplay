<script>
	import { goto } from '$app/navigation'; // Updated import path
	let username = ''; // Variable to hold the username
	let version = ''; // Variable to hold the version
	let errorMessage = ''; // Variable to hold the error message
	let showAlert = false; // Variable to control alert visibility

	async function createInstance() {
		const response = await fetch('../api/create-instance', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, version })
		});

		if (response.ok) {
			const data = await response.json();
			console.log('Instance created:', data);
			// Redirect to the dashboard on success
			goto('/dashboard');
		} else {
			const errorData = await response.json();
			errorMessage = errorData.error; // Set the error message
			showAlert = true; // Show the alert on error
			console.error('Error creating instance:', errorMessage);
		}
	}
</script>

<section id="home" class="">
	<div class="flex min-h-screen items-center justify-center">
		<div class="login-card rounded-lg p-8 shadow-lg">
			<div class="container mx-auto p-6">
				<article class="prose">
					<h1>สร้าง PocketBase Instance</h1>
					<p>กรอกข้อมูลด้านล่างเพื่อสร้าง PocketBase instance ใหม่</p>
				</article>

				<form class="mt-6" on:submit|preventDefault={createInstance}>
					<div class="mb-4">
						<label for="region" class="mb-2 block text-sm font-bold">Region</label>
						<select id="region" class="select select-bordered w-full" required>
							<option value="us-east">Thailand</option>
						</select>
					</div>
					<div class="mb-4">
						<label for="version" class="mb-2 block text-sm font-bold">Select Version</label>
						<select id="version" class="select select-bordered w-full" bind:value={version} required>
						  <option value="0.24.3">0.24.3</option>
						  <option value="0.24.2">0.24.2</option>
						  <option value="0.24.1">0.24.1</option>
						  <option value="0.24.0">0.24.0</option>
						  <option value="0.23.12">0.23.12</option>
						  <option value="0.23.11">0.23.11</option>
						  <option value="0.23.10">0.23.10</option>
						  <option value="0.23.9">0.23.9</option>
						  <option value="0.23.8">0.23.8</option>
						  <option value="0.23.7">0.23.7</option>
						  <option value="0.23.6">0.23.6</option>
						  <option value="0.23.5">0.23.5</option>
						  <option value="0.23.4">0.23.4</option>
						  <option value="0.23.3">0.23.3</option>
						  <option value="0.23.2">0.23.2</option>
						  <option value="0.23.1">0.23.1</option>
						  <option value="0.23.0">0.23.0</option>
						  <option value="0.22.30">0.22.30</option>
						  <option value="0.22.29">0.22.29</option>
						  <option value="0.22.28">0.22.28</option>
						  <option value="0.22.27">0.22.27</option>
						  <!-- Add more versions as needed -->
						</select>
					  </div>
					<div class="mb-4">
						<label for="username" class="mb-2 block text-sm font-bold">ชื่อ Instance</label>
						<input
							type="text"
							id="username"
							bind:value={username}
							class="input input-bordered w-full"
							required
							on:input={event => {
								// Remove any character that is not a letter or number
								username = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
							}}
						/>
					</div>
					<button type="submit" class="btn btn-primary">สร้าง Instance</button>
					<div class="mb-4">
                    {#if showAlert}
						<div role="alert" class="alert alert-error">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{errorMessage || 'Error! Task failed successfully.'}</span>
						</div>
					{/if}
                </div>
				</form>
			</div>
		</div>
	</div>
</section>
