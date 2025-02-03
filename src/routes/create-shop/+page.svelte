<script>
	import { goto } from '$app/navigation'; // Updated import path
	let username = ''; // Variable to hold the username
	let shopName = ''; // Variable to hold the shopName
	let shopDetails = ''; // Variable to hold the shopDetails
	let version = ''; // Variable to hold the version
	let errorMessage = ''; // Variable to hold the error message
	let showAlert = false; // Variable to control alert visibility

	async function createInstance() {
		const response = await fetch('../api/create-shop', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ shopName, shopDetails })
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
					<h1>เปิดร้านค้า</h1>
				</article>
				<div class="mb-4">
					<label for="username" class="mb-2 block text-sm font-bold">ชื่อร้านค้า</label>
					<input
						type="text"
						id="shopName"
						bind:value={shopName}
						class="input input-bordered w-full"
						required
						on:input={event => {
							// Remove any character that is not a letter or number
							shopName = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
						}}
					/>
				</div>
				<div class="mb-4">
					<label for="username" class="mb-2 block text-sm font-bold">รายละเอียดร้านค้า</label>
					<input
						type="text"
						id="shopDetails"
						bind:value={shopDetails}
						class="input input-bordered w-full"
						required
						on:input={event => {
							// Remove any character that is not a letter or number
							shopDetails = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
						}}
					/>
				</div>


				<form class="mt-6" on:submit|preventDefault={createInstance}>
					<div class="mb-4">
						<label for="region" class="mb-2 block text-sm font-bold">จังหวัด</label>
						<select id="region" class="select select-bordered w-full" required>
							<option value="us-east">กรุงเทพมหานคร</option>
						</select>
					</div>
					<!-- <div class="mb-4">
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
						
						</select>
					  </div> -->
					 
						<button type="submit" class="btn btn-facebook mb-4">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-2">
								<path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
							</svg>
							เชื่อมต่อกับเพจบน Facebook
						</button>
				
					
					<button type="submit" class="btn btn-primary">เปิดร้านค้า</button>
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

	.btn-facebook {
		background-color: #3b5998; /* Facebook blue */
		color: white;
		border: none;
		padding: 10px 20px;
		font-size: 16px;
		border-radius: 5px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.btn-facebook:hover {
		background-color: #2d4373; /* Darker blue on hover */
	}

	.btn-facebook:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(59, 89, 152, 0.5);
	}

	.w-6 {
		width: 24px;
		height: 24px;
	}

	.mr-2 {
		margin-right: 8px;
	}
</style>
