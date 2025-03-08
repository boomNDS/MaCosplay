import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createAdminClient } from '$lib/pocketbase';

export const load: PageServerLoad = async ({ locals, url }) => {
    // If user is not logged in, redirect to login page
    if (!locals?.user) {
        throw redirect(302, `/login?redirect=${url.pathname}`);
    }

    try {
        // Create admin client for server-side operations
        const adminPb = await createAdminClient();

        // Get page parameters
        const page = Number(url.searchParams.get('page')) || 1;
        const perPage = 12;
        const sortBy = url.searchParams.get('sort') || '-created';
        const searchTerm = url.searchParams.get('search') || '';
        const filterDate = url.searchParams.get('date') || '';

        // Build filter
        let filter = `user = "${locals.user.id}"`;
        
        if (searchTerm) {
            filter += ` && (originalName ~ "${searchTerm}")`;
        }
        
        if (filterDate) {
            const date = new Date(filterDate);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            
            filter += ` && (created >= "${date.toISOString()}" && created < "${nextDay.toISOString()}")`;
        }

        // Get user's upscaled images from the correct collection
        const records = await adminPb.collection('cbkes123mm2yp1j').getList(page, perPage, {
            filter: filter,
            sort: sortBy,
            expand: 'user'
        });

        // Get user profile with avatar
        const userProfile = await adminPb.collection('users').getOne(locals.user.id);

        // Add debug information
        console.log('Server-side records count:', records.items.length);
        console.log('User profile loaded:', userProfile.id);

        return {
            title: 'ประวัติการอัพสเกลรูปภาพ',
            upscaledRecords: records.items,
            totalRecords: records.totalItems,
            totalPages: Math.ceil(records.totalItems / perPage),
            userProfile,
            authenticated: true,
            currentPage: page,
            currentSort: sortBy,
            currentSearch: searchTerm,
            currentDate: filterDate
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return {
            title: 'ประวัติการอัพสเกลรูปภาพ',
            upscaledRecords: [],
            totalRecords: 0,
            totalPages: 1,
            authenticated: true,
            error: 'ไม่สามารถโหลดข้อมูลได้',
            errorDetails: error instanceof Error ? error.message : String(error)
        };
    }
}; 