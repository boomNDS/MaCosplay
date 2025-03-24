import { json } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase';

export const PUT = async ({ request, locals }) => {
	const adminClient = await createAdminClient();

	try {
		const formData = await request.formData();
		const userId = locals.user.id;
		const name = formData.get('name');
		const avatar = formData.get('avatar');
		const size = formData.get('size');
		const fbProfile = formData.get('fbProfile');

		console.log(fbProfile);

		if (!userId) {
			return json({ error: 'User ID is required' }, { status: 400 });
		}

		// Fetch existing user profile
		const existingUser = await adminClient.collection('users').getOne(userId);

		// Prepare update data
		const updateData = {
			name,
			size,
			fbProfile
		};

		// Include avatar if it's a File and not null
		if (avatar instanceof File && avatar.size > 0) {
			updateData.avatar = avatar;
		}

		// Check for changes
		const hasChanges = Object.keys(updateData).some((key) => updateData[key] !== existingUser[key]);

		if (!hasChanges) {
			return json({ message: 'No changes detected' }, { status: 200 });
		}

		// Update user profile
		const updatedUser = await adminClient.collection('users').update(userId, updateData);
		return json(updatedUser, { status: 200 });
	} catch (error) {
		console.error('Error updating user profile:', error);
		return json({ error: error.message }, { status: error.status || 500 });
	}
};

function serializeNonPOJOs(obj) {
	return structuredClone(obj);
}
