# Egnyte Task

So, here it is :) Run `npm install` and then `npm start` in client and/or server directories to start respective app.

## Summary

### Key feature

Key feature is implemented as asked, with one missing part - I haven't managed to finish the case about losing internet connection. Last commit provides some groundwork on that front on client side - idea would be to reconnect on closing websocket, but apparently even turning "offline" mode in Chrome throttling profiles doesn't really kill existing WebSocket connection. This (and therefore inability to test how exactly WebSocket messages sent after losing connection behave, how they could be repurposed and so on) + unfortunate scarcity of time on my side stopped me from implementing this. Hopefully it is enough :)

### Bonus tasks

- Scalability  
Few words on this, as I haven't had time to actually work on this (and never really worked deeper on such things, so it's more of a loose thoughts kind of thing) - first step towards this goal would be replacing implemented in-memory data storage for some connection to external storage, so data could actually be shared between multiple instances of running server. Then we'd probably need some load balancers and some kind of spawning mechanism for next instances, according to incoming traffic.

- SSL  
Missing in implementation, sorry :)

