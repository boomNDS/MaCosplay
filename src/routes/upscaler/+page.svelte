<!-- Upscaler.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';
    
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

            const records = await pb.collection('upscaler').getList(1, 10, {
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

    async function handleUpscale() {
        if (!selectedFile) return;
        if (!pb.authStore.model?.id) {
            error = 'กรุณาเข้าสู่ระบบเพื่อใช้งานฟีเจอร์นี้';
            return;
        }

        isLoading = true;
        error = null;

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            
            // Add upscaling parameters
            formData.append('creativity', creativity.toString());
            formData.append('scaleFactor', scaleFactor.toString());
            formData.append('dynamic', dynamic.toString());

            const response = await fetch('/upscaler', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            upscaledImageUrl = data.upscaledImage;
            await loadUpscaledImages(); // Reload the list after successful upload
        } catch (e) {
            error = e instanceof Error ? e.message : 'ไม่สามารถอัพสเกลรูปภาพได้';
            console.error('Upscale error:', e);
        } finally {
            isLoading = false;
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
                        min="1" 
                        max="2" 
                        step="0.5" 
                        bind:value={scaleFactor}
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p class="text-xs text-gray-500 mt-1">ค่าแนะนำ: 2x (ค่าสูง = ขนาดใหญ่ขึ้น)</p>
                </div>
                
                <!-- Dynamic Range Slider -->
                <div class="mb-2">
                    <div class="flex justify-between items-center mb-2">
                        <label for="dynamic" class="text-sm font-medium text-gray-700">ช่วงไดนามิก (HDR)</label>
                        <span class="text-sm text-gray-500">{dynamic}</span>
                    </div>
                    <input 
                        type="range" 
                        id="dynamic" 
                        min="1" 
                        max="50" 
                        step="1" 
                        bind:value={dynamic}
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p class="text-xs text-gray-500 mt-1">ค่าแนะนำ: 3 - 9 (ค่าสูง = คอนทราสต์มากขึ้น)</p>
                </div>
            </div>

            <!-- Preview Section -->
            {#if previewUrl}
                <div class="mt-6">
                    <h3 class="text-lg font-semibold mb-2">รูปภาพต้นฉบับ</h3>
                    <img
                        src={previewUrl}
                        alt="ตัวอย่างรูปภาพ"
                        class="max-w-full h-auto rounded-lg shadow-md"
                    />
                    <button
                        on:click={handleUpscale}
                        disabled={isLoading || !pb.authStore.model}
                        class="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'กำลังอัพสเกล...' : 'อัพสเกลรูปภาพ'}
                    </button>
                </div>
            {/if}

            <!-- Result Section -->
            {#if upscaledImageUrl}
                <div class="mt-6">
                    <h3 class="text-lg font-semibold mb-2">รูปภาพที่อัพสเกลแล้ว</h3>
                    <img
                        src={upscaledImageUrl}
                        alt="รูปภาพที่อัพสเกลแล้ว"
                        class="max-w-full h-auto rounded-lg shadow-md"
                    />
                    <a
                        href={upscaledImageUrl}
                        download="upscaled-image.png"
                        class="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        ดาวน์โหลดรูปภาพ
                    </a>
                </div>
            {/if}

            <!-- Previous Upscales Section -->
            {#if upscaledRecords.length > 0}
                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">รูปภาพที่เคยอัพสเกล</h3>
                    <div class="grid grid-cols-2 gap-4">
                        {#each upscaledRecords as record}
                            <div class="bg-gray-50 rounded-lg p-3">
                                <img
                                    src={pb.getFileUrl(record, record.Image)}
                                    alt={record.originalName}
                                    class="w-full h-auto rounded-lg"
                                />
                                <p class="mt-2 text-sm text-gray-600 truncate">
                                    {record.originalName}
                                </p>
                                <p class="text-xs text-gray-500">
                                    {new Date(record.created).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Feature Description -->
            <div class="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 class="text-xl font-semibold mb-4">เกี่ยวกับฟีเจอร์อัพสเกลรูปภาพ</h3>
                <div class="space-y-4">
                    <p>ฟีเจอร์อัพสเกลรูปภาพช่วยให้คุณสามารถเพิ่มความคมชัดและคุณภาพให้กับรูปคอสเพลย์ของคุณได้อย่างง่ายดาย โดยใช้เทคโนโลยี AI ที่ทันสมัย</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div class="bg-white p-4 rounded-lg shadow">
                            <h4 class="font-semibold text-lg mb-2">เพิ่มความละเอียด</h4>
                            <p class="text-sm text-gray-600">เพิ่มความละเอียดของรูปภาพโดยไม่ทำให้เกิดความเบลอหรือจุดรบกวน</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow">
                            <h4 class="font-semibold text-lg mb-2">ปรับปรุงคุณภาพ</h4>
                            <p class="text-sm text-gray-600">ปรับปรุงคุณภาพของรูปภาพให้ดูสวยงามและคมชัดมากขึ้น</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow">
                            <h4 class="font-semibold text-lg mb-2">ใช้งานง่าย</h4>
                            <p class="text-sm text-gray-600">เพียงอัพโหลดรูปภาพและกดปุ่มอัพสเกล ระบบจะทำงานให้โดยอัตโนมัติ</p>
                        </div>
                    </div>
                    
                    <!-- <p class="text-sm text-gray-500 mt-4">หมายเหตุ: ฟีเจอร์นี้ใช้เทคโนโลยี AI จาก Clarity Upscaler โดย philz1337x เพื่อให้ได้ผลลัพธ์ที่ดีที่สุด</p> -->
                </div>
            </div>
        </div>
    </div>
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