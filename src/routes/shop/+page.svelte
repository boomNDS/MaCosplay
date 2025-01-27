<script lang="ts">
    export let data: { itemList: any[] }; // Define data type
    console.log(data?.itemList)
</script>

<section id="features" class="pt-16 sm:pt-24 md:pt-28">
    <div class="container mx-auto p-4 sm:p-6">
        <!-- Pocketbase Rental Card -->
        <section class="mb-6">
            <h2 class="mb-2 text-2xl font-semibold">ตามหาชุดเช่าได้ที่นี่เลย</h2>
        </section>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[48rem] overflow-y-auto"> <!-- Limit to 4 rows -->
            {#if data?.itemList && data.itemList.length > 0}
                {#each data.itemList as shop}
                    <div class="card bg-base-100 shadow-xl">
                        <figure>
                            <img 
                                src={`https://macosplay.saas.in.th/api/files/mxj3660ce5olheb/6xxgn4ew6qp4gdu/${shop.Image}`} 
                                alt="{shop.Name} Thumbnail" 
                                class="w-full h-auto max-h-48 object-cover" 
                            />
                        </figure>
                        <div class="card-body">
                            <div class="avatar mb-2">
                                <div class="w-8 h-8 rounded-full overflow-hidden"> <!-- Adjusted size for smaller avatar -->
                                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" class="w-full h-full object-cover" />
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

