import Pusher from 'pusher-js'

const API_KEY = import.meta.env.VITE_PUSHER_KEY as string;

const pusher = new Pusher(API_KEY, {
  cluster: "us2"
});

export const channel = pusher.subscribe("goal-channel");