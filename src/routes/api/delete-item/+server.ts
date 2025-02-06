import { json } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export const DELETE = async ({ request, locals }) => {
    if (!locals.user.id) {
        throw redirect(302, '/login');
    }

    const adminClient = await createAdminClient();

    try {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) {
            return json({ error: 'Item ID is required' }, { status: 400 });
        }

        // Delete the item
        await adminClient.collection('itemList').delete(id);

        return json({ message: 'Item deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting item:', error);
        return json({ error: error.message }, { status: error.status || 500 });
    }
};