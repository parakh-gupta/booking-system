import axios from 'axios';
    const baseUrl = 'http://localhost:5000';
   
    export async function login(req) {
        const response = await axios.post(`${baseUrl}/login`,req)
        return response;
    }

    export async function addDevice(device) {
        const response = await axios.post(`${baseUrl}/devices`,device)
        return response;
    }

    export async function deleteDevice(id) {
        await axios.delete(`${baseUrl}/devices/${id}`)
    }

    export async function getDevice() {
        const response = await axios.get(`${baseUrl}/devices/`)
        return response
    }

    export async function updateDevice(device) {
        const response = await axios.put(`${baseUrl}/devices`,device)
        return response
    }
  