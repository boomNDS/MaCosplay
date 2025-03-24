import { fail, redirect } from '@sveltejs/kit';
import Replicate from 'replicate';
import { createAdminClient } from '$lib/pocketbase';
import type { ClientResponseError } from 'pocketbase';
import type { PageServerLoad } from './$types';

// Server-side authentication check
export const load: PageServerLoad = async ({ locals }) => {
	// If user is not logged in, redirect to login page with return URL
	if (!locals?.user) {
		throw redirect(302, '/login?redirect=/upscaler');
	}

	try {
		// Create admin client for server-side operations
		const adminPb = await createAdminClient();

		// Get user's recent upscaled images
		const records = await adminPb.collection('cbkes123mm2yp1j').getList(1, 3, {
			filter: `user = "${locals.user.id}"`,
			sort: '-created'
		});

		// Get user profile
		const userProfile = await adminPb.collection('users').getOne(locals.user.id);

		return {
			title: 'อัพสเกลรูปคอสเพลย์',
			recentUpscaledRecords: records.items,
			userProfile,
			authenticated: true
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			title: 'อัพสเกลรูปคอสเพลย์',
			recentUpscaledRecords: [],
			authenticated: true,
			error: 'ไม่สามารถโหลดข้อมูลล่าสุดได้'
		};
	}
};

export const actions = {
	upscale: async ({ request, locals }) => {
		// Check if user is authenticated
		if (!locals?.user?.id) {
			return fail(401, { error: 'กรุณาเข้าสู่ระบบเพื่อใช้งานฟีเจอร์นี้' });
		}

		try {
			const formData = await request.formData();
			const file = formData.get('file');
			const userId = locals.user.id;

			// Get upscaling parameters from the request
			const creativity = parseFloat(formData.get('creativity') as string) || 0.35;
			const scaleFactor = parseFloat(formData.get('scaleFactor') as string) || 2;
			const dynamic = parseFloat(formData.get('dynamic') as string) || 6;

			console.log('Upscaling parameters:', { creativity, scaleFactor, dynamic });
			console.log('File received:', file ? 'Yes' : 'No', file ? `Type: ${typeof file}` : '');

			if (!file) {
				return fail(400, { error: 'Image file is required' });
			}

			// Check if the file is a valid file object
			if (!(file instanceof Blob)) {
				console.error('File is not a Blob or File object:', typeof file);
				return fail(400, { error: 'Invalid file format' });
			}

			// Convert the file to base64
			let base64Image: string;
			try {
				// Check if we're in a Node.js environment
				if (typeof process !== 'undefined' && process.versions && process.versions.node) {
					// Node.js environment (development)
					console.log('Using Node.js approach for file processing');

					// Use arrayBuffer and Buffer for Node.js
					if (file instanceof Blob) {
						const arrayBuffer = await file.arrayBuffer();
						base64Image = Buffer.from(arrayBuffer).toString('base64');
					} else {
						throw new Error('File is not a valid Blob object');
					}
				} else {
					// Browser/Edge environment (production)
					console.log('Using browser approach for file processing');

					// Use fetch API to convert the file to base64
					const fileData = await file.arrayBuffer();
					const bytes = new Uint8Array(fileData);
					const len = bytes.byteLength;
					let binary = '';
					for (let i = 0; i < len; i++) {
						binary += String.fromCharCode(bytes[i]);
					}
					base64Image = btoa(binary);
				}
			} catch (error) {
				console.error('Error processing file:', error);
				return fail(500, {
					error: 'Failed to process the image file',
					details: error instanceof Error ? error.message : 'Unknown error'
				});
			}

			// Get file type for the data URL
			const fileType = (file as File).type || 'image/png';
			const dataUrl = `data:${fileType};base64,${base64Image}`;

			// Replicate API call
			try {
				const replicate = new Replicate({
					auth: import.meta.env.VITE_REPLICATE_API_TOKEN
				});

				console.log('Calling Replicate API...');
				const output = await replicate.run(
					'philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e',
					{
						input: {
							image: dataUrl,
							creativity: creativity,
							scale_factor: scaleFactor,
							dynamic: dynamic
						}
					}
				);

				console.log('Replicate API response:', output);
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
					console.log('Fetching upscaled image from:', upscaledImageUrl);
					const response = await fetch(upscaledImageUrl);
					if (!response.ok) {
						return fail(500, { error: `Failed to fetch upscaled image: ${response.statusText}` });
					}

					const imageBuffer = await response.arrayBuffer();

					// Create a blob from the array buffer
					let blob: Blob;
					try {
						blob = new Blob([imageBuffer], { type: 'image/png' });
					} catch (blobError) {
						console.error('Error creating Blob:', blobError);
						return fail(500, {
							error: 'Failed to process the upscaled image',
							details: blobError instanceof Error ? blobError.message : 'Error creating Blob'
						});
					}

					const fileName = `upscaled_${Date.now()}_${Math.random().toString(36).substring(2, 10)}.png`;

					// Create a File object from the blob
					let imageFile: File;
					try {
						imageFile = new File([blob], fileName, { type: 'image/png' });
					} catch (fileError) {
						console.error('Error creating File:', fileError);
						// If File constructor fails, try to use the blob directly
						return fail(500, {
							error: 'Failed to create file from upscaled image',
							details: fileError instanceof Error ? fileError.message : 'Error creating File'
						});
					}

					// Create FormData for PocketBase
					const pbFormData = new FormData();
					pbFormData.append('user', userId);
					pbFormData.append('originalName', (file as File).name || 'upscaled-image.png');
					pbFormData.append('status', 'completed');
					pbFormData.append('creativity', creativity.toString());
					pbFormData.append('scaleFactor', scaleFactor.toString());
					pbFormData.append('dynamic', dynamic.toString());

					// Try to append the file, with fallback to blob if needed
					try {
						pbFormData.append('Image', imageFile);
					} catch (appendError) {
						console.error('Error appending file to FormData:', appendError);
						// Try with blob as fallback
						try {
							pbFormData.append('Image', blob, fileName);
						} catch (blobAppendError) {
							console.error('Error appending blob to FormData:', blobAppendError);
							return fail(500, {
								error: 'Failed to prepare image for upload',
								details: 'Could not append image to form data'
							});
						}
					}

					// Create record in the correct collection (cbkes123mm2yp1j)
					console.log('Creating record in PocketBase...');
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
			} catch (replicateError) {
				console.error('Replicate API error:', replicateError);
				return fail(500, {
					error: 'Failed to upscale image with AI service',
					details: replicateError instanceof Error ? replicateError.message : 'Unknown error'
				});
			}
		} catch (err) {
			console.error('Error upscaling image:', err);
			const error = err as Error;
			return fail(500, {
				error: error.message || 'Failed to upscale image',
				details: 'Check server logs for more information'
			});
		}
	}
};
