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
    <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
            <h1 class="text-3xl font-bold">ประวัติการอัพสเกลรูปภาพ</h1>
            {#if userProfile}
                <div class="ml-4 flex items-center">
                    <img 
                        src={getUserProfileImage(userProfile)} 
                        alt="โปรไฟล์" 
                        class="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                        on:error={handleImageError}
                    />
                    <span class="ml-2 font-medium">{userProfile.name || userProfile.username}</span>
                </div>
            {/if}
        </div>
        <button 
            on:click={goToUpscaler}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            อัพสเกลรูปภาพใหม่
        </button>
    </div>
    
    {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <p>{error}</p>
            {#if data.errorDetails}
                <details class="mt-2 text-xs">
                    <summary class="cursor-pointer">ข้อมูลการแก้ไขปัญหา</summary>
                    <pre class="mt-2 p-2 bg-gray-100 rounded overflow-auto">{data.errorDetails}</pre>
                </details>
            {/if}
        </div>
    {:else}
        <!-- User Stats -->
        {#if userProfile}
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div class="flex items-center mb-4 md:mb-0">
                        <img 
                            src={getUserProfileImage(userProfile)} 
                            alt="โปรไฟล์" 
                            class="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
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
        <div class="bg-white rounded-lg shadow-md p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Search -->
                <div>
                    <label for="search" class="block text-sm font-medium text-gray-700 mb-1">ค้นหาจากชื่อไฟล์</label>
                    <div class="relative">
                        <input
                            type="text"
                            id="search"
                            bind:value={searchTerm}
                            placeholder="ค้นหา..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                
                <!-- Date Filter -->
                <div>
                    <label for="date-filter" class="block text-sm font-medium text-gray-700 mb-1">กรองตามวันที่</label>
                    <input
                        type="date"
                        id="date-filter"
                        bind:value={filterDate}
                        on:change={handleDateChange}
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <!-- Sort By -->
                <div>
                    <label for="sort-by" class="block text-sm font-medium text-gray-700 mb-1">เรียงตาม</label>
                    <select
                        id="sort-by"
                        bind:value={sortBy}
                        on:change={handleSortChange}
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        ค้นหา
                    </button>
                    <button
                        on:click={clearFilters}
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        ล้างตัวกรอง
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Results Section -->
        {#if isLoading}
            <div class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        {:else if upscaledRecords.length === 0}
            <div class="bg-gray-100 rounded-lg p-8 text-center">
                <p class="text-lg text-gray-600">ไม่พบประวัติการอัพสเกลรูปภาพ</p>
                <p class="text-sm text-gray-500 mt-2">คุณยังไม่เคยอัพสเกลรูปภาพ หรือรูปภาพอาจถูกลบไปแล้ว</p>
                
                <button 
                    on:click={goToUpscaler}
                    class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {#each upscaledRecords as record}
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <div class="relative aspect-video bg-gray-100">
                            <!-- Display the upscaled image -->
                            <img
                                src={`${import.meta.env.VITE_PB_URL}/api/files/cbkes123mm2yp1j/${record.id}/${record.Image || record.image}`}
                                alt={record.originalName}
                                class="w-full h-full object-cover"
                                loading="lazy"
                                on:error={handleImageError}
                            />
                            <!-- Debug info for image -->
                            <div class="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                                ID: {record.id.substring(0, 8)}...
                            </div>
                        </div>
                        <div class="p-4">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-semibold text-lg truncate" title={record.originalName}>
                                    {record.originalName || 'ไม่มีชื่อ'}
                                </h3>
                                {#if record.expand?.user}
                                    <img 
                                        src={getUserProfileImage(record.expand.user)} 
                                        alt="โปรไฟล์" 
                                        class="w-6 h-6 rounded-full object-cover ml-2 flex-shrink-0"
                                        on:error={handleImageError}
                                    />
                                {/if}
                            </div>
                            <p class="text-sm text-gray-500 mb-2">
                                {formatDate(record.created)}
                            </p>
                            
                            {#if record.creativity || record.scaleFactor || record.dynamic}
                                <div class="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-600">
                                    {#if record.creativity}
                                        <div class="bg-gray-100 p-1 rounded text-center">
                                            ความสร้างสรรค์: {parseFloat(record.creativity).toFixed(2)}
                                        </div>
                                    {/if}
                                    {#if record.scaleFactor}
                                        <div class="bg-gray-100 p-1 rounded text-center">
                                            ขยาย: {record.scaleFactor}x
                                        </div>
                                    {/if}
                                    {#if record.dynamic}
                                        <div class="bg-gray-100 p-1 rounded text-center">
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
                                    class="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    ดูเต็ม
                                </a>
                                <button 
                                    on:click={() => downloadImage(record)}
                                    class="text-green-600 hover:text-green-800 text-sm"
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
                <div class="flex justify-center mt-6">
                    <nav class="inline-flex rounded-md shadow">
                        <button 
                            on:click={() => goToPage(1)}
                            disabled={currentPage === 1}
                            class="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            &laquo;
                        </button>
                        <button 
                            on:click={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            class="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            &lsaquo;
                        </button>
                        
                        <div class="px-4 py-2 border-t border-b border-gray-300 bg-white text-blue-600 font-medium">
                            {currentPage} / {totalPages}
                        </div>
                        
                        <button 
                            on:click={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            class="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            &rsaquo;
                        </button>
                        <button 
                            on:click={() => goToPage(totalPages)}
                            disabled={currentPage === totalPages}
                            class="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            &raquo;
                        </button>
                    </nav>
                </div>
            {/if}
        {/if}
    {/if}
</div> 