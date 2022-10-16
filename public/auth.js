function refreshToken(token) {
    return fetch('http://192.168.0.100:8081/auth/updateAccessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh_token: token,
            }),
        })
        .then((res) => {
            if (res.status === 200) {
                saveTokenData(res.json()); // сохраняем полученный обновленный токен в sessionStorage, с помощью функции, заданной ранее
                return Promise.resolve();
            }
            return Promise.reject();
        });
}


async function fetchWithAuth(url, options) {

    const loginUrl = 'http://localhost:8080/login';
    let tokenData = null;

    if (localStorage.tokenData) {
        tokenData = JSON.parse(localStorage.tokenData);
    } else {
        return window.location.replace(loginUrl);
    }
    console.log(options);
    if (!options.headers) {
        options.headers = {};
    }

    if (tokenData) {
        if (Date.now() >= localStorage.expTime) {
            try {
                // const newToken =
                await refreshToken(tokenData.refresh_token);
                // saveTokenData(newToken);
            } catch (e) {
                return window.location.replace(loginUrl);
            }
        }

        options.headers.Authorization = `${tokenData.access_token}`;
    }

    return fetch(url, options);
}



$(document).ready(function() {

    $("#login").on("click",
        async function() {
            await getTokenData(document.getElementById('email').value, document.getElementById('password').value);
        });

    function saveTokenData(token) {
        // console.log(token);
        let decodeToken = parseJwt(token["access_token"]);
        // console.log(decodeToken);
        localStorage.setItem("expTime", JSON.stringify(decodeToken["exp"]));
        localStorage.setItem("tokenData", JSON.stringify(token));
        return decodeToken;
    }

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    async function getTokenData(email, password) {
        const res = await fetch('http://192.168.0.100:8081/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        const data = await res.json();
        
        if (res.status == 200) {
            var decodedToken = saveTokenData(data);
            switch(decodedToken['role']){
                case 'SUPERVISOR':
                    return window.location.replace("http://localhost:8080/dispatcher");
                case 'CLIENT':
                    return window.location.replace("http://localhost:8080/client");
            }
            console.log(decodedToken);
        }

        // .then((res) => {
        //     if (res.status === 200) {
        //         saveTokenData(res.json());
        //         return Promise.resolve();
        //     }
        //     return Promise.reject();
        // });
    }

    


    // var res = parseJwt("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYUBiYi5ydSIsInJvbGUiOiJTVVBFUlZJU09SIiwidXNlcklkIjoxLCJpYXQiOjE2NjU4MzI1NTYsImV4cCI6MTY2NjQzNzM1Nn0.gJibU4PHCfO1nF04PkDzKPwPXSKyQftA0n75Yc2fUrc0");
    // console.log(res);
    //
    //
    // var email = "aa@bb.ru";
    // var password = "admin";

});