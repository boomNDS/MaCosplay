<!-- Upscaler.svelte -->
<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	// Get data from page.server.ts
	export let data;
	export let form;

	let selectedFile: File | null = null;
	let previewUrl: string | null = null;
	let upscaledImageUrl: string | null = null;
	let isLoading = false;
	let error: string | null = null;

	// Get data from server
	let upscaledRecords = data.recentUpscaledRecords || [];
	let userProfile = data.userProfile || null;
	let isAuthenticated = true; // Server-side authentication is already handled

	// Parameters for upscaling
	let creativity = 0.35; // Default value
	let scaleFactor = 2; // Default value
	let dynamic = 6; // Default value

	const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];

			// Validate file size
			if (file.size > MAX_FILE_SIZE) {
				error = 'ขนาดไฟล์ต้องน้อยกว่า 20MB';
				return;
			}

			// Validate file type
			if (!file.type.startsWith('image/')) {
				error = 'กรุณาเลือกไฟล์รูปภาพเท่านั้น';
				return;
			}

			selectedFile = file;
			previewUrl = URL.createObjectURL(file);
			error = null;
		}
	}

	// Handle drag and drop
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		const target = event.currentTarget as HTMLElement;
		target?.classList.add('border-blue-500');
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		const target = event.currentTarget as HTMLElement;
		target?.classList.remove('border-blue-500');
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		const target = event.currentTarget as HTMLElement;
		target?.classList.remove('border-blue-500');

		if (event.dataTransfer?.files.length) {
			const input = document.getElementById('file-upload') as HTMLInputElement;
			input.files = event.dataTransfer.files;
			input.dispatchEvent(new Event('change'));
		}
	}

	function goToHistory() {
		goto('/upscaler/history');
	}

	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		img.src = '/images/image-error.png';
	}

	// Process form result
	afterUpdate(() => {
		if (form?.success && form?.upscaledImage) {
			upscaledImageUrl = form.upscaledImage;
		} else if (form?.error) {
			error = form.error;
		}
	});

	onMount(() => {
		// Clean up on unmount
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-2 flex items-center justify-between">
		<h1 class="text-4xl font-bold">อัพสเกลรูปคอสเพลย์</h1>
		<button
			on:click={goToHistory}
			class="btn flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-blue-700"
		>
			ดูประวัติการอัพสเกล
		</button>
	</div>
	<p class="mb-8 text-center text-gray-600">
		เพิ่มความคมชัดและคุณภาพให้กับรูปคอสเพลย์ของคุณด้วย AI
	</p>

	<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
		{#if data.error}
			<div class="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
				<p>{data.error}</p>
			</div>
		{/if}

		<div class="space-y-6">
			<!-- File Upload Section -->
			<div
				class="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors duration-200"
				on:dragover={handleDragOver}
				on:dragleave={handleDragLeave}
				on:drop={handleDrop}
			>
				<input
					type="file"
					accept="image/*"
					on:change={handleFileSelect}
					class="hidden"
					id="file-upload"
				/>
				<label
					for="file-upload"
					class="btn flex cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-blue-700"
				>
					เลือกรูปภาพ
				</label>
				<p class="mt-2 text-sm text-gray-600">หรือลากและวางรูปภาพที่นี่</p>
				<p class="mt-1 text-xs text-gray-500">รองรับไฟล์: JPG, PNG (ขนาดสูงสุด: 20MB)</p>
			</div>

			<!-- Error Message -->
			{#if error}
				<div class="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
					{error}
				</div>
			{/if}

			{#if form?.error}
				<div class="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
					{form.error}
				</div>
			{/if}

			<!-- Advanced Settings Section -->
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="mb-4 text-lg font-semibold">ตั้งค่าการอัพสเกล</h3>

				<!-- Creativity Slider -->
				<div class="mb-4">
					<div class="mb-2 flex items-center justify-between">
						<label for="creativity" class="text-sm font-medium text-gray-700">ความสร้างสรรค์</label>
						<span class="text-sm text-gray-500">{creativity.toFixed(2)}</span>
					</div>
					<input
						type="range"
						id="creativity"
						name="creativity"
						min="0"
						max="1"
						step="0.01"
						bind:value={creativity}
						class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
					/>
					<p class="mt-1 text-xs text-gray-500">ค่าแนะนำ: 0.3 - 0.9 (ค่าสูง = สร้างสรรค์มากขึ้น)</p>
				</div>

				<!-- Scale Factor Slider -->
				<div class="mb-4">
					<div class="mb-2 flex items-center justify-between">
						<label for="scaleFactor" class="text-sm font-medium text-gray-700"
							>อัตราส่วนการขยาย</label
						>
						<span class="text-sm text-gray-500">{scaleFactor}x</span>
					</div>
					<input
						type="range"
						id="scaleFactor"
						name="scaleFactor"
						min="1"
						max="2"
						step="0.5"
						bind:value={scaleFactor}
						class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
					/>
					<p class="mt-1 text-xs text-gray-500">ค่าแนะนำ: 2x (ค่าสูง = ขนาดใหญ่ขึ้น)</p>
				</div>

				<!-- Dynamic Range Slider -->
				<!-- <div class="mb-2">
                    <div class="flex justify-between items-center mb-2">
                        <label for="dynamic" class="text-sm font-medium text-gray-700">ช่วงไดนามิก (HDR)</label>
                        <span class="text-sm text-gray-500">{dynamic}</span>
                    </div>
                    <input 
                        type="range" 
                        id="dynamic" 
                        name="dynamic"
                        min="1" 
                        max="50" 
                        step="1" 
                        bind:value={dynamic}
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p class="text-xs text-gray-500 mt-1">ค่าแนะนำ: 6 (ค่าสูง = HDR มากขึ้น)</p>
                </div> -->
			</div>

			<!-- Preview Section -->
			{#if previewUrl}
				<div class="overflow-hidden rounded-lg border">
					<div class="border-b bg-gray-100 p-2">
						<h3 class="font-medium">ตัวอย่างรูปภาพ</h3>
					</div>
					<div class="p-4">
						<img src={previewUrl} alt="Preview" class="mx-auto max-h-64 object-contain" />
					</div>
				</div>
			{/if}

			<!-- Upscale Button -->
			<form
				method="POST"
				action="?/upscale"
				enctype="multipart/form-data"
				use:enhance={({ formData }) => {
					isLoading = true;
					error = null;

					// Directly append the file to the FormData
					if (selectedFile) {
						// Remove any existing file input to avoid duplicates
						formData.delete('file');
						// Add the file directly to the FormData
						formData.append('file', selectedFile);
					}

					return async ({ update }) => {
						isLoading = false;
						await update();
					};
				}}
			>
				<input type="hidden" name="creativity" value={creativity} />
				<input type="hidden" name="scaleFactor" value={scaleFactor} />
				<input type="hidden" name="dynamic" value={dynamic} />

				<button
					type="submit"
					class="btn flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={!selectedFile || isLoading}
				>
					{#if isLoading}
						<span class="mr-2 inline-block animate-spin">⟳</span> กำลังอัพสเกล...
					{:else}
						อัพสเกลรูปภาพ
					{/if}
				</button>
			</form>

			<!-- Result Section -->
			{#if upscaledImageUrl}
				<div class="overflow-hidden rounded-lg border">
					<div class="flex items-center justify-between border-b bg-gray-100 p-2">
						<h3 class="font-medium">รูปภาพที่อัพสเกลแล้ว</h3>
						<a
							href={upscaledImageUrl}
							download="upscaled-image.png"
							class="btn flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-blue-700"
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
					<div class="relative p-4">
						<img src={upscaledImageUrl} alt="Upscaled" class="mx-auto max-h-96 object-contain" />
						<div class="absolute right-4 top-4">
							<a
								href={upscaledImageUrl}
								download="upscaled-image.png"
								class="btn flex items-center justify-center rounded-full bg-blue-600 p-2 text-white shadow-md transition-colors hover:bg-blue-700"
								title="ดาวน์โหลดรูปภาพ"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
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
				</div>
			{/if}
		</div>
	</div>

	<!-- Recent Upscales -->
	{#if upscaledRecords.length > 0}
		<div class="mt-12">
			<h2 class="mb-4 text-2xl font-bold">รูปภาพที่อัพสเกลล่าสุด</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				{#each upscaledRecords as record}
					<div class="overflow-hidden rounded-lg bg-white shadow-md">
						<div class="relative aspect-video bg-gray-100">
							<img
								src={`${import.meta.env.VITE_PB_URL}/api/files/cbkes123mm2yp1j/${record.id}/${record.Image || record.image}`}
								alt={record.originalName}
								class="h-full w-full object-cover"
								loading="lazy"
								on:error={handleImageError}
							/>
							<div
								class="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<a
									href={`${import.meta.env.VITE_PB_URL}/api/files/cbkes123mm2yp1j/${record.id}/${record.Image || record.image}`}
									download={record.originalName || 'upscaled-image.png'}
									class="btn flex items-center justify-center rounded-full bg-blue-600 p-2 text-white shadow-md transition-colors hover:bg-blue-700"
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
							<!-- Hover overlay with download button -->
							<div
								class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all hover:bg-opacity-30 hover:opacity-100"
							>
								<a
									href={`${import.meta.env.VITE_PB_URL}/api/files/cbkes123mm2yp1j/${record.id}/${record.Image || record.image}`}
									download={record.originalName || 'upscaled-image.png'}
									class="btn flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-blue-700"
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
						</div>
						<div class="p-3">
							<h3 class="truncate font-semibold" title={record.originalName}>
								{record.originalName || 'ไม่มีชื่อ'}
							</h3>
							<p class="text-xs text-gray-500">
								{new Date(record.created).toLocaleDateString('th-TH')}
							</p>
						</div>
					</div>
				{/each}
			</div>
			<div class="mt-4 text-center">
				<button
					on:click={goToHistory}
					class="btn flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-blue-700"
				>
					ดูทั้งหมด
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Custom styles for range inputs */
	input[type='range'] {
		-webkit-appearance: none;
		height: 8px;
		border-radius: 5px;
		background: #d3d3d3;
		outline: none;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #4299e1;
		cursor: pointer;
	}

	input[type='range']::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #4299e1;
		cursor: pointer;
		border: none;
	}
</style>
