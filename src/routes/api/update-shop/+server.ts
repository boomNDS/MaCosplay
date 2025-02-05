import { json } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase/index';
import { serializeNonPOJOs } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export const PUT = async ({ request, locals }) => {

    if (!locals.user.id) {
        throw redirect(302, '/login');
    }

    const data = await request.formData();
    const banner = data.get('banner'); // Get the banner file
    const shopId = data.get('shopId'); // Get the shop ID
    const fbPage = data.get('fbPage'); // Get the fbPage

    if (!shopId) {
        return json({ error: 'Shop ID is required.' }, { status: 400 });
    }

    // Create the admin client for PocketBase
    const adminClient = await createAdminClient();

    try {
        // Prepare the update data
        const updateData = {};
        if (banner) updateData.banner = banner; // Update the banner field if provided
        if (fbPage) updateData.fbPage = fbPage; // Update the fbPage field if provided

        // Update the shop's details
        const updatedRecord = await locals.pb.collection('userStore').update(shopId, updateData);

        console.log('Shop details updated:', updatedRecord);

        // Return a success response
        return json({
            message: 'Shop details updated successfully',
            cosplayStore: updatedRecord,
        });
    } catch (error) {
        console.error('Error updating shop details in PocketBase:', error);
        return json({ error: error.message }, { status: 500 }); // Return an error response
    }
}