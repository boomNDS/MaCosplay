<script lang="ts">
	import { pricingPlans } from './pricing_plans';
	import { goto } from '$app/navigation';

	async function checkout(price_id: string) {
		console.log(price_id);
		let res;
		res = await fetch('/api/stripe/checkout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				items: [{ id: price_id, quantity: 1 }],
				mode: 'payment'
			})
		});
		if (res?.status == 401) {
			goto('/register');
		}
		const url = await res.json();
		if (url?.url?.includes('https://')) {
			console.log(url);
			window.open(url.url, '_blank');
		} else {
			goto(url.url);
		}
	}

	// Module context
	export let data;
	export let highlightedPlanId: string = '';
	export let callToAction: string;
	export let currentPlanId: string = '';
	export let center = true;

	let packages = JSON.parse(data?.packages).sort((a, b) => {
		if (a.name === 'LifeTime') return -1;
		if (b.name === 'LifeTime') return 1;
		if (a.price_monthly === 0) return 1;
		if (b.price_monthly === 0) return -1;
		if (a.price_monthly === -5) return 1;
		if (b.price_monthly === -5) return -1;
		return a.price_monthly - b.price_monthly;
	});
</script>

<div class="flex flex-col gap-10 lg:flex-row {center ? 'place-content-center' : ''} flex-wrap">
	{#each packages as plan}
		<div
			class="card card-bordered flex-none {plan.name === highlightedPlanId
				? 'border-primary'
				: 'border-gray-200'} min-w-[260px] max-w-[310px] flex-1 flex-grow p-6 shadow-xl"
		>
			<div class="flex h-full flex-col">
				<div class="text-xl font-bold">{plan.name}</div>
				<p class="mt-2 text-sm leading-relaxed text-gray-500">
					{@html plan.description}
				</p>
				<div class="mt-auto pt-4 text-sm text-gray-600">
					Plan Includes:
					{@html plan.features}
				</div>
				<div class="pt-8">
					<span class="text-4xl font-bold">{plan.currency}{plan.price}</span>
					<span class="text-gray-400">{plan.priceIntervalName}</span>
					<div class="mt-6 flex flex-1 flex-row items-center pt-4">
						<!-- {#if plan.id === currentPlanId}
							<div class="btn btn-outline btn-success no-animation w-[80%] mx-auto cursor-default">
								Current Plan
							</div>
						{:else} -->
						<button
							on:click={async (e) => {
								e.preventDefault();
								await checkout(plan?.price_id ?? 'free_plan');
							}}
							class="btn btn-outline btn-secondary mx-auto w-[80%]"
						>
							อัพเกรด
						</button>
						<!-- {/if} -->
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
