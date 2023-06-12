// login에서 import
export async function socialLogin(social) {
    // console.log("인가코드 받기")
    const url = `${back_base_url}/users/social/`;
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",

        },
        method: 'POST',
        body: JSON.stringify({
            social,
        }),
    });
    if (response.status === 200) {
        const responseJson = await response.json();
        if (social == 'kakao-login') {
            console.log('카카오')
            window.location.href = responseJson.url;
        }
        if (social == 'google') {
            console.log('google')
            oauthSignIn(responseJson.key, responseJson.redirecturi)
        }
        if (social == 'naver') {
            console.log('naver')
            window.location.href = responseJson.url;
        }
    }
}


// index에서 import
export async function sendCode() {
    // console.log("인가코드 받고 인가 코드 send 후 post 처리")
    var currentUrl = window.location.href
    var urlWithoutQuery = currentUrl.split('?')[0]
    let social = null
    let code = new URLSearchParams(window.location.search).get('code')
    let state = null
    console.log(code)
    if (code) {
        state = new URLSearchParams(window.location.search).get('state')
        if (state) {
            social = 'naver-login'
        }
        else {
            social = 'kakao-login'
        }
    }
    else {
        social = 'google'
        urlWithoutQuery = currentUrl.split('#')[0]
        code = new URLSearchParams(location.href).get('access_token')
    }
    if (code) {
        const url = `${back_base_url}/users/${social}/`

        let body = { code, }
        if (state) {
            body.state = state
        }
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",

            },
            method: 'POST',
            body: JSON.stringify(body)
        })
        if (response.status == 200) {
            const response_json = await response.json()
            localStorage.setItem('refresh', response_json.refresh)
            localStorage.setItem('access', response_json.access)
            const base64Url = response_json.access.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''))
            localStorage.setItem('payload', jsonPayload)
            window.location.href = urlWithoutQuery
        }
    }
}




    // var currentUrl = window.location.href
    // var urlWithoutQuery = currentUrl.split('?')[0]
    // if (response.status == 200) {
    //     var currentUrl = window.location.href
    //     let code = new URL(window.location.href)
    //     let code_ = code.searchParams.get('code')
    //     // let code = new URLSearchParams(window.location.search).get('code')
    //     console.log(currentUrl)
    //     console.log(code)
    //     console.log(code_)
    // }