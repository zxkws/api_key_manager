
// 第三方鉴权 API 的 URL
const THIRD_PARTY_AUTH_API_URL = 'https://example.com/auth'; 


export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        // 调用第三方 API 进行鉴权
        const response = await fetch(THIRD_PARTY_AUTH_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({})
        });

        console.log(response)

        if (response.ok) {
            // 鉴权成功，将用户信息挂载到请求对象上
            req.user = response.data;
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
