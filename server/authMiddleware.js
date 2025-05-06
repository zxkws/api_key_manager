
// 第三方鉴权 API 的 URL
const THIRD_PARTY_AUTH_API_URL = 'https://api.zxkws.nyc.mn/api/v1/user'; 


export const authMiddleware = async (req, res, next) => {    
    const token = req.headers.authorization;
    const cookieStr = req.headers.cookie;

    if (!token && !cookieStr) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        // 调用第三方 API 进行鉴权
        const response = await fetch(THIRD_PARTY_AUTH_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
                'Cookie': cookieStr
            }
        });

        const data = await response.json();

        if (data && !data.error) {
            req.user = data;
            next();
        } else {
            // 鉴权失败
            return res.status(403).send({ message: 'Invalid access token' });
        }
    } catch (error) {
        console.error('Error authenticating token:', error);
        return res.status(500).send({ message: 'Internal server error' });
    }
};
