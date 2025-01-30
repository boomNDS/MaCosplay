import { error, redirect, invalid } from '@sveltejs/kit';
import { registerUserSchema } from '$lib/schemas';
import { generateUsername, validateData } from '$lib/utils';
import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

export const actions = {
	default: async ({ locals, request }) => {
		const { formData, errors } = await validateData(await request.formData(), registerUserSchema);
		const adminClient = await new PocketBase(import.meta.env.VITE_PB_URL);
		await adminClient.admins.authWithPassword(
			import.meta.env.VITE_AUTH_ADMIN_NAME,
			import.meta.env.VITE_AUTH_ADMIN_PASS,
			{
				// This will trigger auto refresh or auto reauthentication in case
				// the token has expired or is going to expire in the next 30 minutes.
				autoRefreshThreshold: 30 * 60
			}
		);

		console.log(formData);

		let username = formData.name.split(' ').join('').toLowerCase();
		const resultList = await adminClient.collection('users').getList(1, 1, { sort: '-created' });
		console.log(serializeNonPOJOs(resultList?.items[0].UserNumber));
		const UserNumAdd = resultList?.items[0].UserNumber + 1;
		let UserNumber = UserNumAdd;
		/* let packages = 'eq0tudgxce90g0o' */
		try {
			console.log('success');
			await adminClient.collection('users').create({ username, ...formData, UserNumber, MaxShop: 1, VerifyShop: "ยังไม่ได้ยืนยันร้านค้า" });
			await adminClient.collection('users').requestVerification(formData.email);
		
			console.log('create new user');
			
		} catch (err) {
			if (err.data?.data?.username?.code) {
				return { errors: { username: 'Username already exists' } };
			}
			if (err.data?.data?.email?.code) {
				return { errors: { email: 'Email already exists' } };
			}
			if (err.data?.data?.password?.code) {
				return { errors: { password: 'Password does not meet requirements' } };
			}
		
			console.error('Unexpected error:', err);
			return { errors: { general: 'An unexpected error occurred.' } };
		}
		throw redirect(303, '/login');
	}
};
