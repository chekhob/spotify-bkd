import axios from "axios";

// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization

async function getWebToken(client_id: string | undefined, client_secret: string | undefined) {
    //     var client_id = 'CLIENT_ID';
    // var client_secret = 'CLIENT_SECRET';

    // let token: string| undefined;

    let bearerToken = Buffer.from(client_id + ':' + client_secret).toString('base64');

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + bearerToken
        },
        data: new URLSearchParams({
            grant_type: 'client_credentials'
        })
    };

    try {
        const response = await axios(authOptions);
        if (response.status === 200) {
            console.log({ data: response.data });
            return response.data.access_token;
        }
    } catch (error) {
        console.log({ error });
        return null;
    }
}

// async function refreshAccessToken() {
//     const response = await axios.post('https://accounts.spotify.com/api/token',
//         new URLSearchParams({
//             grant_type: 'refresh_token',
//             refresh_token: process.env.REFRESH_TOKEN!
//         }),
//         {
//             headers: {
//                 'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
//             }
//         }
//     );

//     return await response.data.access_token;
// }


async function refreshAccessToken() {
    const refreshToken = process.env.REFRESH_TOKEN;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    if (!refreshToken || !clientId || !clientSecret) {
        throw new Error('Missing required environment variables for token refresh');
    }

    const response = await axios.post('https://accounts.spotify.com/api/token',
        new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }),
        {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            }
        }
    );

    return response.data.access_token;
}

async function fetchWebApi(
    endpoint: string,
    method: string,
    body: object | undefined,
    token: string | undefined
) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body),
    });
    return res.json();
}

async function getTopTracks(token: string | undefined) {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    let body: any;
    console.log('this ran');
    return (
        await fetchWebApi(
            "v1/me/top/tracks?time_range=long_term&limit=10",
            "GET",
            body,
            token
        )
    ).items;
}

export { getTopTracks, refreshAccessToken };
