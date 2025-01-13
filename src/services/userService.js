import http from "./httpService";

// const apiEndpoint = "http://10.106.1.4:5000/api/users/register";

// export function register(user) {
//   return http.post(apiEndpoint, {
//     email: user.username,
//     mobile_number : user.mobile_number,
//     password: user.password,
//     name: user.name,
//   });
// }

// import http from './httpserver';

const apiEndpoint = "https://micro-lending.onrender.com/api/users/login";
export function register(user) {
    // console.log(apiEndpoint, "hhhhhh");
    return http.post(apiEndpoint, {
        name: user.name,
        phone_number: user.phone_number,
        password: user.password,
        confirmPassword: user.confirmPassword
    });
}