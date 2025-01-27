import { json } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase/index';
import { serializeNonPOJOs } from '$lib/utils';



export async function POST({ locals, request }) {
    const { shopName, shopDetails } = await request.json(); // Get the username from the request body
    
    // Create the admin client for PocketBase
    const adminClient = await createAdminClient();
    const record = serializeNonPOJOs(await locals.pb.collection('users').getOne(locals.user.id));
    try {

        if (record.MaxShop <= 0) {
            const responseToken = new Response(JSON.stringify({ error: 'สร้างได้สูงสุด 1 รายการเท่านั้น' }), {
                status: 501,
                headers: {
                    'content-type': 'application/json'
                }
            });

            return responseToken;
        }

        const resultList = await adminClient.collection('userStore').getList(1, 1, { sort: '-created' });
        console.log(serializeNonPOJOs(resultList?.items[0].Code));
        const port = resultList?.items[0].Code + 1;
        // Step 1: Create the instance via your backend
        /* const response = await fetch('https://i18jk.saas.in.th/create-instance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, port, version}),
        });

        if (!response.ok) {
            const errorBody = await response.text(); // Get the error response body
            throw new Error(`Error: ${response.statusText} - ${errorBody}`);
        } */

        /* const instanceData = await response.json(); // Parse the response data
         */
        // Step 2: Save instance data to PocketBase
        const records = await adminClient.collection('userStore').create({
            Name: shopName,
            user: locals.user.id,
            Details: shopDetails,
        });

        if (record.MaxShop >= 1) {
            const MaxShop = (await record.MaxShop) - 1;
            await adminClient.collection('users').update(locals.user.id, { MaxShop });
        }

        console.log('Cosplay Store create:', record);

        // Step 4: Return the combined response data
        return json({
            message: 'Store created and stored successfully',
            cosplayStore: records,
        });
    } catch (error) {
        console.error('Error creating instance or saving to PocketBase:', error);
        return json({ error: error.message }, { status: 500 }); // Return an error response
    }
}