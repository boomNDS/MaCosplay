import { json } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase/index';
import { serializeNonPOJOs } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export const PUT = async ({ request, locals }) => {

    if(!locals.user.id){
        throw redirect(302, '/login');
    }

    const data = await request.formData();
    const banner = data.get('banner'); // Get the banner file
    const shopId = data.get('shopId'); // Get the shop ID


    if (!banner || !shopId) {
        return json({ error: 'Banner image and shop ID are required.' }, { status: 400 });
    }

    // Create the admin client for PocketBase
    const adminClient = await createAdminClient();

    try {
        // Update the shop's banner image
        const updatedRecord = await locals.pb.collection('userStore').update(shopId, {
            banner // Update the banner field
        });


        console.log('Shop banner updated:', updatedRecord);

        // Return a success response
        return json({
            message: 'Banner updated successfully',
            cosplayStore: updatedRecord,
        });
    } catch (error) {
        console.error('Error updating banner in PocketBase:', error);
        return json({ error: error.message }, { status: 500 }); // Return an error response
    }
}