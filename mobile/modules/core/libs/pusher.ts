import Pusher from 'pusher-js'

const API_KEY = process.env.EXPO_PUBLIC_PUSHER_APIKEY as string;
console.log(process.env.EXPO_PUBLIC_PUSHER_APIKEY );
const pusher = new Pusher(API_KEY, {
  cluster: "us2"
});

export const channel = pusher.subscribe("goal-channel");