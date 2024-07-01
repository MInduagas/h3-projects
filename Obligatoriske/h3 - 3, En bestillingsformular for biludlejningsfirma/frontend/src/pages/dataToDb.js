const ipaddress = 'http://localhost:7889';

const postData = async (fetchPath, data) => {
    return await fetch(ipaddress+fetchPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .catch(err => console.log(err));
}

const getData = async (fetchPath) => {
    return await fetch(ipaddress+fetchPath, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.log(err));
}

module.exports = {
    postData,
    getData
}