import { json } from '@sveltejs/kit';
import Replicate from 'replicate';
import { createAdminClient } from '$lib/pocketbase';
import type { ClientResponseError } from 'pocketbase';

export async function POST({ request, locals }) {
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
            return json({ error: 'Image file is required' }, { status: 400 });
        }

        if (!userId) {
            return json({ error: 'User ID is required' }, { status: 400 });
        }

        // Convert the file to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64Image}`;

        console.log('Starting Replicate API call...');
        const replicate = new Replicate({
            auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
        });

        // Log the API token (first few characters only for security)
        const apiToken = import.meta.env.VITE_REPLICATE_API_TOKEN;
        console.log('API Token (first 5 chars):', apiToken ? apiToken.substring(0, 5) + '...' : 'undefined');

        console.log('Sending image to Replicate...');
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

        console.log('Replicate API response:', JSON.stringify(output));

        if (!output) {
            throw new Error('No output received from upscaler');
        }

        // Check the type of output
        console.log('Output type:', typeof output);
        
        // If output is an array, log its length
        if (Array.isArray(output)) {
            console.log('Output array length:', output.length);
            if (output.length > 0) {
                console.log('First output item:', output[0]);
                console.log('First output item type:', typeof output[0]);
            }
        } else {
            console.log('Output is not an array, full output:', output);
        }

        // Safely get the image URL
        let upscaledImageUrl = '';
        if (Array.isArray(output) && output.length > 0) {
            upscaledImageUrl = output[0];
        } else if (typeof output === 'string') {
            upscaledImageUrl = output;
        } else if (output && typeof output === 'object') {
            // Try to find a URL in the object
            const possibleUrls = Object.values(output).filter(val => 
                typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'))
            );
            if (possibleUrls.length > 0) {
                upscaledImageUrl = possibleUrls[0] as string;
                console.log('Found URL in object:', upscaledImageUrl);
            }
        }

        if (!upscaledImageUrl) {
            throw new Error('No valid image URL found in upscaler response');
        }

        console.log('Using upscaled image URL:', upscaledImageUrl);

        try {
            // Get admin client for creating records
            const adminClient = await createAdminClient();

            // First, verify the user exists
            try {
                await adminClient.collection('users').getOne(userId);
            } catch (userError) {
                console.error('User verification error:', userError);
                return json({ error: 'Invalid user ID' }, { status: 400 });
            }
            
            // Handle the ReadableStream directly
            let imageBuffer: ArrayBuffer;
            
            // Check if output is an array with a ReadableStream
            if (Array.isArray(output) && output.length > 0 && 
                typeof output[0] === 'object' && output[0] !== null && 
                'locked' in output[0]) {
                // It's a ReadableStream
                console.log('Output is a ReadableStream, reading directly...');
                const stream = output[0] as unknown as ReadableStream<Uint8Array>;
                const reader = stream.getReader();
                const chunks: Uint8Array[] = [];
                
                let done = false;
                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    if (value) {
                        chunks.push(value);
                    }
                }
                
                // Combine all chunks into a single Uint8Array
                const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
                const combinedChunks = new Uint8Array(totalLength);
                let position = 0;
                
                for (const chunk of chunks) {
                    combinedChunks.set(chunk, position);
                    position += chunk.length;
                }
                
                imageBuffer = combinedChunks.buffer;
                console.log('Read image data from stream, size:', imageBuffer.byteLength);
            } else {
                // Try to fetch from URL if it's not a ReadableStream
                console.log('Output is not a ReadableStream, trying to fetch as URL...');
                let imageUrl = '';
                
                if (Array.isArray(output) && output.length > 0) {
                    if (typeof output[0] === 'string') {
                        imageUrl = output[0];
                    }
                } else if (typeof output === 'string') {
                    imageUrl = output;
                }
                
                if (!imageUrl) {
                    throw new Error('No valid image URL found in upscaler response');
                }
                
                console.log('Fetching from URL:', imageUrl);
                const response = await fetch(imageUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch upscaled image: ${response.statusText}`);
                }
                
                imageBuffer = await response.arrayBuffer();
            }
            
            console.log('Image buffer size:', imageBuffer.byteLength);
            
            // Create a blob with the correct MIME type
            const blob = new Blob([imageBuffer], { type: 'image/png' });
            console.log('Blob size:', blob.size);
            
            // Create a File object from the blob
            const fileName = `upscaled-${Date.now()}.png`;
            const imageFile = new File([blob], fileName, { type: 'image/png' });
            
            // Create a new FormData with all fields at once
            const pbFormData = new FormData();
            pbFormData.append('user', userId);
            pbFormData.append('originalName', file.name);
            pbFormData.append('status', 'completed');
            
            // Store the parameters used for upscaling
            pbFormData.append('creativity', creativity.toString());
            pbFormData.append('scaleFactor', scaleFactor.toString());
            pbFormData.append('dynamic', dynamic.toString());
            
            // Use "Image" with capital I to match the PocketBase schema
            pbFormData.append('Image', imageFile);
            
            // Log the FormData entries
            console.log('FormData entries:');
            for (const [key, value] of pbFormData.entries()) {
                console.log(`${key}: ${value instanceof File ? `File (${value.name}, ${value.size} bytes)` : value}`);
            }
            
            // Create the record with all data at once
            console.log('Creating record with file...');
            const record = await adminClient.collection('upscaler').create(pbFormData);
            
            console.log('Created record:', record);
            console.log('Record Image field:', record.Image);
            
            // Get the file URL - use "Image" with capital I
            let imageUrl = '';
            if (record.Image) {
                imageUrl = adminClient.getFileUrl(record, record.Image);
                console.log('Image URL:', imageUrl);
            } else {
                console.error('No Image field in record');
                
                // Try to get the collection schema to debug
                try {
                    const schema = await adminClient.collections.getOne('upscaler');
                    console.log('Collection schema:', schema);
                } catch (e) {
                    console.error('Failed to get collection schema:', e);
                }
            }

            return json({ 
                upscaledImage: imageUrl,
                record: record
            });

        } catch (pbError) {
            console.error('PocketBase error:', pbError);
            const error = pbError as ClientResponseError;
            // Log more detailed error information
            if (error.response?.data) {
                console.error('Detailed error data:', error.response.data);
            }
            return json({ 
                error: error.message || 'Failed to save upscaled image',
                details: error.response?.data || {}
            }, { status: error.status || 500 });
        }
    } catch (err) {
        console.error('Error upscaling image:', err);
        const error = err as Error;
        return json({ 
            error: error.message || 'Failed to upscale image'
        }, { status: 500 });
    }
} 