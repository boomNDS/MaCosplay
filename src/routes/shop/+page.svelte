<script lang="ts">
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	export let data: { itemList: { items: any[]; totalPages: number; currentPage: number } };
	let selectedProvince = '';
	let selectedSize = '';
	let selectedStatus = '';
	let fullImage = null;
	let searchQuery = '';
	let items = data.itemList.items;
	let detailItem = null;

	const pb = new PocketBase('https://macosplay.saas.in.th');

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		searchQuery = params.get('search') || '';
		selectedStatus = params.get('status') || '';
		selectedProvince = params.get('province') || '';
		selectedSize = params.get('size') || '';
	});

	function handleSearch() {
		const params = new URLSearchParams(window.location.search);
		params.set('search', searchQuery);
		params.set('status', selectedStatus);
		params.set('province', selectedProvince);
		params.set('size', selectedSize);
		params.set('page', '1');
		window.location.search = params.toString();
	}

	function resetFilters() {
		selectedProvince = '';
		selectedSize = '';
		selectedStatus = '';
		searchQuery = '';
		handleSearch();
	}

	function changePage(newPage: number) {
		const params = new URLSearchParams(window.location.search);
		params.set('page', newPage.toString());
		window.location.search = params.toString();
	}

	const filteredItems = () => {
		return items.filter((item) => {
			const matchesProvince = !selectedProvince || item.Province === selectedProvince;
			const matchesSize = !selectedSize || item.Size === selectedSize;
			const matchesStatus = !selectedStatus || item.Status === selectedStatus;
			const matchesSearch =
				!searchQuery || item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.expand?.userStore?.Name.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesProvince && matchesSize && matchesStatus && matchesSearch;
		});
	};

	console.log(data?.itemList);

	// Helper function to limit text length
	const limitText = (text: string, maxLength: number) => {
		return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
	};

	function openDetailModal(item) {
		detailItem = item;
	}

	function navigateToStore(item) {
        const storeSlug = item.expand.userStore.slug;
        goto(`/store/${storeSlug}`);
    }

	// Debounce function to limit the rate of handleSearch calls
	function debounce(func, wait) {
		let timeout;
		return function(...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	// Create a debounced version of handleSearch
	const debouncedHandleSearch = debounce(handleSearch, 300);
</script>

<section id="filter" class="pt-12 sm:pt-12 md:pt-14">
	<div class="container mx-auto flex flex-col gap-4 p-4 sm:flex-row sm:p-6">
		<label class="input input-bordered flex w-full items-center gap-2 sm:w-auto">
			<input type="text" class="grow" placeholder="ค้นหา" bind:value={searchQuery} />
		</label>

		<!-- ตัวกรองจังหวัดใหม่ -->
		<label class="input input-bordered flex w-full items-center gap-2 sm:w-auto">
			<select class="grow" bind:value={selectedProvince}>
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
		</label>

		<!-- ตัวกรองขนาดใหม่ -->
		<label class="input input-bordered flex w-full items-center gap-2 sm:w-auto">
			<select class="grow" bind:value={selectedSize}>
				<option value="">เลือกขนาด</option>
				<option value="S">S</option>
				<option value="M">M</option>
				<option value="L">L</option>
				<option value="XL">XL</option>
				<option value="XXL">XXL</option>
				<!-- เพิ่มขนาดเพิ่มเติมตามต้องการ -->
			</select>
		</label>
		<label class="input input-bordered flex w-full items-center gap-2 sm:w-auto">
			<select class="grow" bind:value={selectedStatus}>
				<option value="">เลือกสถานะ</option>
				<option value="พร้อมให้เช่า">พร้อมให้เช่า</option>
				<option value="กำลังถูกเช่า">กำลังถูกเช่า</option>
				<option value="ยังไม่พร้อม">ยังไม่พร้อม</option>
			</select>
		</label>
		<button class="btn btn-outline" on:click={debouncedHandleSearch}>ค้นหาทั้งหมด</button>
		<button class="btn btn-outline btn-primary" on:click={resetFilters}>Reset</button>
	</div>
</section>

<section id="features" class="pt-12 sm:pt-12 md:pt-14">
	<div class="container mx-auto p-4 sm:p-6">
		<!-- Pocketbase Rental Card -->
		<section class="mb-6">
			<h2 class="mb-2 text-2xl font-semibold">ตามหาชุด/วิกเช่าได้ที่นี่เลย</h2>
		</section>
		<div class="grid max-h-[48rem] grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
			<!-- Limit to 4 rows -->
			{#if filteredItems().length > 0}
				{#each filteredItems() as item}
					<div class="card bg-base-100 shadow-xl">
						<figure>
							{#if item.Image}
							<img
								src={`https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`}
								alt="{item.Name} Thumbnail"
								class="h-48 max-h-48 w-full cursor-pointer object-cover"
								on:click={() =>
									(fullImage = `https://file.macosplay.com/mxj3660ce5olheb/${item.id}/${item.Image}`)}
							/>

							{:else}
							<img
								src="/images/Example/Macosplay.png"
								alt="{item.Name} Thumbnail"
								class="h-48 max-h-48 w-full cursor-pointer object-cover"
								
							/>

							{/if}
							
						</figure>
						<div class="card-body">
							<div class="flex items-center justify-between">
								<div class="avatar mb-2 flex items-center">
									<div class="h-8 w-8 overflow-hidden rounded-full">
										{#if item.user && item.expand?.user?.avatar}
											<img
												src={`https://file.macosplay.com/_pb_users_auth_/${item.expand?.user?.id}/${item.expand?.user?.avatar}`}
												alt="Avatar"
												class="h-full w-full object-cover"
											/>
										{:else}
											<img
												src="/images/Example/Macosplay.png"
												alt="Fallback Avatar"
												class="h-full w-full object-cover"
											/>
										{/if}
									</div>
									<span class="ml-2">{limitText((item.expand?.user?.name || ''), 10)}</span>
								</div>
                                
								<div
									class="badge {item.expand?.user?.VerifyShop === 'ยืนยันร้านค้าแล้ว'
										? 'badge-primary badge-outline'
										: item.expand?.user?.VerifyShop === 'ยังไม่ได้ยืนยันร้านค้า'} gap-2"
								>
									{#if item.expand?.user?.VerifyShop === 'ยืนยันร้านค้าแล้ว'}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4 text-blue-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									{/if}
									{item.expand?.user?.VerifyShop}
								</div>
							</div>
                            <p>ร้านค้า: {limitText((item.expand?.userStore?.Name || ''), 20)}</p>

                            <h2 class="card-title">{limitText(item.Name, 33)}</h2>
							<div class="badge badge-neutral">{item.Province}</div>
							<div class="badge badge-outline">Size: {item.Size}</div>
							<div
								class="badge {item.Status === 'พร้อมให้เช่า'
									? 'badge-success'
									: item.Status === 'กำลังถูกเช่า'
										? 'badge-warning'
										: item.Status === 'อยู่ระหว่างการซ่อมบำรุง'
											? 'badge-error'
											: ''} gap-2"
							>
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
							<!--  <div class="rating mb-2">
                                <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                <input
                                  type="radio"
                                  name="rating-2"
                                  class="mask mask-star-2 bg-orange-400"
                                  checked="checked" />
                                <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                              </div> -->
                       
							<div class="card-actions justify-end mt-12">
								{#if item.expand?.userStore?.slug}
									<a href={`/store/${item.expand.userStore.slug}`} class="w-auto btn btn-neutral btn-active">
										ดูร้านค้า
									</a>
								{/if}

								


                                <button class="btn btn-neutral btn-active" on:click={() => openDetailModal(item)}>
									ดูรายละเอียด
								</button>
							
								<a href={item?.expand?.userStore?.fbPage} target="_blank">
									<button type="submit" class="btn btn-facebook mb-4">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-2">
											<path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
										</svg>
										ติดต่อ FB ร้านค้า
									</button>
								</a>
								
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="card w-full bg-base-100 shadow-xl sm:w-96">
					<div class="card-body">
						<h2 class="card-title">ไม่เจอร้านค้า</h2>
						<p>ไม่พบข้อมูลชุดเช่าในขณะนี้</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<div class="join">
	<button
		class="btn join-item"
		on:click={() => changePage(data.itemList.currentPage - 1)}
		disabled={data.itemList.currentPage === 1}>«</button
	>
	<span class="btn join-item">Page {data.itemList.currentPage} of {data.itemList.totalPages}</span>
	<button
		class="btn join-item"
		on:click={() => changePage(data.itemList.currentPage + 1)}
		disabled={data.itemList.currentPage === data.itemList.totalPages}>»</button
	>
</div>

<!-- Full Image Modal -->
{#if fullImage}
	<div class="modal modal-open">
		<div class="modal-box">
			<div class="modal-action mb-3">
				<button class="btn" on:click={() => (fullImage = null)}>X ปิด</button>
			</div>
			<img src={fullImage} alt="Full Image" class="h-auto w-full object-cover" />
		</div>
	</div>
{/if}

<!-- Detail Modal -->
{#if detailItem}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">รายละเอียดสินค้า</h3>
			<p style="white-space: pre-wrap;">{detailItem.Desc}</p>
			<div class="modal-action">
				<button class="btn" on:click={() => detailItem = null}>ปิด</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.btn-facebook {
        background-color: #3b5998;
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
        background-color: #2d4373;
    }

    .btn-facebook:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 89, 152, 0.5);
    }


	.join {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }
	
	
</style>
