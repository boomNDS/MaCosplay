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
			// Refresh the page on success
			location.reload(); // This will refresh the current page
		} else {
			const errorData = await response.json();
			errorMessage = errorData.error; // Set the error message
			showAlert = true; // Show the alert on error
			console.error('Error creating instance:', errorMessage);
		}
	}
    export let data: { StoreDetails: any[], itemList: any[] }; // Define data type

    let selectedProvince = ''; // State to hold the selected province
    let selectedSize = ''; // State to hold the selected size


    // Function to filter items based on the selected province and size
    const filteredItems = () => {
        return data.itemList.filter(item => {
            const matchesProvince = !selectedProvince || item.Province === selectedProvince;
            const matchesSize = !selectedSize || item.Size === selectedSize;
            return matchesProvince && matchesSize; // Return items that match both filters
        });
    };

    console.log(data?.StoreDetails);

    // Helper function to limit text length
    const limitText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };
    console.log(data?.StoreDetails)
</script>

	


<section id="home" class="flex items-center justify-center min-h-screen">
	<div class="container mx-auto w-full p-4 sm:p-6 flex flex-col items-center">
        <div class="flex flex-col sm:flex-row sm:space-x-2 w-full items-center justify-center">
           
                <img src="/images/Example/Cosshop.png" alt="cosshop" class="w-full h-auto object-cover">

        </div>
        
        <h2 class="text-center mt-4 text-lg sm:text-xl">{data?.StoreDetails.Name}</h2>
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


<section id="features" class="pt-12 sm:pt-12 md:pt-14">
    <div class="container mx-auto p-4 sm:p-6">
        <!-- Pocketbase Rental Card -->
        <section class="mb-6">
            <h2 class="mb-2 text-2xl font-semibold">ตามหาชุดเช่าได้ที่นี่เลย</h2>
        </section>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[48rem] overflow-y-auto"> <!-- Limit to 4 rows -->
            {#if filteredItems().length > 0}
                {#each filteredItems() as item}
                    <div class="card bg-base-100 shadow-xl">
                        <figure>
                            <img 
                                src={`https://macosplay.saas.in.th/api/files/mxj3660ce5olheb/${item.id}/${item.Image}`} 
                                alt="{item.Name} Thumbnail" 
                                class="w-full h-auto max-h-48 object-cover" 
                            />
                        </figure>
                        <div class="card-body">
                            <div class="flex justify-between items-center">
                                <div class="avatar mb-2">
                                    <div class="w-8 h-8 rounded-full overflow-hidden">
                                        {#if item.user && item.expand?.user?.avatar}
                                            <img src={`https://macosplay.saas.in.th/api/files/_pb_users_auth_/${item.expand?.user?.id}/${item.expand?.user?.avatar}`} alt="Avatar" class="w-full h-full object-cover" />
                                        {:else}
                                            <img src="/path/to/fallback-avatar.png" alt="Fallback Avatar" class="w-full h-full object-cover" />
                                        {/if}
                                    </div>
                                </div>
                                <div class="badge {item.expand?.user?.VerifyShop === 'ยืนยันร้านค้าแล้ว' ? 'badge-primary badge-outline' : item.expand?.user?.VerifyShop === 'ยังไม่ได้ยืนยันร้านค้า'} gap-2">
                                    
                                    {item.expand?.user?.VerifyShop}
                                </div>
                            </div>
                            
                            <div class="badge badge-neutral">{item.Province}</div>
                            <div class="badge badge-outline">Size: {item.Size}</div>
                            <div class="badge {item.Status === 'พร้อมให้เช่า' ? 'badge-success' : item.Status === 'กำลังถูกเช่า' ? 'badge-warning' : item.Status === 'อยู่ระหว่างการซ่อมบำรุง' ? 'badge-error' : ''} gap-2">
                                
                                {item.Status}
                            </div>
                            <h2 class="card-title">{limitText(item.Name, 33)}</h2>
                            <p>{item.Details}</p>
                            <p class="font-bold">ราคา: {item.price.toLocaleString()} บาท</p>
                            <div class="rating mb-2">
                                <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                <input
                                  type="radio"
                                  name="rating-2"
                                  class="mask mask-star-2 bg-orange-400"
                                  checked="checked" />
                                <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                              </div>
                            <div class="card-actions justify-end">
                                <button class="btn btn-neutral btn-active">
                                    <a href={item.Details} target="_blank">ดูรายละเอียด</a>
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            {:else}
                <div class="card w-full sm:w-96 bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">ไม่เจอร้านค้า</h2>
                        <p>ไม่พบข้อมูลชุดเช่าในขณะนี้</p>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</section>

