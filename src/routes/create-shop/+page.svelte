<script>
	import { goto } from '$app/navigation'; // Updated import path
	let username = ''; // Variable to hold the username
	let shopName = ''; // Variable to hold the shopName
	let shopDetails = ''; // Variable to hold the shopDetails
	let slug = ''; // New variable for slug
	let version = ''; // Variable to hold the version
	let errorMessage = ''; // Variable to hold the error message
	let showAlert = false; // Variable to control alert visibility
	let region = ''; // Add region variable
	let baseUrl = 'https://macosplay.com/store/'; // Base URL for the store

	function generateSlug(name) {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9-]+/g, '-') // Allow hyphens and replace other non-alphanumeric characters with hyphens
			.replace(/^-+|-+$/g, ''); // Remove leading or trailing hyphens
	}

	async function createInstance() {
		const response = await fetch('/api/create-shop', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ shopName, shopDetails, region, slug }) // Include slug
		});

		if (response.ok) {
			const data = await response.json();
			console.log('Instance created:', data);
			// Redirect to the dashboard on success
			goto('/manage-store');
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
					<label for="shopName" class="mb-2 block text-sm font-bold">ชื่อร้านค้า</label>
					<input
						type="text"
						id="shopName"
						bind:value={shopName}
						class="input input-bordered w-full"
						required
						on:input={event => {
							// Allow letters, numbers, and spaces
							shopName = event.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
							slug = generateSlug(shopName); // Generate slug from shop name
						}}
					/>
				</div>
				<div class="mb-4">
					<label for="shopDetails" class="mb-2 block text-sm font-bold">รายละเอียดร้านค้า</label>
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
				<div class="mb-4">
					<label for="slug" class="mb-2 block text-sm font-bold">ตั้ง url ร้านค้า</label>
					<input
						type="text"
						id="slug"
						bind:value={slug}
						class="input input-bordered w-full"
						required
						on:input={event => {
							// Allow letters, numbers, and hyphens
							slug = event.target.value.replace(/[^a-zA-Z0-9-]/g, '');
						}}
					/>
					<p class="text-sm mt-2 text-gray-500 break-all">{baseUrl}{slug}</p>
				</div>
				<form class="mt-6" on:submit|preventDefault={createInstance}>
					<div class="mb-4">
						<label for="region" class="mb-2 block text-sm font-bold">จังหวัด</label>
						<select id="region" class="select select-bordered w-full" bind:value={region} required>
							<option value="">เลือกจังหวัด</option>
							<option value="กระบี่">กระบี่</option>
							<option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
							<option value="กาญจนบุรี">กาญจนบุรี</option>
							<option value="กาฬสินธุ์">กาฬสินธุ์</option>
							<option value="กำแพงเพชร">กำแพงเพชร</option>
							<option value="ขอนแก่น">ขอนแก่น</option>
							<option value="จันทบุรี">จันทบุรี</option>
							<option value="ฉะเชิงเทรา">ฉะเชิงเทรา</option>
							<option value="ชลบุรี">ชลบุรี</option>
							<option value="ชัยนาท">ชัยนาท</option>
							<option value="ชัยภูมิ">ชัยภูมิ</option>
							<option value="ชุมพร">ชุมพร</option>
							<option value="เชียงราย">เชียงราย</option>
							<option value="เชียงใหม่">เชียงใหม่</option>
							<option value="ตรัง">ตรัง</option>
							<option value="ตราด">ตราด</option>
							<option value="ตาก">ตาก</option>
							<option value="นครนายก">นครนายก</option>
							<option value="นครปฐม">นครปฐม</option>
							<option value="นครพนม">นครพนม</option>
							<option value="นครราชสีมา">นครราชสีมา</option>
							<option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
							<option value="นครสวรรค์">นครสวรรค์</option>
							<option value="นนทบุรี">นนทบุรี</option>
							<option value="นราธิวาส">นราธิวาส</option>
							<option value="น่าน">น่าน</option>
							<option value="บึงกาฬ">บึงกาฬ</option>
							<option value="บุรีรัมย์">บุรีรัมย์</option>
							<option value="ปทุมธานี">ปทุมธานี</option>
							<option value="ประจวบคีรีขันธ์">ประจวบคีรีขันธ์</option>
							<option value="ปราจีนบุรี">ปราจีนบุรี</option>
							<option value="ปัตตานี">ปัตตานี</option>
							<option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
							<option value="พังงา">พังงา</option>
							<option value="พัทลุง">พัทลุง</option>
							<option value="พิจิตร">พิจิตร</option>
							<option value="พิษณุโลก">พิษณุโลก</option>
							<option value="เพชรบุรี">เพชรบุรี</option>
							<option value="เพชรบูรณ์">เพชรบูรณ์</option>
							<option value="แพร่">แพร่</option>
							<option value="ภูเก็ต">ภูเก็ต</option>
							<option value="มหาสารคาม">มหาสารคาม</option>
							<option value="มุกดาหาร">มุกดาหาร</option>
							<option value="แม่ฮ่องสอน">แม่ฮ่องสอน</option>
							<option value="ยโสธร">ยโสธร</option>
							<option value="ยะลา">ยะลา</option>
							<option value="ร้อยเอ็ด">ร้อยเอ็ด</option>
							<option value="ระนอง">ระนอง</option>
							<option value="ระยอง">ระยอง</option>
							<option value="ราชบุรี">ราชบุรี</option>
							<option value="ลพบุรี">ลพบุรี</option>
							<option value="ลำปาง">ลำปาง</option>
							<option value="ลำพูน">ลำพูน</option>
							<option value="เลย">เลย</option>
							<option value="ศรีสะเกษ">ศรีสะเกษ</option>
							<option value="สกลนคร">สกลนคร</option>
							<option value="สงขลา">สงขลา</option>
							<option value="สตูล">สตูล</option>
							<option value="สมุทรปราการ">สมุทรปราการ</option>
							<option value="สมุทรสงคราม">สมุทรสงคราม</option>
							<option value="สมุทรสาคร">สมุทรสาคร</option>
							<option value="สระแก้ว">สระแก้ว</option>
							<option value="สระบุรี">สระบุรี</option>
							<option value="สิงห์บุรี">สิงห์บุรี</option>
							<option value="สุโขทัย">สุโขทัย</option>
							<option value="สุพรรณบุรี">สุพรรณบุรี</option>
							<option value="สุราษฎร์ธานี">สุราษฎร์ธานี</option>
							<option value="สุรินทร์">สุรินทร์</option>
							<option value="หนองคาย">หนองคาย</option>
							<option value="หนองบัวลำภู">หนองบัวลำภู</option>
							<option value="อ่างทอง">อ่างทอง</option>
							<option value="อำนาจเจริญ">อำนาจเจริญ</option>
							<option value="อุดรธานี">อุดรธานี</option>
							<option value="อุตรดิตถ์">อุตรดิตถ์</option>
							<option value="อุทัยธานี">อุทัยธานี</option>
							<option value="อุบลราชธานี">อุบลราชธานี</option>
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
					 
						<button type="submit" class="btn btn-facebook mb-4" disabled>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-2">
								<path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
							</svg>
							เชื่อมต่อกับเพจบน Facebook
						</button>
				
					
					<button type="submit" class="w-full btn btn-neutral">เปิดร้านค้า</button>
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

	.btn-facebook:disabled {
		background-color: #d3d3d3; /* Light gray */
		color: #a9a9a9; /* Darker gray for text */
		cursor: not-allowed;
	}

	.w-6 {
		width: 24px;
		height: 24px;
	}

	.mr-2 {
		margin-right: 8px;
	}

	.text-gray-500 {
		color: #6b7280; /* Tailwind CSS gray-500 color */
	}

	.break-all {
		word-break: break-all; /* Ensures long URLs wrap properly */
	}

	@media (max-width: 640px) {
		.text-sm {
			font-size: 0.875rem; /* Responsive font size for small screens */
		}
	}
</style>
