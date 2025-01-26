<script lang="ts">
    export let data: { userInstances: any[] }; // Define data type
</script>

<section class="p-6">
    <h1 class="text-2xl font-bold mb-4">Your PocketBase Instances</h1>
    <a href="/create-pb-instance"><button class="btn btn-primary mb-4">+ Create New Instance</button></a>  
    <p class="mb-4">คุณมี {data.userInstances.length} / 2 PocketBase Instances</p>
    {#if data.userInstances && data.userInstances.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each data.userInstances as instance}
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">{instance.instanceName}</h2>
                        <p>URL: <a href={instance.url+"/_/"} class="text-blue-500" target="_blank">{instance.url}/_/</a></p>
                        <p>UserID: {instance.user || 'N/A'}</p>
                        <p>Created: {new Date(instance.created).toLocaleString()}</p>
                        <p>Version: {instance.versionPb}</p>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p>No instances found.</p>
    {/if}
</section>
