import{r as u,u as p,j as e,S as x,a as h}from"./index-w8OPScTq.js";import{E as j,S as g,s as o,u as S}from"./SuccessToast-ts7nQF6R.js";function b(){const[s,r]=u.useState(!1),[a,t]=u.useState("");async function i(n){r(!0);const c=`/api/v1/friends/send-request/${n}`,l={method:"POST",credentials:"include"};try{const m=await(await fetch(c,l)).json();return r(!1),m.ok?!0:(t(m.error),setTimeout(()=>t(""),4e3),!1)}catch{t("An un-expected error occurred"),r(!1)}}return{loading:s,apiError:a,sendFriendRequest:i}}function f({friend:s}){const{loading:r,apiError:a,sendFriendRequest:t}=b(),[i,n]=u.useState(!1),{user:c}=p();return e.jsxs("div",{className:"flex items-center justify-between p-4 rounded-lg bg-gray-800 w-full",children:[e.jsxs("div",{className:"flex",children:[e.jsx("img",{src:s.profilePicture,alt:"profile picture",className:"w-16 h-16 rounded-full object-cover inline mr-4"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-300 font-medium text-lg mb-0",children:s.fullname}),s.bio?e.jsx("p",{className:"text-gray-400 text-md mt-0",children:s.bio}):e.jsx("i",{className:"text-gray-400 text-md mt-0",children:"No bio provided"})]})]}),c&&(c.pending_requests.includes(s._id)||c.friends.includes(s._id)||c._id===s._id)?null:e.jsx("button",{onClick:l,className:`btn btn-accent ${r&&"disabled"}`,children:r?e.jsx(x,{}):"Add Friend"}),a&&e.jsx(j,{error:a}),i&&e.jsx(g,{success:"Request sent successfully!"})]});async function l(){await t(s._id)&&(n(!0),setTimeout(()=>n(!1),4e3))}}f.propTypes={friend:{_id:o,fullname:o,bio:o,profilePicture:o}};function N(){const[s,r]=h(),{loading:a,error:t,resp:i}=S(`/api/v1/user/search?name=${s.get("name")}`,[s.get("name")]);return a?e.jsx("div",{className:"flex items-center justify-center mx-auto w-1/2 min-h-screen",children:e.jsx(x,{})}):t?e.jsx("div",{className:"flex items-center justify-center mx-auto w-1/2 min-h-screen",children:e.jsx("p",{className:"text-red-400 text-lg",children:t})}):e.jsxs("div",{className:"flex flex-col items-center justify-start w-full p-4 lg:w-1/2 mx-auto",children:[e.jsxs("h1",{className:"font-bold text-gray-200 text-left text-2xl p-2 mb-8 mt-6",children:["Showing results for ",s.get("name")]}),i.map(n=>e.jsx(f,{friend:n},n._id))]})}export{N as default};