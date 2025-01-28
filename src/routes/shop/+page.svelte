<script lang="ts">
    export let data: { itemList: any[] }; // Define data type
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

    console.log(data?.itemList);

    // Helper function to limit text length
    const limitText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };
</script>


<section id="filter" class="pt-12 sm:pt-12 md:pt-14">
    <div class="flex container mx-auto p-4 sm:p-6">
        <label class="input input-bordered flex items-center gap-2">
            <input type="text" class="grow" placeholder="ค้นหา" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="h-4 w-4 opacity-70">
              <path
                fill-rule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clip-rule="evenodd" />
            </svg>
        </label>
    
        <!-- ตัวกรองจังหวัดใหม่ -->
        <label class="input input-bordered flex items-center gap-2">
            <select class="grow" bind:value={selectedProvince}>
                <option value="">เลือกจังหวัด</option>
                <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                <option value="เชียงใหม่">เชียงใหม่</option>
                <option value="ภูเก็ต">ภูเก็ต</option>
                <option value="กระบี่">กระบี่</option>
                <option value="ชลบุรี">ชลบุรี</option>
                <option value="นครราชสีมา">นครราชสีมา</option>
                <option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
                <option value="พัทยา">พัทยา</option>
                <!-- เพิ่มจังหวัดเพิ่มเติมตามต้องการ -->
            </select>
        </label>

        <!-- ตัวกรองขนาดใหม่ -->
        <label class="input input-bordered flex items-center gap-2">
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

