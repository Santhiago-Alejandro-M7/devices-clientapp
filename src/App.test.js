import { render, screen } from '@testing-library/react';
import App from './App';

test('Get all data from the API.', async() => {
  const api_call = await fetch('http://localhost:3000/devices');
    const data = await api_call.json();
    var res = [];
            for(var i in data)
                res.push(data[i]);
    expect(res.length).toBeGreaterThan(0)
});


test('Get devices by ID ', async() => {
  const api_call = await fetch('http://localhost:3000/devices/e8okoP2l5');
    const data = await api_call.json();
    expect(data).not.toBeNull();
});

test('Add a new device', async() => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system_name: "my-mac", 
    type: "MAC-MINI", 
    hdd_capacity: "64" })
};

const api_call = await  fetch('http://localhost:3000/devices', requestOptions);
const data = await api_call.json();
expect(data).not.toBeNull();
});

test('Update information of device', async() => {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system_name: "MIMAC", 
    type: "MAC", 
    hdd_capacity: "64" })
};

const api_call = await  fetch('http://localhost:3000/devices/e8okoP2l5', requestOptions);
const data = await api_call.json();
expect(data).not.toBeNull();
});