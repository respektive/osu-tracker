const axios = require('axios').default
const logger = require('electron-log');
const Store = require('electron-store')
const axiosRetry = require('axios-retry')

axiosRetry(axios, {
    retries: 5, // number of retries
    retryDelay: (retryCount) => {
        logger.warn(`api request failed, retrying attempt ${retryCount}`)
        return retryCount * 2000 // time interval between retries
    }
})

const store = new Store();

async function getAccessToken() {
    const settings = store.get("settings");
    if (!settings) return null
    const { client_id, client_secret } = settings

    let accessToken = store.get("access_token")
    if (accessToken && Date.now() < accessToken.expires_on * 1000 * 60 * 10 ) {
        // token is still valid
        return accessToken.access_token
    }

    const headers = {
          "Accept": "application/json",
          "Content-Type": "application/json",
    }
        
    const body = {
          "client_id": client_id,
          "client_secret": client_secret,
          "grant_type": "client_credentials",
          "scope": "public"
    }

    try {
        const response = await axios.post('https://osu.ppy.sh/oauth/token', body, { headers: headers })
        accessToken = response.data
        accessToken.expires_on = Date.now() + (accessToken.expires_in * 1000)
        store.set("access_token", accessToken)
        return accessToken.access_token
    } catch (err) {
        logger.error(err)
        return null
    }
}

async function getScoreRank() {
    const settings = store.get("settings")
    if (!settings) return null
    const { user_id, gamemode } = settings

    try {
        const response = await axios.get(`https://score.respektive.pw/u/${user_id}?mode=${gamemode ?? "osu"}`)
        const scoreRank = response.data
        return scoreRank[0]
    } catch (err) {
        logger.error(err)
        return null
    }
}

async function getOsuUser() {
    const settings = store.get("settings")
    if (!settings) return null;
    const { user_id, gamemode } = settings
    const access_token = await getAccessToken()
    if (!access_token) return null;
    const api = axios.create({
        baseURL: 'https://osu.ppy.sh/api/v2',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${access_token}`,
            "x-api-version": 20220707
        }
    })

    axiosRetry(api, {
        retries: 5, // number of retries
        retryDelay: (retryCount) => {
            logger.warn(`api request failed, retrying attempt ${retryCount}`)
            return retryCount * 2000 // time interval between retries
        }
    })
    
    try {
        const response = await api.get(`https://osu.ppy.sh/api/v2/users/${user_id}/${gamemode ?? "osu"}`)
        const user = response.data
        user.gamemode = gamemode ?? "osu"
        store.set("username", user.username)
        return user
    } catch (err) {
        logger.error(err)
        if (err.response.status === 401) {
            store.set("access_token", null)
            await getAccessToken()
            const retried_user = await getOsuUser()
            return retried_user
        }
        return null
    }
}     

module.exports = {
    getOsuUser,
    getScoreRank
}