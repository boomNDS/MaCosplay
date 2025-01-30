<script lang="ts">
	import '../app.css';
	import "tailwindcss/tailwind.css";
	let { children, data } = $props();

	// Function to save theme preference
	function saveThemePreference(theme: string) {
		if (typeof window !== 'undefined') {
			localStorage.setItem('theme', theme);
		}
	}

	// Function to load theme preference
	function loadThemePreference() {
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem('theme');
			if (savedTheme) {
				document.documentElement.setAttribute('data-theme', savedTheme);
			}
		}
	}

	// Call loadThemePreference on component mount
	if (typeof window !== 'undefined') {
		loadThemePreference();
	}

	function toggleTheme(event: Event) {
		const isChecked = (event.target as HTMLInputElement).checked;
		const theme = isChecked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		saveThemePreference(theme);
	}
</script>

<div class="max-w-6xl mx-auto">
	<div class="navbar bg-base-100 bg-opacity-90 backdrop-blur-sm sticky top-0 z-10">
		<div class="navbar-start">
		  <div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
			  <svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
				  stroke-linecap="round"
				  stroke-linejoin="round"
				  stroke-width="2"
				  d="M4 6h16M4 12h8m-8 6h16" />
			  </svg>
			</div>
			<ul
			  tabindex="0"
			  class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
			  <li><a>บทความ</a></li>
			  <li>
				<a>Parent</a>
				<ul class="p-2">
				  <li><a>Submenu 1</a></li>
				  <li><a>Submenu 2</a></li>
				</ul>
			  </li>
			  <li><a>Item 3</a></li>
			</ul>
		  </div>
		  <h1 class="btn btn-ghost text-xl"><a href="/">MaCosplay</a></h1>
		</div>
		<div class="navbar-center hidden lg:flex">
		  <ul class="menu menu-horizontal px-1">
			<li><a>บทความ</a></li>
			<li>
			  <details>
				<summary>เรียนรู้เพิ่มเติม</summary>
				<ul class="p-2">
				  <li><a>Submenu 1</a></li>
				  <li><a>Submenu 2</a></li>
				</ul>
			  </details>
			</li>
			<li><a>Docs</a></li>
		  </ul>
		</div>
		<div class="navbar-end">
			{#if data.user}
			<form action="/logout" method="POST">
				<button class="btn" type="submit">Logout</button>
			</form>
			<div class="dropdown dropdown-end">
				<button tabindex="0" class="btn btn-ghost">
					ตั้งค่า
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
					<li><a href="/manage-access">จัดการสิทธิการเข้าถึง</a></li>
					<!-- Add more settings options here if needed -->
				</ul>
			</div>
			{:else}
				<a href="/login" class="btn">Login</a>
			{/if}
			<label class="flex cursor-pointer gap-2">
				<svg
				  xmlns="http://www.w3.org/2000/svg"
				  width="20"
				  height="20"
				  viewBox="0 0 24 24"
				  fill="none"
				  stroke="currentColor"
				  stroke-width="2"
				  stroke-linecap="round"
				  stroke-linejoin="round">
				  <circle cx="12" cy="12" r="5" />
				  <path
					d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
				</svg>
				<input type="checkbox" value="dark" class="toggle theme-controller" on:change={toggleTheme} />
				<svg
				  xmlns="http://www.w3.org/2000/svg"
				  width="20"
				  height="20"
				  viewBox="0 0 24 24"
				  fill="none"
				  stroke="currentColor"
				  stroke-width="2"
				  stroke-linecap="round"
				  stroke-linejoin="round">
				  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
				</svg>
			  </label>
		</div>
	  </div>
	  {@render children()}
</div>



  