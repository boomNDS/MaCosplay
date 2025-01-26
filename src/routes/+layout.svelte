<script lang="ts">
	import '../app.css';
	import "tailwindcss/tailwind.css";
	let { children, data } = $props();

</script>

<div class="max-w-6xl mx-auto">
	<div class="navbar bg-base-100 sticky top-0 z-10">
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
			{:else}
				<a href="/login" class="btn">Login</a>
			{/if}
		</div>
	  </div>
	  {@render children()}
</div>



  