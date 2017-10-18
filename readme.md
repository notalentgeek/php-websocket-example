# PHP WebSocket Example

This example shows you on how to have "vanilla" WebSocket with PHP.

Non-vanilla "WebSocket" is something like Socket.IO that can simulate normal HTTP protocol to behave like WS protocol. Socket.IO always uses WS if the browser support. However, since WebSocket and its protocol are only available in modern browser, Socket.IO provides fail-safe. In case WS protocol does not exists, the WebSocket will be simulated in HTTP. So in any scenario (afaik), Socket.IO always superior to vanilla WebSocket (not sure about the performance, though).

Same like HTTPS, the WS protocol also offers WSS as its more secure counterpart.

The main problem here is that, Socket.IO is only made for Node.JS. There are some third party forks for PHP and Python, but the repositories are very small. Hence, for this example I use Ratchet + PHP, which only works with WS protocol. So, there is no support for older browser.

## How to use this example?

* I keep the `bower` and `composer` dependencies in this repository. No need to initiate and setup.
* Install PHP7 (I guess it is fine with PHP5 as well, it just the mass `use` in the WebSocketManager.php that is unique to PHP7)
* From this repository root go to ./src/Server/bin and then run `php WebSocketServer.php`, keep this open!
* From this repository root go to ./src/Client and open (with modern browser) client.html.
* You can open multiple client.html and play around! It is real-time web as long the WebSocket server is still running.
* It can detect when a client quits as well (browser refresh counts!).