<script lang="ts">
	import { categories } from '../data/site';
</script>

<div>
	<!-- Mobile Carousel -->
	<div class="carousel mt-10 flex gap-3 xl:hidden">
		{#each categories.filter((category) => category.featured) as category, index (index)}
			<div class="carousel-item relative">
				<figure>
					<img
						src={category.image}
						alt={category.name}
						width="300"
						height="200"
						class="rounded-3xl object-cover"
						loading="lazy"
					/>
				</figure>
				<div
					class="absolute bottom-10 flex w-full flex-col items-center justify-center text-base-100"
				>
					<a href={`/shop`} aria-label={`Go to ${category.name}`}>
						<button
							class="btn btn-md flex items-center justify-center rounded-full"
							aria-label={category.name}
						>
							{category.name}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								class="ml-2"
							>
								<path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
							</svg>
						</button>
					</a>
				</div>
			</div>
		{/each}
	</div>

	<!-- Desktop Grid -->
	<div class="mt-10 hidden gap-5 xl:flex">
		{#each categories.filter((category) => category.featured) as category, index (index)}
			<div class="relative">
				<figure>
					<img
						src={category.image}
						alt={category.name}
						width="500"
						height="200"
						class="rounded-3xl object-cover"
						loading="lazy"
					/>
				</figure>
				<div
					class="absolute bottom-10 flex w-full flex-col items-center justify-center text-base-100"
				>
					<a href={`/shop`} aria-label={`Go to ${category.name}`}>
						<button
							class="btn btn-md flex items-center justify-center rounded-full"
							aria-label={category.name}
						>
							{category.name}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								class="ml-2"
							>
								<path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
							</svg>
						</button>
					</a>
				</div>
			</div>
		{/each}
	</div>
</div>
