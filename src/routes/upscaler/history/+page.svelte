<!-- Upscaler History Page -->
<script lang="ts">
	import { goto } from '$app/navigation';

	// Get data from page.ts
	export let data;

	let upscaledRecords = data.upscaledRecords || [];
	let isLoading = false;
	let error = data.error || null;
	let totalRecords = data.totalRecords || 0;
	let currentPage = data.currentPage || 1;
	let recordsPerPage = 12;
	let totalPages = data.totalPages || 1;
	let userProfile = data.userProfile || null;

	// Filters
	let sortBy = data.currentSort || '-created';
	let searchTerm = data.currentSearch || '';
	let filterDate = data.currentDate || null;

	function getImageUrl(record: any) {
		if (!record) {
			console.warn('Record is undefined');
			return '/images/image-error.png';
		}

		try {
			const baseUrl = import.meta.env.VITE_PB_URL;

			// Check for Image field (case sensitive)
			if (record.id && record.Image) {
				const url = `${baseUrl}/api/files/cbkes123mm2yp1j/${record.id}/${record.Image}`;
				return url;
			}

			// Check for image field (lowercase)
			if (record.id && record.image) {
				const url = `${baseUrl}/api/files/cbkes123mm2yp1j/${record.id}/${record.image}`;
				return url;
			}

			console.warn('No image field found in record:', Object.keys(record));
			return '/images/image-error.png';
		} catch (e) {
			console.error('Error generating image URL:', e);
			return '/images/image-error.png';
		}
	}

	function getUserProfileImage(user: any) {
		if (!user) return '/images/default-avatar.png';

		try {
			const baseUrl = import.meta.env.VITE_PB_URL;

			if (user.id && user.avatar) {
				// Direct URL construction for user avatar
				const url = `${baseUrl}/api/files/users/${user.id}/${user.avatar}`;
				return url;
			}

			return '/images/default-avatar.png';
		} catch (e) {
			console.error('Error generating user avatar URL:', e);
			return '/images/default-avatar.png';
		}
	}

	function handleSearch() {
		const searchParams = new URLSearchParams();
		if (searchTerm) searchParams.set('search', searchTerm);
		if (filterDate) searchParams.set('date', filterDate);
		if (sortBy !== '-created') searchParams.set('sort', sortBy);
		searchParams.set('page', '1');

		goto(`/upscaler/history?${searchParams.toString()}`);
	}

	function handleSortChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		sortBy = select.value;
		handleSearch();
	}

	function handleDateChange(event: Event) {
		const input = event.target as HTMLInputElement;
		filterDate = input.value;
		handleSearch();
	}

	function clearFilters() {
		searchTerm = '';
		filterDate = null;
		sortBy = '-created';
		goto('/upscaler/history');
	}

	function goToUpscaler() {
		goto('/upscaler');
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('th-TH', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function downloadImage(record: any) {
		if (!record || (!record.Image && !record.image)) {
			console.error('Cannot download: No image found in record');
			return;
		}

		const imageUrl = `${import.meta.env.VITE_PB_URL}/api/files/cbkes123mm2yp1j/${record.id}/${record.Image || record.image}`;
		const link = document.createElement('a');
		link.href = imageUrl;
		link.download = record.originalName || 'upscaled-image.png';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		img.src = '/images/image-error.png';
	}

	function goToPage(page: number) {
		const searchParams = new URLSearchParams();
		if (searchTerm) searchParams.set('search', searchTerm);
		if (filterDate) searchParams.set('date', filterDate);
		if (sortBy !== '-created') searchParams.set('sort', sortBy);
		searchParams.set('page', page.toString());

		goto(`/upscaler/history?${searchParams.toString()}`);
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center">
			<h1 class="text-3xl font-bold">ประวัติการอัพสเกลรูปภาพ</h1>
			{#if userProfile}
				<div class="ml-4 flex items-center">
					<img
						src={getUserProfileImage(userProfile)}
						alt="โปรไฟล์"
						class="h-10 w-10 rounded-full border-2 border-blue-500 object-cover"
						on:error={handleImageError}
					/>
					<span class="ml-2 font-medium">{userProfile.name || userProfile.username}</span>
				</div>
			{/if}
		</div>
		<button
			on:click={goToUpscaler}
			class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
		>
			อัพสเกลรูปภาพใหม่
		</button>
	</div>

	{#if error}
		<div class="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			<p>{error}</p>
			{#if data.errorDetails}
				<details class="mt-2 text-xs">
					<summary class="cursor-pointer">ข้อมูลการแก้ไขปัญหา</summary>
					<pre class="mt-2 overflow-auto rounded bg-gray-100 p-2">{data.errorDetails}</pre>
				</details>
			{/if}
		</div>
	{:else}
		<!-- User Stats -->
		{#if userProfile}
			<div class="mb-6 rounded-lg bg-white p-4 shadow-md">
				<div class="flex flex-col md:flex-row md:items-center md:justify-between">
					<div class="mb-4 flex items-center md:mb-0">
						<img
							src={getUserProfileImage(userProfile)}
							alt="โปรไฟล์"
							class="h-16 w-16 rounded-full border-2 border-blue-500 object-cover"
							on:error={handleImageError}
						/>
						<div class="ml-4">
							<h2 class="text-xl font-semibold">{userProfile.name || userProfile.username}</h2>
							<p class="text-gray-600">{userProfile.email}</p>
						</div>
					</div>
					<div class="flex flex-col md:items-end">
						<div class="text-lg font-semibold">{totalRecords} รูปภาพ</div>
						<p class="text-gray-600">สมาชิกตั้งแต่ {formatDate(userProfile.created)}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Filters Section -->
		<div class="mb-6 rounded-lg bg-white p-4 shadow-md">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
				<!-- Search -->
				<div>
					<label for="search" class="mb-1 block text-sm font-medium text-gray-700"
						>ค้นหาจากชื่อไฟล์</label
					>
					<div class="relative">
						<input
							type="text"
							id="search"
							bind:value={searchTerm}
							placeholder="ค้นหา..."
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				<!-- Date Filter -->
				<div>
					<label for="date-filter" class="mb-1 block text-sm font-medium text-gray-700"
						>กรองตามวันที่</label
					>
					<input
						type="date"
						id="date-filter"
						bind:value={filterDate}
						on:change={handleDateChange}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Sort By -->
				<div>
					<label for="sort-by" class="mb-1 block text-sm font-medium text-gray-700">เรียงตาม</label>
					<select
						id="sort-by"
						bind:value={sortBy}
						on:change={handleSortChange}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="-created">ล่าสุด</option>
						<option value="created">เก่าสุด</option>
						<option value="originalName">ชื่อไฟล์ (A-Z)</option>
						<option value="-originalName">ชื่อไฟล์ (Z-A)</option>
					</select>
				</div>

				<!-- Action Buttons -->
				<div class="flex items-end gap-2">
					<button
						on:click={handleSearch}
						class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
					>
						ค้นหา
					</button>
					<button
						on:click={clearFilters}
						class="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
					>
						ล้างตัวกรอง
					</button>
				</div>
			</div>
		</div>

		<!-- Results Section -->
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div
					class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"
				></div>
			</div>
		{:else if upscaledRecords.length === 0}
			<div class="rounded-lg bg-gray-100 p-8 text-center">
				<p class="text-lg text-gray-600">ไม่พบประวัติการอัพสเกลรูปภาพ</p>
				<p class="mt-2 text-sm text-gray-500">คุณยังไม่เคยอัพสเกลรูปภาพ หรือรูปภาพอาจถูกลบไปแล้ว</p>

				<button
					on:click={goToUpscaler}
					class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
				>
					อัพสเกลรูปภาพใหม่
				</button>
			</div>
		{:else}
			<!-- Results Count -->
			<div class="mb-4 text-gray-600">
				พบ {totalRecords} รายการ
			</div>

			<!-- Image Grid -->
			<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each upscaledRecords as record}
					<div class="overflow-hidden rounded-lg bg-white shadow-md">
						<div class="relative aspect-video bg-gray-100">
							<!-- Display the upscaled image -->
							<img
								src={`${import.meta.env.VITE_PB_URL}/api/files/cbkes123mm2yp1j/${record.id}/${record.Image || record.image}`}
								alt={record.originalName}
								class="h-full w-full object-cover"
								loading="lazy"
								on:error={handleImageError}
							/>
							<!-- Debug info for image -->
							<div class="absolute bottom-0 right-0 bg-black bg-opacity-50 p-1 text-xs text-white">
								ID: {record.id.substring(0, 8)}...
							</div>

							<!-- Hover overlay with download button -->
							<div
								class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all hover:bg-opacity-30 hover:opacity-100"
							>
								<a
									href={`${import.meta.env.VITE_PB_URL}/api/files/cbkes123mm2yp1j/${record.id}/${record.Image || record.image}`}
									download={record.originalName || 'upscaled-image.png'}
									class="flex items-center rounded-md bg-blue-600 px-3 py-2 text-white shadow-lg transition-colors hover:bg-blue-700"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-1 h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
										/>
									</svg>
									ดาวน์โหลด
								</a>
							</div>

							<!-- Quick download button -->
							<div class="absolute right-2 top-2">
								<a
									href={`${import.meta.env.VITE_PB_URL}/api/files/cbkes123mm2yp1j/${record.id}/${record.Image || record.image}`}
									download={record.originalName || 'upscaled-image.png'}
									class="flex items-center justify-center rounded-full bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700"
									title="ดาวน์โหลดรูปภาพ"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
										/>
									</svg>
								</a>
							</div>
						</div>
						<div class="p-4">
							<div class="mb-2 flex items-start justify-between">
								<h3 class="truncate text-lg font-semibold" title={record.originalName}>
									{record.originalName || 'ไม่มีชื่อ'}
								</h3>
								{#if record.expand?.user}
									<img
										src={getUserProfileImage(record.expand.user)}
										alt="โปรไฟล์"
										class="ml-2 h-6 w-6 flex-shrink-0 rounded-full object-cover"
										on:error={handleImageError}
									/>
								{/if}
							</div>
							<p class="mb-2 text-sm text-gray-500">
								{formatDate(record.created)}
							</p>

							{#if record.creativity || record.scaleFactor || record.dynamic}
								<div class="mb-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
									{#if record.creativity}
										<div class="rounded bg-gray-100 p-1 text-center">
											ความสร้างสรรค์: {parseFloat(record.creativity).toFixed(2)}
										</div>
									{/if}
									{#if record.scaleFactor}
										<div class="rounded bg-gray-100 p-1 text-center">
											ขยาย: {record.scaleFactor}x
										</div>
									{/if}
									{#if record.dynamic}
										<div class="rounded bg-gray-100 p-1 text-center">
											HDR: {record.dynamic}
										</div>
									{/if}
								</div>
							{/if}

							<div class="flex justify-between">
								<a
									href={`${import.meta.env.VITE_PB_URL}/api/files/cbkes123mm2yp1j/${record.id}/${record.Image || record.image}`}
									target="_blank"
									rel="noopener noreferrer"
									class="text-sm text-blue-600 hover:text-blue-800"
								>
									ดูเต็ม
								</a>
								<button
									on:click={() => downloadImage(record)}
									class="text-sm text-green-600 hover:text-green-800"
								>
									ดาวน์โหลด
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="mt-6 flex justify-center">
					<nav class="inline-flex rounded-md shadow">
						<button
							on:click={() => goToPage(1)}
							disabled={currentPage === 1}
							class="rounded-l-md border border-gray-300 bg-white px-3 py-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							&laquo;
						</button>
						<button
							on:click={() => goToPage(currentPage - 1)}
							disabled={currentPage === 1}
							class="border-b border-t border-gray-300 bg-white px-3 py-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							&lsaquo;
						</button>

						<div
							class="border-b border-t border-gray-300 bg-white px-4 py-2 font-medium text-blue-600"
						>
							{currentPage} / {totalPages}
						</div>

						<button
							on:click={() => goToPage(currentPage + 1)}
							disabled={currentPage === totalPages}
							class="border-b border-t border-gray-300 bg-white px-3 py-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							&rsaquo;
						</button>
						<button
							on:click={() => goToPage(totalPages)}
							disabled={currentPage === totalPages}
							class="rounded-r-md border border-gray-300 bg-white px-3 py-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							&raquo;
						</button>
					</nav>
				</div>
			{/if}
		{/if}
	{/if}
</div>
