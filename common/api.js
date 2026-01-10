const BASE_URL = 'https://erp.corezen.site';

export const request = (options) => {
	return new Promise((resolve, reject) => {
		const sessionId = uni.getStorageSync('sessionid');
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: {
				'content-type': 'application/json',
				'Cookie': sessionId ? `sessionid=${sessionId}` : '' 
			},
			success: (res) => {
				if (options.url.includes('/api/login')) {
					const cookies = res.header['Set-Cookie'] || res.header['set-cookie'];
					if (cookies) {
						const match = cookies.match(/sessionid=(.*?);/);
						if (match && match[1]) uni.setStorageSync('sessionid', match[1]);
					}
				}
				if (res.statusCode === 200) {
					resolve(res.data);
				} else if (res.statusCode === 403 || res.statusCode === 302) {
					uni.reLaunch({ url: '/pages/login/login' });
				} else {
					uni.showToast({ title: '系统繁忙', icon: 'none' });
					reject(res);
				}
			},
			fail: (err) => {
				uni.showToast({ title: '网络连接失败', icon: 'none' });
				reject(err);
			}
		});
	});
}