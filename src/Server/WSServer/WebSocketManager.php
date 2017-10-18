<?php
namespace App\Server\WSServer;
use Ratchet\{ ConnectionInterface, MessageComponentInterface };

class WebSocketManager implements MessageComponentInterface {
    protected $clients;

    public function __construct () {
        $this->clients = new \SplObjectStorage;
    }

    /*
    This function will be triggered when a client is disconnected from this
    WebSocket server.
    */
    public function onClose (ConnectionInterface $conn) {
        // Remove the client's connection from the `$conn` map.
        $this->clients->detach($conn);

        // Broadcast quited client to all other clients.
        foreach ($this->clients as $client) {
            $client->send(json_encode([
                "eventName" => "quitedClient",
                "value" => $conn->resourceId
            ]));
        }

        echo "client with id: {$conn->resourceId} is disconnected\n";
    }

    // If an error happened, show the error message and disconnect the client.
    public function onError (ConnectionInterface $conn, \Exception $e) {
        // Print some string to this WebSocket server's terminal.
        echo "client with id: {$conn->resourceId} has error:
            {$e->getMessage()}\n";
        echo "client with id: {$conn->resourceId} is disconnected\n";

        // Close WebSocket connection.
        $conn->close();
    }

    /*
    This function will be triggered when any message is retrieved from clients.
    For this example the message is simply broad-castes into all connected
    clients.
    */
    public function onMessage (ConnectionInterface $from, $msg) {
        // Number of connected clients
        $connectedClients = count($this->clients);

        // Decode JSON
        $msgClean = json_decode($msg, true);

        if ($msgClean["eventName"] == "broadcastMessageToAllClients") {
            /*
            Send the same message from all connected clients, but not `$from` in
            the `$this->clients` pool.
            */
            foreach ($this->clients as $client) {
                if ($client != $from) {
                    $client->send(json_encode([
                        "eventName" => "receiveMessage",
                        "value" => $from->resourceId
                    ]));
                }
            }
        }
        else if ($msgClean["eventName"] == "requestID") {
            $from->send(json_encode([
                "eventName" => "requestID",
                "value" => $from->resourceId
            ]));
        }
        else if ($msgClean["eventName"] == "sendPersonalMessage") {
            foreach ($this->clients as $client) {
                if ($client->resourceId == (int)$msgClean["value"]) {
                    $client->send(json_encode([
                        "eventName" => "receiveMessage",
                        "value" => $from->resourceId
                    ]));
                }
            }
        }

        // Print a formatted string into server's console
        echo sprintf(
            'client with id: %d sent a message: "%s"'."\n",
            $from->resourceId, $msg, $connectedClients,
            $connectedClients == 1 ? '' : 's'
        );
    }

    /*
    This function will be triggered when a new client connects to this WebSocket
    server.
    */
    public function onOpen (ConnectionInterface $conn) {
        /*
        This line of codes below is meant to save `$conn` to be used later.
        `clients` itself is a PHP map like object to store objects. I think,
        this is similar to JavaScript/Python dictionary.
        */
        $this->clients->attach($conn);

        /*
        If there is a WebSocket connection from a new client, print a string and
        the new client's WebSocket ID into the server's console.
        */
        echo "new connection from client with id: {$conn->resourceId}\n";
    }
}
?>