import axios from 'axios';
import { API_BASE_URL } from './constants';

const config = {
	headers: {
		"Content-Type": "application/json"
	},
	withCredentials: true
}

export async function login(req) {
	const response = await axios.post(`${API_BASE_URL}/login`, req, config).then((res) => res).catch((e) => e)
	return response;
}

export async function signup(req) {
	const response = await axios.post(`${API_BASE_URL}/signup`, req).then((res) => res).catch((err) => err)
	return response;
}

export async function getDevice() {
    const response = await axios.get(`${API_BASE_URL}/devices/`)
     return response.data
}

export async function getDeviceFromID(id) {
    const response = await axios.get(`${API_BASE_URL}/devices/${id}`)
     return response.data
}

export async function addDevice(device) {
	const response = await axios.post(`${API_BASE_URL}/devices`, device).catch(() => { })
	return response;
}

export async function deleteDevice(id) {
	await axios.delete(`${API_BASE_URL}/devices/${id}`).catch(() => { })
}

export async function bookDevice(bookData) {
	const response = await axios.post(`${API_BASE_URL}/book`,bookData).catch(() => { })
	return response
}

export async function updateDevice(device) {
	const response = await axios.put(`${API_BASE_URL}/devices`, device).catch(() => { })
	return response
}

export async function sendMail(data) {
	console.log(data)
	const response = await axios.post(`${API_BASE_URL}/email`, data).catch(() => { })
	return response
}
