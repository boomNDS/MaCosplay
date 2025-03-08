import { fail } from '@sveltejs/kit';
import Replicate from 'replicate';
import { createAdminClient } from '$lib/pocketbase';
import type { ClientResponseError } from 'pocketbase';

export const actions = {
    default: async ({ request, locals }) => {
        try {
            const formData = await request.formData();
            const file = formData.get('file') as File;
            const userId = locals.user?.id;
            
            // Get upscaling parameters from the request
            const creativity = parseFloat(formData.get('creativity') as string) || 0.35;
            const scaleFactor = parseFloat(formData.get('scaleFactor') as string) || 2;
            const dynamic = parseFloat(formData.get('dynamic') as string) || 6;
            
            console.log('Upscaling parameters:', { creativity, scaleFactor, dynamic });
            
            if (!file) {
                return fail(400, { error: 'Image file is required' });
            }

            if (!userId) {
                return fail(400, { error: 'User ID is required' });
            }

            // Convert the file to base64
            const arrayBuffer = await file.arrayBuffer();
            const base64Image = Buffer.from(arrayBuffer).toString('base64');
            const dataUrl = `data:${file.type};base64,${base64Image}`;

            // Replicate API call
            const replicate = new Replicate({
                auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
            });

            const output = await replicate.run(
                "philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
                {
                    input: {
                        image: dataUrl,
                        creativity: creativity,
                        scale_factor: scaleFactor,
                        dynamic: dynamic
                    }
                }
            );

            if (!output) {
                return fail(500, { error: 'No output received from upscaler' });
            }

            // Get the upscaled image URL
            const upscaledImageUrl = Array.isArray(output) ? output[0] : output;

            if (!upscaledImageUrl) {
                return fail(500, { error: 'No valid image URL found in upscaler response' });
            }

            try {
                const adminClient = await createAdminClient();

                // Fetch the image from the upscaled URL
                const response = await fetch(upscaledImageUrl);
                if (!response.ok) {
                    return fail(500, { error: `Failed to fetch upscaled image: ${response.statusText}` });
                }
                
                const imageBuffer = await response.arrayBuffer();
                const blob = new Blob([imageBuffer], { type: 'image/png' });
                const fileName = `upscaled_${Date.now()}_${Math.random().toString(36).substring(2, 10)}.png`;
                const imageFile = new File([blob], fileName, { type: 'image/png' });

                // Create FormData for PocketBase
                const pbFormData = new FormData();
                pbFormData.append('user', userId);
                pbFormData.append('originalName', file.name);
                pbFormData.append('status', 'completed');
                pbFormData.append('creativity', creativity.toString());
                pbFormData.append('scaleFactor', scaleFactor.toString());
                pbFormData.append('dynamic', dynamic.toString());
                pbFormData.append('Image', imageFile); // Using capital 'I' for Image field

                // Create record in the correct collection (cbkes123mm2yp1j)
                const record = await adminClient.collection('cbkes123mm2yp1j').create(pbFormData);
                console.log('Created record:', record);

                // Construct the final image URL using the correct format
                const baseUrl = import.meta.env.VITE_PB_URL;
                const finalImageUrl = `${baseUrl}/api/files/cbkes123mm2yp1j/${record.id}/${record.Image}`;
                console.log('Final image URL:', finalImageUrl);

                return { 
                    success: true,
                    upscaledImage: finalImageUrl,
                    record: record
                };

            } catch (pbError) {
                console.error('PocketBase error:', pbError);
                const error = pbError as ClientResponseError;
                return fail(error.status || 500, { 
                    error: error.message || 'Failed to save upscaled image',
                    details: error.response?.data || {}
                });
            }
        } catch (err) {
            console.error('Error upscaling image:', err);
            const error = err as Error;
            return fail(500, { 
                error: error.message || 'Failed to upscale image'
            });
        }
    }
}; 