<script lang="ts">
	export let data: { itemList: any[] }; // Define data type
	console.log(data?.itemList);
</script>

<section id="home" class="flex min-h-screen items-center justify-center">
	<div class="container mx-auto flex w-full flex-col items-center p-4 sm:p-6">
		<div class="flex w-full flex-col items-center justify-center sm:flex-row sm:space-x-2">
			<img src="/images/Example/Cosshop.png" alt="cosshop" class="h-auto w-full object-cover" />
		</div>

		<h2 class="mt-4 text-center text-lg sm:text-xl">Cosshop sample</h2>
		<p class="text-center text-sm sm:text-base">Example shop</p>
	</div>
</section>

<section id="features">
	<div class="container mx-auto p-4 sm:p-6">
		<!-- Pocketbase Rental Card -->
		<section class="mb-6">
			<h2 class="mb-2 text-2xl font-semibold">ตามหาชุดเช่าได้ที่นี่เลย</h2>
		</section>
		<div class="grid max-h-[48rem] grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 lg:grid-cols-4">
			<!-- Limit to 4 rows -->
			{#if data?.itemList && data.itemList.length > 0}
				{#each data.itemList as shop}
					<div class="card bg-base-100 shadow-xl">
						<figure>
							<img
								src={`https://file.macosplay.com/mxj3660ce5olheb/${shop.id}/${shop.Image}`}
								alt="{shop.Name} Thumbnail"
								class="h-auto max-h-48 w-full object-cover"
							/>
						</figure>
						<div class="card-body">
							<div class="avatar mb-2">
								<div class="h-8 w-8 overflow-hidden rounded-full">
									<!-- Adjusted size for smaller avatar -->
									<img
										src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
										alt="Avatar"
										class="h-full w-full object-cover"
									/>
								</div>
							</div>
							<h2 class="card-title">{shop.Name}</h2>
							<p>{shop.Details}</p>
							<p class="font-bold">ราคา: {shop.price.toLocaleString()} บาท</p>
							<div class="card-actions justify-end">
								<button class="btn btn-neutral btn-active">
									<a href={shop.Details} target="_blank">ดูรายละเอียด</a>
								</button>
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
