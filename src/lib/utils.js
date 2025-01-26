
const randomBytes = (length) => {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return array;
};

export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf) >> (c === 'x' ? 0 : 1);
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const serializeNonPOJOs = (obj) => {
	return structuredClone(obj);
};

export const generateUsername = (name) => {
	const id = randomBytes(2).toString('hex');
	return `${name.slice(0, 6)}${id}`;
};

export const generatePassword = () => {
	const passwordLength = 8;
	const characters = '0123456789zxcvbnmasdfghjklqwertyuiop';
	let password = '';

	const randomArray = randomBytes(passwordLength);
	randomArray.forEach((byte) => {
		const randomIndex = byte % characters.length;
		password += characters.charAt(randomIndex);
	});

	return password;
};

export const getImageURL = (collectionId, recordId, fileName, size = '0x0') => {
	return `http://localhost:8090/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};

export const validateData = async (formData, schema) => {
	const body = Object.fromEntries(formData);

	try {
		const data = schema.parse(body);
		return {
			formData: data,
			errors: null
		};
	} catch (err) {
		console.log('Error: ', err);
		const errors = err.flatten();
		return {
			formData: body,
			errors
		};
	}
};




export function getLocaleFromCookie(cookies, defaultLocale = 'th') {

	const cookie = cookies.get('locale')

	if (cookie) {
		return cookie;
	} else {
		cookies.set('locale', defaultLocale);
		return defaultLocale;

	}
	
	// If no locale cookie exists, set it with the default value
	
  }

// src/lib/utils.js

export function getInviteCodeFromCookie(cookies) {
    const inviteCodeCookie = cookies.get('invite_code');
    return inviteCodeCookie || null;
}
