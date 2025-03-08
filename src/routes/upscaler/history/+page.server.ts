import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createAdminClient } from '$lib/pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
    // If user is not logged in, redirect to login page
    if (!locals?.user) {
        throw redirect(302, '/login?redirect=/upscaler/history');
    }

    try {
        // Create admin client for server-side operations
        const adminPb = await createAdminClient();

        // Get user's upscaled images
        const records = await adminPb.collection('upscaler').getList(1, 12, {
            filter: `user = "${locals.user.id}"`,
            sort: '-created',
            expand: 'user'
        });

        // Get user profile with avatar
        const userProfile = await adminPb.collection('users').getOne(locals.user.id, {
            expand: 'avatar'
        });

        // Add debug information
        console.log('Server-side records:', records.items);
        console.log('User profile:', userProfile);

        return {
            title: 'ประวัติการอัพสเกลรูปภาพ',
            upscaledRecords: records.items,
            totalRecords: records.totalItems,
            totalPages: Math.ceil(records.totalItems / 12),
            userProfile
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return {
            title: 'ประวัติการอัพสเกลรูปภาพ',
            upscaledRecords: [],
            totalRecords: 0,
            totalPages: 1,
            error: 'ไม่สามารถโหลดข้อมูลได้'
        };
    }
}; 