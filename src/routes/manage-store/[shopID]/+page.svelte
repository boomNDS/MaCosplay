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
    let editingItem = null;
    let fullImage = null;
    let pricingOption = 'price_only'; // Initialize with a default value
    let isPublic = true; // Default value for the public switch

    function openEditModal(item) {
        editingItem = { ...item }; // Create a copy of the item
        editImagePreview = ''; // Reset preview when opening modal
        isPublic = item.public; // Set the public status for editing
        console.log('Edit modal opened, public status:', editingItem.public); // Debugging: Check initial state
    }

    function handleCheckboxChange() {
        console.log('Checkbox changed, new public status:', editingItem.public); // Debugging: Track changes
    }

    async function handleEditSubmit(event) {
        const formData = new FormData(event.target);
        console.log('Before submit:', editingItem.public); // Debugging: Check value before submission

        // Set isPriTest based on pricingOption
        formData.append('isPriTest', pricingOption);
        console.log('pricingOption:', pricingOption); // Debugging: Log the pricingOption value
        // Add price_pri and price_test if pricingOption is 'price_pri_test'
        if (pricingOption === 'price_pri_test') {
            formData.append('price_pri', event.target.price_pri.value);
            formData.append('price_test', event.target.price_test.value);
        }

        try {
            const response = await fetch('/api/update-item', {
                method: 'PUT',
                body: formData
            });
            if (response.ok) {
				location.reload();
			} else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update item');
            }


            editingItem = null;
            // Optionally refresh the item list
        } catch (error) {
            console.error('Error updating item:', error);
            errorMessage = error.message;
            showAlert = true;
        }
    }
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

	async function createInstance(event) {
		const formData = new FormData(event.target);

        formData.append('userStore', data.StoreDetails.id);

        // Set isPriTest based on pricingOption
        formData.append('isPriTest', pricingOption === 'price_pri_test');
        console.log('pricingOption:', pricingOption); // Debugging: Log the pricingOption value

        // Add price_pri and price_test if pricingOption is 'price_pri_test'
        if (pricingOption === 'price_pri_test') {
            formData.append('price_pri', event.target.price_pri.value);
            formData.append('price_test', event.target.price_test.value);
        }

		try {
			const response = await fetch('/api/create-item', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				location.reload();
			} else {
				const errorData = await response.json();
				errorMessage = errorData.error;
				showAlert = true;
			}
		} catch (error) {
			console.error('Error creating instance:', error);
			errorMessage = error.message;
			showAlert = true;
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

    let createImagePreview = '';
    let editImagePreview = '';

    function previewImage(event, type) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (type === 'create') {
                    createImagePreview = e.target.result;
                } else {
                    editImagePreview = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        } else {
            if (type === 'create') {
                createImagePreview = '';
            } else {
                editImagePreview = '';
            }
        }
    }

    $: console.log('Current pricingOption:', pricingOption);
</script>

	


<section id="home" class="flex items-center justify-center">
	<div class="container mx-auto w-full p-4 sm:p-6 flex flex-col items-center">
        <div class="flex flex-col sm:flex-row sm:space-x-2 w-full items-center justify-center">
           
                <img src="/images/Example/Cosshop.png" alt="cosshop" class="w-full h-auto object-cover">

        </div>
        
        <h2 class="text-center mt-4 text-lg sm:text-xl">{data?.StoreDetails.Name}</h2>
        <p class="text-center text-sm sm:text-base">Example shop</p>
    </div>
</section>


<section id="stats" class="flex w-full items-center justify-center">
    <div class="stats shadow">
        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="stat-title">ผู้ชมร้านค้า</div>
          <div class="stat-value">0</div>
          <div class="stat-desc">Jan 1st - Feb 1st</div>
        </div>
      
        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
          </div>
          <div class="stat-title">ผู้ติดตามร้านค้า</div>
          <div class="stat-value">0</div>
          <div class="stat-desc">↗︎ 400 (22%)</div>
        </div>
      
        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
            </svg>
          </div>
          <div class="stat-title">จำนวนผู้ซื้อสินค้า</div>
          <div class="stat-value">0</div>
          <div class="stat-desc">0</div>
        </div>
      </div>

</section>



<section id="features">
    <div class="container mx-auto p-4 sm:p-6">
        <!-- Pocketbase Rental Card -->
        <section class="mb-6">
            <h2 class="mb-2 text-2xl font-semibold">จัดการสินค้า</h2>
        </section>
        <button class="btn btn-outline mb-4" on:click={() => my_modal_5.showModal()}>+ เพิ่มสินค้า</button>
        
        <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <div class="login-card rounded-lg p-8">
                <div class="container mx-auto p-6">
                    <article class="prose">
                        <h1>เพิ่มสินค้า</h1>
                    </article>
                    <form class="mt-6" on:submit|preventDefault={createInstance} enctype="multipart/form-data">
                        <!-- Product Name -->
                        <div class="mb-4">
                            <label for="name" class="mb-2 block text-sm font-bold">ชื่อสินค้า</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                class="input input-bordered w-full"
                                required
                            />
                        </div>

                        <!-- Product Details -->
                        <div class="mb-4">
                            <label for="details" class="mb-2 block text-sm font-bold">รายละเอียดสินค้า</label>
                            <input
                                type="text"
                                id="details"
                                name="details"
                                class="input input-bordered w-full"
                                required
                            />
                        </div>

                        <!-- Clothing Size -->
                        <div class="mb-4">
                            <label for="size" class="mb-2 block text-sm font-bold">ขนาดเสื้อผ้า</label>
                            <select
                                id="size"
                                name="size"
                                class="input input-bordered w-full"
                                required
                            >
                                <option value="">เลือกขนาด</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                        </div>

                        <!-- Province -->
                        <div class="mb-4">
                            <label for="province" class="mb-2 block text-sm font-bold">จังหวัด</label>
                            <select
                                id="province"
                                name="province"
                                class="input input-bordered w-full"
                                required
                            >
                                <option value="">เลือกจังหวัด</option>
                                <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                                <option value="เชียงใหม่">เชียงใหม่</option>
                                <option value="ภูเก็ต">ภูเก็ต</option>
                                <option value="ชลบุรี">ชลบุรี</option>
                                <option value="นครราชสีมา">นครราชสีมา</option>
                                <option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
                                <option value="เชียงราย">เชียงราย</option>
                                <option value="ขอนแก่น">ขอนแก่น</option>
                                <option value="สงขลา">สงขลา</option>
                                <option value="นครปฐม">นครปฐม</option>
                                <option value="อุดรธานี">อุดรธานี</option>
                                <!-- Add more provinces as needed -->
                            </select>
                        </div>


                        <!-- Status -->
                        <div class="mb-4">
                            <label for="status" class="mb-2 block text-sm font-bold">สถานะ</label>
                            <select
                                id="status"
                                name="status"
                                class="input input-bordered w-full"
                                required
                            >
                                <option value="">เลือกสถานะ</option>
                                <option value="พร้อมให้เช่า">พร้อมให้เช่า</option>
                                <option value="กำลังถูกเช่า">กำลังถูกเช่า</option>
                                <option value="ยังไม่พร้อม">ยังไม่พร้อม</option>
                            </select>
                        </div>

                        <!-- Image -->
                        <div class="mb-4">
                            <label for="image" class="mb-2 block text-sm font-bold">รูปภาพ</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                class="file-input file-input-bordered w-full"
                                on:change={(e) => previewImage(e, 'create')}
                            />
                            {#if createImagePreview}
                                <div class="mt-4">
                                    <img src={createImagePreview} alt="Image Preview" class="w-48 h-48 object-cover rounded-lg" />
                                </div>
                            {/if}
                        </div>

                        <!-- Pricing Option Selection -->
                        <div class="mb-4">
                            <label class="mb-2 block text-sm font-bold">เลือกตัวเลือกการตั้งราคา</label>
                            <div class="flex items-center space-x-4">
                                <label class="flex items-center">
                                    <input
                                        type="radio"
                                        name="pricing_option"
                                        value="price_only"
                                        bind:group={pricingOption}
                                        class="radio radio-primary"
                                    />
                                    <span class="ml-2">ใช้ราคาเท่านั้น</span>
                                </label>
                                <label class="flex items-center">
                                    <input
                                        type="radio"
                                        name="pricing_option"
                                        value="price_pri_test"
                                        bind:group={pricingOption}
                                        class="radio radio-primary"
                                    />
                                    <span class="ml-2">ใช้ราคาไพรหรือเทส</span>
                                </label>
                            </div>
                        </div>

                        <!-- Price -->
                        {#if pricingOption === 'price_only'}
                        <div class="mb-4">
                            <label for="price" class="mb-2 block text-sm font-bold">ราคา</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                class="input input-bordered w-full"
                                required
                            />
                        </div>
                        {/if}

                        <!-- Price Pri and Price Test -->
                        {#if pricingOption === 'price_pri_test'}
                        <div class="mb-4">
                            <label for="price_pri" class="mb-2 block text-sm font-bold">ราคาไพร</label>
                            <input
                                type="number"
                                id="price_pri"
                                name="price_pri"
                                class="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div class="mb-4">
                            <label for="price_test" class="mb-2 block text-sm font-bold">ราคาเทส</label>
                            <input
                                type="number"
                                id="price_test"
                                name="price_test"
                                class="input input-bordered w-full"
                                required
                            />
                        </div>
                        {/if}

                        <!-- Public Switch -->
                        <div class="mb-4">
                            <label class="mb-2 block text-sm font-bold">เปิดให้ผู้อื่นมองเห็นสินค้า</label>
                            <input
                                type="checkbox"
                                name="isPublic"
                                class="toggle"
                                bind:checked={isPublic}
                            />
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-primary">เพิ่มสินค้า</button>
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
            <h2 class="mb-2 text-2xl font-semibold">จัดการสินค้า</h2>
        </section>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[48rem] overflow-y-auto"> <!-- Limit to 4 rows -->
            {#if filteredItems().length > 0}
                {#each filteredItems() as item}
                    <div class="card bg-base-100 shadow-xl">
                        <figure>
                            <img 
                                src={`https://macosplay.saas.in.th/api/files/mxj3660ce5olheb/${item.id}/${item.Image}`} 
                                alt="{item.Name} Thumbnail" 
                                class="w-full h-auto max-h-48 object-cover cursor-pointer" 
                                on:click={() => fullImage = `https://macosplay.saas.in.th/api/files/mxj3660ce5olheb/${item.id}/${item.Image}`}
                            />
                        </figure>
                        <div class="card-body">
                            <div class="flex justify-between items-center">
                                <!-- <div class="avatar mb-2">
                                    <div class="w-8 h-8 rounded-full overflow-hidden">
                                        {#if item.expand?.user?.avatar}
                                            <img src={`https://macosplay.saas.in.th/api/files/_pb_users_auth_/${item.expand?.user?.id}/${item.expand?.user?.avatar}`} alt="Avatar" class="w-full h-full object-cover" />
                                        {:else}
                                            <img src="/path/to/fallback-avatar.png" alt="Fallback Avatar" class="w-full h-full object-cover" />
                                        {/if}
                                    </div>
                                </div> -->
                                <div class="badge {item.expand?.user?.VerifyShop === 'ยืนยันร้านค้าแล้ว' ? 'badge-primary badge-outline' : item.expand?.user?.VerifyShop === 'ยังไม่ได้ยืนยันร้านค้า'} gap-2">
                                    
                                    {item.expand?.user?.VerifyShop}
                                </div>
                            </div>
                            <h2 class="card-title">{limitText(item.Name, 33)}</h2>
                            
                            <div class="badge badge-neutral">{item.Province}</div>
                            <div class="badge badge-outline">Size: {item.Size}</div>
                            <div class="badge {item.Status === 'พร้อมให้เช่า' ? 'badge-success' : item.Status === 'กำลังถูกเช่า' ? 'badge-warning' : item.Status === 'อยู่ระหว่างการซ่อมบำรุง' ? 'badge-error' : ''} gap-2">
                                
                                {item.Status}
                            </div>
                            
                            <p>{item.Details}</p>
                            <p class="font-bold">
                                
                                {#if item.isPriTest}
                                ราคา: {item.price_pri.toLocaleString()} (ไพร) / {item.price_test.toLocaleString()} (เทส) บาท
                                {:else}
                                ราคา: {item.price.toLocaleString()} บาท
                                {/if}
                            </p>
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
                             
                                <button class="btn btn-neutral btn-active" on:click={() => openEditModal(item)}>
                                    เผยแพร่หรือแก้ไข  
                                </button>
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

<!-- Edit Modal -->
{#if editingItem}
    <div class="modal modal-open">
        <div class="modal-box">
            <h3 class="font-bold text-lg">แก้ไขรายการ</h3>
            <form on:submit|preventDefault={handleEditSubmit} enctype="multipart/form-data">
                <input type="hidden" name="id" bind:value={editingItem.id} />
                <!-- Public Switch -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">เปิดให้ผู้อื่นมองเห็นสินค้า</span>
                    </label>
                    <input
                        type="checkbox"
                        name="isPublic"
                        class="toggle"
                        bind:checked={editingItem.public}
                        on:change={handleCheckboxChange}
                    />
                </div>
                <!-- Name -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">ชื่อสินค้า</span>
                    </label>
                    <input type="text" name="name" bind:value={editingItem.Name} class="input input-bordered" required />
                </div>

                <!-- Details -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">รายละเอียดสินค้า</span>
                    </label>
                    <textarea 
                        name="details" 
                        bind:value={editingItem.Desc} 
                        class="textarea textarea-bordered" 
                        rows="6"
                    ></textarea>
                </div>

                <!-- Size -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">ขนาดเสื้อผ้า</span>
                    </label>
                    <select name="size" bind:value={editingItem.Size} class="select select-bordered w-full" required>
                        <option value="">เลือกขนาด</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                </div>

                <!-- Province -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">จังหวัด</span>
                    </label>
                    <select name="province" bind:value={editingItem.Province} class="select select-bordered w-full" required>
                        <option value="">เลือกจังหวัด</option>
                        <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                        <option value="เชียงใหม่">เชียงใหม่</option>
                        <option value="ภูเก็ต">ภูเก็ต</option>
                        <option value="ชลบุรี">ชลบุรี</option>
                        <option value="นครราชสีมา">นครราชสีมา</option>
                        <option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
                        <option value="เชียงราย">เชียงราย</option>
                        <option value="ขอนแก่น">ขอนแก่น</option>
                        <option value="สงขลา">สงขลา</option>
                        <option value="นครปฐม">นครปฐม</option>
                        <option value="อุดรธานี">อุดรธานี</option>
                    </select>
                </div>

                <!-- Pricing Option Selection -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">เลือกตัวเลือกการตั้งราคา</span>
                    </label>
                    <div class="flex items-center space-x-4">
                        <label class="flex items-center">
                            <input
                                type="radio"
                                name="pricing_option"
                                value="price_only"
                                bind:group={pricingOption}
                                class="radio radio-primary"
                            />
                            <span class="ml-2">ใช้ราคาเท่านั้น</span>
                        </label>
                        <label class="flex items-center">
                            <input
                                type="radio"
                                name="pricing_option"
                                value="price_pri_test"
                                bind:group={pricingOption}
                                class="radio radio-primary"
                            />
                            <span class="ml-2">ใช้ราคาไพร และ เทส</span>
                        </label>
                    </div>
                </div>

                <!-- Price -->
                {#if pricingOption === 'price_only'}
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">ราคา</span>
                    </label>
                    <input type="number" name="price" bind:value={editingItem.price} class="input input-bordered" required />
                </div>
                {/if}

                <!-- Price Pri and Price Test -->
                {#if pricingOption === 'price_pri_test'}
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">ราคาไพร</span>
                    </label>
                    <input type="number" name="price_pri" bind:value={editingItem.price_pri} class="input input-bordered" required />
                </div>

                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">ราคาเทส</span>
                    </label>
                    <input type="number" name="price_test" bind:value={editingItem.price_test} class="input input-bordered" required />
                </div>
                {/if}

                <!-- Status -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">สถานะ</span>
                    </label>
                    <select name="status" bind:value={editingItem.Status} class="select select-bordered w-full" required>
                        <option value="">เลือกสถานะ</option>
                        <option value="พร้อมให้เช่า">พร้อมให้เช่า</option>
                        <option value="กำลังถูกเช่า">กำลังถูกเช่า</option>
                        <option value="ยังไม่พร้อม">ยังไม่พร้อม</option>
                    </select>
                </div>

                <!-- Image -->
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text">รูปภาพ</span>
                    </label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        class="file-input file-input-bordered w-full"
                        on:change={(e) => previewImage(e, 'edit')}
                    />
                    <div class="mt-4">
                        {#if editImagePreview}
                            <img src={editImagePreview} alt="Image Preview" class="w-48 h-48 object-cover rounded-lg" />
                        {:else if editingItem.Image}
                            <img src={`https://macosplay.saas.in.th/api/files/mxj3660ce5olheb/${editingItem.id}/${editingItem.Image}`} 
                                 alt="Current Image" 
                                 class="w-48 h-48 object-cover rounded-lg" />
                        {/if}
                    </div>
                </div>

                

                <div class="modal-action">
                    <button type="button" class="btn" on:click={() => editingItem = null}>ยกเลิก</button>
                    <button type="submit" class="btn btn-primary">บันทึก</button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Full Image Modal -->
{#if fullImage}
    <div class="modal modal-open">
        <div class="modal-box">
            <div class="modal-action">
                <button class="btn" on:click={() => fullImage = null}>X ปิดภาพ</button>
            </div>
            <img src={fullImage} alt="Full Image" class="w-full h-auto object-cover" />
            
        </div>
    </div>
{/if}


