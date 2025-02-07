import { error } from "@sveltejs/kit";
import { serializeNonPOJOs } from "$lib/utils";
import { createAdminClient } from '$lib/pocketbase';
import { invalidate } from '$app/navigation';

export const load = async ({ locals, url }) => {
	console.log('🔹 Page Loaded - URL:', url.toString()); // Check if load() runs
	console.log('🔹 Query Params:', url.searchParams.toString()); // See all params
	console.log('🔍 URL:', url.toString());
	for (const [key, value] of url.searchParams.entries()) {
		console.log(`🔹 ${key}: ${value}`);
	}

	const searchQuery = url.searchParams.get('search') || '';
	const page = parseInt(url.searchParams.get('page') || '1', 9); // Get the current page from query params
	const perPage = 9; // Define how many items per page
	const selectedProvince = url.searchParams.get('province') || '';
	const selectedSize = url.searchParams.get('size') || '';
	const selectedStatus = url.searchParams.get('status') || '';

	console.log('searchQuery:', searchQuery);
	console.log('selectedProvince:', selectedProvince);
	console.log('selectedSize:', selectedSize);
	console.log('selectedStatus:', selectedStatus);

	// Determine if any filter is applied
	const isFilterApplied = Boolean(searchQuery || selectedProvince || selectedSize || selectedStatus);
	console.log('isFilterApplied:', isFilterApplied);

	const getItemList = async () => {
		const adminClient = await createAdminClient();
		try {
			let items = [];
			let totalPages = 1;
			let currentPage = 1;

			if (isFilterApplied) {
				// Use getFullList when filters are applied
				const response = await adminClient.collection('itemList').getFullList({
					filter: `public=True${searchQuery ? ` && Name ~ "${searchQuery}"` : ''}`
						+ `${selectedProvince ? ` && Province="${selectedProvince}"` : ''}`
						+ `${selectedSize ? ` && Size="${selectedSize}"` : ''}`
						+ `${selectedStatus ? ` && Status="${selectedStatus}"` : ''}`,
					expand: 'user,userStore',
					sort: '-created'
				});

				console.log('API Response (Full List):', response);

				items = response.map(item => {
					if (item.expand?.user) {
						item.expand.user = {
							id: item.expand.user.id,
							name: item.expand.user.name,
							fbProfile: item.expand.user.fbProfile,
							VerifyShop: item.expand.user.VerifyShop,
							avatar: item.expand.user.avatar
						};
					}
					return item;
				});
			} else {
				// Use getList when no filters are applied
				const response = await adminClient.collection('itemList').getList(page, perPage, {
					filter: `public=True${searchQuery ? ` && Name ~ "${searchQuery}"` : ''}`
						+ `${selectedProvince ? ` && Province="${selectedProvince}"` : ''}`
						+ `${selectedSize ? ` && Size="${selectedSize}"` : ''}`
						+ `${selectedStatus ? ` && Status="${selectedStatus}"` : ''}`,
					expand: 'user,userStore',
					sort: '-created'
				});

				console.log('API Response (Paginated List):', response);

				items = response.items.map(item => {
					if (item.expand?.user) {
						item.expand.user = {
							id: item.expand.user.id,
							name: item.expand.user.name,
							fbProfile: item.expand.user.fbProfile,
							VerifyShop: item.expand.user.VerifyShop,
							avatar: item.expand.user.avatar
						};
					}
					return item;
				});

				totalPages = response.totalPages;
				currentPage = response.page;
			}

			console.log('Mapped Items:', items);

			const serializedItems = serializeNonPOJOs(items);
			console.log('Serialized Items:', serializedItems);

			return {
				items: serializedItems,
				totalPages,
				currentPage
			};
		} catch (err) {
			console.log('Error fetching user instances: ', err);
			// Default to a 500 status code if err.status is undefined
			throw error(err.status || 500, err.message || 'Internal Server Error');
		}
	};

	if (locals.user) {
		return {
			user: locals.user,
			itemList: await getItemList(),
		};
	}

	return {
		user: undefined,
		itemList: await getItemList(), // Default to an empty array if user is not logged in
	};
};

async function applyFilters() {
	const url = new URL(window.location.href);
	url.searchParams.set("search", searchQuery);
	url.searchParams.set("selectedProvince", selectedProvince);
	url.searchParams.set("selectedSize", selectedSize);
	url.searchParams.set("selectedStatus", selectedStatus);
	
	history.pushState({}, '', url); // Update URL without reload
	await invalidate('items'); // Force SvelteKit to reload data
}