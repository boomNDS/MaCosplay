import { json } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

export const POST = async ({ locals, request }) => {
    const adminClient = await createAdminClient();
    
    try {
        const formData = await request.formData();
        
        // Extract all necessary fields
        const image = formData.get('image');
        const name = formData.get('name');
        const details = formData.get('details');
        const price = formData.get('price');
        const size = formData.get('size');
        const status = formData.get('status');
        const province = formData.get('province');

        // Validate required fields
        if (!name || !price || !size || !status || !province) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Prepare item data
        const itemData = {
            Name: name,
            Details: details,
            price: parseFloat(price),
            Size: size,
            Status: status,
            Province: province,
            user: locals.user.id,
            Image: image instanceof File ? image : null
        };

        // Create the item in PocketBase
        const record = await adminClient.collection('itemList').create(itemData);

        return json({
            message: 'Item created successfully',
            item: serializeNonPOJOs(record)
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating item:', error);
        return json({ error: error.message }, { status: error.status || 500 });
    }
};