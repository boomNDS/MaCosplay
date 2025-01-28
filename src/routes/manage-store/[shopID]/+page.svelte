<script lang="ts">
    import { goto } from '$app/navigation'; // Updated import path
	let username = ''; // Variable to hold the username
	let Name = ''; // Variable to hold the Name
	let Details = ''; // Variable to hold the Details
	let version = ''; // Variable to hold the version
	let errorMessage = ''; // Variable to hold the error message
	let showAlert = false; // Variable to control alert visibility
	let clothingSize = ''; // New variable for clothing size
	let selectedRegion = ''; // Variable to hold the selected province
	let searchQuery = ''; // Variable to hold the search input
	const provinces = [
		"กรุงเทพมหานคร",
		"เชียงใหม่",
		"ภูเก็ต",
		"ชลบุรี",
		"นครราชสีมา",
		"พระนครศรีอยุธยา",
		"เชียงราย",
		"ขอนแก่น",
		"สงขลา",
		"นครปฐม",
		"อุดรธานี",
		// Add more provinces as needed
	];

	async function createInstance() {
		const response = await fetch('../api/create-item', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ Name, Details, clothingSize, selectedRegion })
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
    export let data: { itemList: any[] }; // Define data type
    console.log(data?.itemList)
</script>

	


<section id="home" class="flex items-center justify-center min-h-screen">
	<div class="container mx-auto w-full p-4 sm:p-6 flex flex-col items-center">
        <div class="flex flex-col sm:flex-row sm:space-x-2 w-full items-center justify-center">
           
                <img src="/images/Example/Cosshop.png" alt="cosshop" class="w-full h-auto object-cover">

        </div>
        
        <h2 class="text-center mt-4 text-lg sm:text-xl">{data?.itemList.Name}</h2>
        <p class="text-center text-sm sm:text-base">Example shop</p>
    </div>
</section>





<section id="features">
    <div class="container mx-auto p-4 sm:p-6">
        <!-- Pocketbase Rental Card -->
        <section class="mb-6">
            <h2 class="mb-2 text-2xl font-semibold">จัดการสินค้า</h2>
        </section>
        <button class="btn btn-primary mb-4" on:click={() => my_modal_5.showModal()}>+ เพิ่มสินค้า</button>
        
        <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <div class="login-card rounded-lg p-8">
                <div class="container mx-auto p-6">
                    <article class="prose">
                        <h1>เพิ่มสินค้า</h1>
                    </article>
                    <div class="mb-4">
                        <label for="username" class="mb-2 block text-sm font-bold">ชื่อสินค้า</label>
                        <input
                            type="text"
                            id="Name"
                            bind:value={Name}
                            class="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div class="mb-4">
                        <label for="username" class="mb-2 block text-sm font-bold">รายละเอียดร้านค้า</label>
                        <input
                            type="text"
                            id="Details"
                            bind:value={Details}
                            class="input input-bordered w-full"
                            required
                        />
                    </div>
    
                    <!-- New Select for Clothing Size -->
                    <div class="mb-4">
                        <label for="clothingSize" class="mb-2 block text-sm font-bold">ขนาดเสื้อผ้า</label>
                        <select
                            id="clothingSize"
                            bind:value={clothingSize}
                            class="input input-bordered w-full"
                            required
                        >
                            <option value="">เลือกขนาด</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                            <!-- Add more sizes as needed -->
                        </select>
                    </div>
    
                    <div class="mb-4">
                        <label for="region" class="mb-2 block text-sm font-bold">จังหวัด</label>
                        <div class="dropdown">
                            <input
                                type="text"
                                placeholder="ค้นหาจังหวัด"
                                class="input input-bordered w-full mb-2 dropdown-toggle"
                                bind:value={searchQuery}
                                on:focus={() => { document.getElementById('dropdown-menu').classList.remove('hidden'); }}
                                on:blur={() => { setTimeout(() => { document.getElementById('dropdown-menu').classList.add('hidden'); }, 200); }} 
                            />
                            <ul id="dropdown-menu" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full hidden">
                                {#each provinces.filter(province => province.includes(searchQuery)) as province}
                                    <li>
                                        <a 
                                            href="#" 
                                            on:click={() => { selectedRegion = province; searchQuery = province; }}
                                        >
                                            {province}
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    </div>
    
                    <form class="mt-6" on:submit|preventDefault={createInstance}>
                        <button type="submit" class="btn btn-primary">เพิ่มสินค้า</button>
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
        </dialog>
    
    </div>
</section>



