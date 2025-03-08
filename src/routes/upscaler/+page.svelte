<!-- Upscaler.svelte -->
<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import { pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';
    
    // Get form data from page.server.ts
    export let form;
    
    let selectedFile: File | null = null;
    let previewUrl: string | null = null;
    let upscaledImageUrl: string | null = null;
    let isLoading = false;
    let error: string | null = null;
    let upscaledRecords: any[] = [];
    
    // Parameters for upscaling
    let creativity = 0.35; // Default value
    let scaleFactor = 2; // Default value
    let dynamic = 6; // Default value
    
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

    async function loadUpscaledImages() {
        try {
            const userId = pb.authStore.model?.id;
            if (!userId) return;

            const records = await pb.collection('cbkes123mm2yp1j').getList(1, 10, {
                filter: `user = "${userId}"`,
                sort: '-created',
                expand: 'user'
            });
            upscaledRecords = records.items;
        } catch (e) {
            console.error('Error loading upscaled images:', e);
        }
    }

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

    // Process form result
    afterUpdate(() => {
        if (form?.success && form?.upscaledImage) {
            upscaledImageUrl = form.upscaledImage;
            loadUpscaledImages();
        } else if (form?.error) {
            error = form.error;
        }
    });

    onMount(() => {
        loadUpscaledImages();
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    });
</script>

<div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-2">
        <h1 class="text-4xl font-bold">อัพสเกลรูปคอสเพลย์</h1>
        {#if pb.authStore.model}
            <button 
                on:click={goToHistory}
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                ดูประวัติการอัพสเกล
            </button>
        {/if}
    </div>
    <p class="text-center text-gray-600 mb-8">เพิ่มความคมชัดและคุณภาพให้กับรูปคอสเพลย์ของคุณด้วย AI</p>
    
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {#if !pb.authStore.model}
            <div class="text-center p-4 bg-yellow-100 rounded-lg mb-6">
                <p class="text-yellow-800">กรุณาเข้าสู่ระบบเพื่อใช้งานฟีเจอร์อัพสเกลรูปภาพ</p>
            </div>
        {/if}

        <div class="space-y-6">
            <!-- File Upload Section -->
            <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors duration-200"
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
                    class="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    เลือกรูปภาพ
                </label>
                <p class="mt-2 text-sm text-gray-600">
                    หรือลากและวางรูปภาพที่นี่
                </p>
                <p class="mt-1 text-xs text-gray-500">
                    รองรับไฟล์: JPG, PNG (ขนาดสูงสุด: 20MB)
                </p>
            </div>

            <!-- Error Message -->
            {#if error}
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            {/if}
            
            {#if form?.error}
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {form.error}
                </div>
            {/if}

            <!-- Advanced Settings Section -->
            <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">ตั้งค่าการอัพสเกล</h3>
                
                <!-- Creativity Slider -->
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
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
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p class="text-xs text-gray-500 mt-1">ค่าแนะนำ: 0.3 - 0.9 (ค่าสูง = สร้างสรรค์มากขึ้น)</p>
                </div>
                
                <!-- Scale Factor Slider -->
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <label for="scaleFactor" class="text-sm font-medium text-gray-700">อัตราส่วนการขยาย</label>
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
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p class="text-xs text-gray-500 mt-1">ค่าแนะนำ: 2x (ค่าสูง = ขนาดใหญ่ขึ้น)</p>
                </div>
                
                <!-- Dynamic Range Slider -->
               <!--  <div class="mb-2">
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
                <div class="border rounded-lg overflow-hidden">
                    <div class="p-2 bg-gray-100 border-b">
                        <h3 class="font-medium">ตัวอย่างรูปภาพ</h3>
                    </div>
                    <div class="p-4">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            class="max-h-64 mx-auto object-contain"
                        />
                    </div>
                </div>
            {/if}

            <!-- Upscale Button -->
            <form method="POST" use:enhance={() => {
                isLoading = true;
                error = null;
                
                return async ({ update }) => {
                    isLoading = false;
                    await update();
                };
            }}>
                <input type="hidden" name="creativity" value={creativity} />
                <input type="hidden" name="scaleFactor" value={scaleFactor} />
                <input type="hidden" name="dynamic" value={dynamic} />
                
                <!-- Hidden file input for form submission -->
                {#if selectedFile}
                    <input type="file" name="file" class="hidden" id="form-file" />
                {/if}
                
                <button
                    type="submit"
                    class="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedFile || isLoading || !pb.authStore.model}
                    on:click={() => {
                        // Copy the selected file to the form input
                        if (selectedFile) {
                            const formFileInput = document.getElementById('form-file') as HTMLInputElement;
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(selectedFile);
                            formFileInput.files = dataTransfer.files;
                        }
                    }}
                >
                    {#if isLoading}
                        <span class="inline-block animate-spin mr-2">⟳</span> กำลังอัพสเกล...
                    {:else}
                        อัพสเกลรูปภาพ
                    {/if}
                </button>
            </form>

            <!-- Result Section -->
            {#if upscaledImageUrl}
                <div class="border rounded-lg overflow-hidden">
                    <div class="p-2 bg-gray-100 border-b flex justify-between items-center">
                        <h3 class="font-medium">รูปภาพที่อัพสเกลแล้ว</h3>
                        <a
                            href={upscaledImageUrl}
                            download="upscaled-image.png"
                            class="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            ดาวน์โหลด
                        </a>
                    </div>
                    <div class="p-4">
                        <img
                            src={upscaledImageUrl}
                            alt="Upscaled"
                            class="max-h-96 mx-auto object-contain"
                        />
                    </div>
                </div>
            {/if}
        </div>
    </div>
    
    <!-- Recent Upscales -->
    {#if upscaledRecords.length > 0 && pb.authStore.model}
        <div class="mt-12">
            <h2 class="text-2xl font-bold mb-4">รูปภาพที่อัพสเกลล่าสุด</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                {#each upscaledRecords.slice(0, 3) as record}
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <div class="aspect-video bg-gray-100">
                            <img
                                src={`${import.meta.env.VITE_PB_URL}/api/files/cbkes123mm2yp1j/${record.id}/${record.Image || record.image}`}
                                alt={record.originalName}
                                class="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <div class="p-3">
                            <h3 class="font-semibold truncate" title={record.originalName}>
                                {record.originalName || 'ไม่มีชื่อ'}
                            </h3>
                            <p class="text-xs text-gray-500">
                                {new Date(record.created).toLocaleDateString('th-TH')}
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
            <div class="text-center mt-4">
                <button
                    on:click={goToHistory}
                    class="text-blue-600 hover:text-blue-800"
                >
                    ดูทั้งหมด
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Custom styles for range inputs */
    input[type="range"] {
        -webkit-appearance: none;
        height: 8px;
        border-radius: 5px;
        background: #d3d3d3;
        outline: none;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #4299e1;
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #4299e1;
        cursor: pointer;
        border: none;
    }
</style> 