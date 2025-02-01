<script lang="ts">
    // Import necessary modules and define any state variables
    let accessPermissions = []; // Example state variable to hold permissions
    
    // Function to fetch current Facebook access permissions
    async function fetchPermissions() {
        // Simulate fetching permissions from an API
        accessPermissions = await fetch('/api/facebook/permissions').then(res => res.json());
    }
    
    // Function to update permissions
    async function updatePermissions() {
        // Simulate updating permissions via an API
        await fetch('/api/facebook/permissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ permissions: accessPermissions })
        });
    }
    
    // Fetch permissions on component mount
    fetchPermissions();
    </script>
    
    <main class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">จัดการสิทธิการเข้าถึง Facebook</h1>
        <div class="mb-4">
            <h2 class="text-xl font-semibold">สิทธิการเข้าถึงปัจจุบัน</h2>
            <ul class="list-disc pl-5">
                {#each accessPermissions as permission}
                    <li>{permission}</li>
                {/each}
            </ul>
        </div>
        <div class="mb-4">
            <button class="btn btn-primary" on:click={updatePermissions}>อัปเดตสิทธิการเข้าถึง</button>
        </div>
    </main>
    
    <style>
    /* Add any necessary styles here */
    </style>