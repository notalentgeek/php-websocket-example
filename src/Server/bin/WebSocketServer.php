<?php
use App\Server\WSServer\WebSocketManager;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

require dirname(__DIR__) . '../../../vendor/autoload.php';

$webSocketServer = IoServer::factory(
    new HttpServer(
        new WsServer(
            new WebSocketManager()
        )
    ),
    8080
);

$webSocketServer->run();
?>